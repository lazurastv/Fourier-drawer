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
  speed: number = 5;

  @Output()
  resetChange = new EventEmitter<boolean>();
  @Output()
  termsChange = new EventEmitter<number>();

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement> = {} as ElementRef;


  drawing: boolean = false;
  points: ComplexNumber[] = [];
  dftPoints: ComplexNumber[] = [];
  drawer: GraphOperations = {} as GraphOperations;

  time: number = 0;
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
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.drawing) return;
    this.addPoint(event);
    this.drawer.drawPoints(this.points);
  }

  handleMouseDown(event: MouseEvent) {
    if (this.drawing) return;
    this.handleReset();
    this.resetChange.emit(false);
    this.addPoint(event);
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

  handleMouseLeave() {
    this.drawing = false;
  }

  handlePanstart(e: HammerInput | Event) {
    e = e as HammerInput;
    const mouseEvent = {
      clientX: e.center.x,
      clientY: e.center.y
    } as MouseEvent;
    this.handleMouseDown(mouseEvent);
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
    this.time = 0;
  }

  increaseTime(): void {
    if (!this.prevTime) this.prevTime = Date.now();
    if (this.speed === 0) {
      this.prevTime = undefined;
      return;
    }
    const delta = Date.now() - this.prevTime;
    const msPerPoint = 100 / this.speed;
    if (delta < msPerPoint) return;

    this.prevTime = Date.now();
    this.time += 1;
    this.time %= this.points.length;
  }

  animate(dftCoeffs: ComplexNumber[]) {
    this.drawer.reset();
    if (this.drawing || this.points.length === 0) return;

    this.drawer.drawPoints(this.points, true);
    const idftCoeffs = idft(dftCoeffs, this.time).slice(0, this.terms + 1);
    this.drawer.drawRadii(idftCoeffs);

    if (this.circles) this.drawer.drawCircles(idftCoeffs);

    this.dftPoints[this.time] = idftCoeffs.pop()!;
    this.drawer.drawPoints(this.dftPoints);

    this.increaseTime();
    window.requestAnimationFrame(() => this.animate(dftCoeffs));
  }

}
