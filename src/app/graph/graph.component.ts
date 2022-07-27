import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import ComplexNumber from './ft/complex-number';
import { dft } from './ft/dft';
import interpolateIdft from './ft/idft-interpolator';
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
  maxTermsChange = new EventEmitter<number>();

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement> = {} as ElementRef;

  static readonly POINTS_PER_SECOND = 120;

  drawing: boolean = false;
  points: ComplexNumber[] = [];
  dftPoints: ComplexNumber[] = [];
  drawer: GraphOperations = {} as GraphOperations;

  render: number = 0;
  tick: number = 0;
  startTick: number = 0;
  prevTime?: number;

  ngAfterViewInit(): void {
    this.drawer = new GraphOperations(this.canvas.nativeElement);
    this.resizeEvent();
    fromEvent(window, 'resize').subscribe(this.resizeEvent);
  }

  resizeEvent = () => {
    this.canvas.nativeElement.width = Math.min(window.innerWidth - 100, 800);
    this.canvas.nativeElement.height = 5 / 8 * this.canvas.nativeElement.width;
    this.drawer.clear();
  }

  ngOnChanges(changes: SimpleChanges) {
    const prevReset = changes['reset']?.previousValue;
    if (prevReset === false && this.reset === true) {
      this.handleReset();
    }
    const termsChange = changes['terms'];
    if (termsChange?.firstChange === false) {
      this.dftPoints = [];
      this.startTick = this.tick;
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
    this.maxTermsChange.emit(this.points.length);
    const dfts = dft(this.points);
    this.animate(dfts);
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
    this.render = 0;
    this.tick = 0;
    this.startTick = 0;
    this.drawer.clear();
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

  animate(dfts: ComplexNumber[]) {
    if (this.rendersPerTick === 0) return;
    this.drawer.clear();
    if (this.drawing || this.points.length === 0) return;

    this.drawer.drawPoints(this.points, true);
    const idftCoeffs = interpolateIdft(dfts, this.render, this.tick, this.rendersPerTick).slice(0, this.terms + 1);
    this.drawer.drawRadii(idftCoeffs);
    if (this.circles) this.drawer.drawCircles(idftCoeffs);

    const finished =
      this.dftPoints.length === this.points.length &&
      !(this.dftPoints as (ComplexNumber | undefined)[]).includes(undefined);

    const edgeTicks = [0, this.points.length - 1];
    if (!finished && (!edgeTicks.includes(this.tick) || this.dftPoints[this.tick] === undefined)) {
      this.dftPoints[this.tick] = idftCoeffs.pop()!;
    }

    this.drawer.drawPoints(this.dftPoints);
    this.increaseTime();
    window.requestAnimationFrame(() => this.animate(dfts));
  }

  get nextTick(): number {
    return (this.tick + 1) % this.points.length;
  }

}
