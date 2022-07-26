import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import ComplexNumber from './ft/complex-number';
import { dft, idft } from './ft/dft';
import { GraphOperations } from './graph-operations';

@Component({
  selector: 'graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.sass']
})
export class GraphComponent implements OnChanges, AfterViewInit {

  @Input()
  reset: boolean = false;
  @Input()
  terms: number = 0;
  @Input()
  circles: boolean = false;
  @Input()
  rendersPerTick: number = 5;

  @Output()
  resetChange = new EventEmitter<boolean>();
  @Output()
  termsChange = new EventEmitter<number>();

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement> = {} as ElementRef;

  static readonly POINTS_PER_SECOND = 120;

  drawing: boolean = false;
  points: ComplexNumber[] = [];
  dftPoints: ComplexNumber[] = [];
  drawer: GraphOperations = {} as GraphOperations;

  render: number = 0;
  tick: number = 0;
  prevTime?: number;

  ngAfterViewInit(): void {
    this.drawer = new GraphOperations(this.canvas.nativeElement);
    this.resizeEvent();
    fromEvent(window, 'resize').subscribe(this.resizeEvent);
  }

  resizeEvent = () => {
    this.canvas.nativeElement.width = Math.min(window.innerWidth - 100, 800);
    this.canvas.nativeElement.height = 5 / 8 * this.canvas.nativeElement.width;
    this.drawer.reset();
  }

  ngOnChanges(changes: SimpleChanges) {
    const prevReset = changes['reset']?.previousValue;
    if (prevReset === false && this.reset === true) {
      this.handleReset();
    }
    const termsChange = changes['terms'];
    if (termsChange?.firstChange === false) {
      this.dftPoints = [];
    }
    const rendersPerTickChange = changes['rendersPerTick'];
    if (rendersPerTickChange?.previousValue === 0) {
      this.animate(dft(this.points));
    }
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.drawing) return;
    this.addPoint(event);
    this.drawer.drawPoints(this.points);
  }

  handleMouseDown() {
    if (this.drawing) return;
    this.handleReset();
    this.resetChange.emit(false);
    this.drawing = true;
  }

  addPoint(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const point = new ComplexNumber(event.clientX - rect.left - this.drawer.width / 2, event.clientY - rect.top - this.drawer.height / 2);
    const prevPoint = this.points[this.points.length - 1];

    if (!prevPoint || !prevPoint.equals(point)) this.points.push(point);
  }

  handleMouseUp() {
    this.drawing = false;
    this.termsChange.emit(this.points.length);
    this.animate(dft(this.points));
  }

  handlePanstart() {
    this.handleMouseDown();
  }

  handlePan(e: HammerInput | Event) {
    e = e as HammerInput;
    const mouseEvent = {
      clientX: e.center.x,
      clientY: e.center.y
    } as MouseEvent;
    this.handleMouseMove(mouseEvent);
  }

  handlePanend() {
    this.handleMouseUp();
  }

  handleReset() {
    this.points = [];
    this.dftPoints = [];
    this.tick = 0;
  }

  increaseTime(): void {
    const delta = Date.now() - (this.prevTime ?? 0);
    if (delta < 1000 / GraphComponent.POINTS_PER_SECOND) return;

    this.prevTime = Date.now();

    this.render += 1;
    if (this.render < this.rendersPerTick) return;
    this.render = 0;
    this.tick = this.nextTick;
  }

  animate(dftCoeffs: ComplexNumber[]) {
    if (this.rendersPerTick === 0) return;
    this.drawer.reset();
    if (this.drawing || this.points.length === 0) return;

    this.drawer.drawPoints(this.points, true);

    const idftCoeffs = idft(dftCoeffs, this.tick).slice(0, this.terms + 1);
    const nextIdftCoeffs = idft(dftCoeffs, this.nextTick).slice(0, this.terms + 1);
    const currentWeight = new ComplexNumber(this.rendersPerTick - this.render);
    const nextWeight = new ComplexNumber(this.render);
    for (let i = 0; i < idftCoeffs.length; i++) {
      const current = idftCoeffs[i].multiply(currentWeight);
      const next = nextIdftCoeffs[i].multiply(nextWeight);
      idftCoeffs[i] = current.add(next).divide(this.rendersPerTick);
    }

    this.drawer.drawRadii(idftCoeffs);
    if (this.circles) this.drawer.drawCircles(idftCoeffs);

    this.dftPoints[this.tick] = idftCoeffs.pop()!;
    this.drawer.drawPoints(this.dftPoints);

    this.increaseTime();
    window.requestAnimationFrame(() => this.animate(dftCoeffs));
  }

  get nextTick(): number {
    return (this.tick + 1) % this.points.length;
  }

}
