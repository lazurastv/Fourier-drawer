import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import Complex from 'complex.js';
import { fromEvent } from 'rxjs';
import { fts, ift } from './ft/ft';
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
  terms: number = 50;
  @Input()
  circles: boolean = false;
  @Input()
  speed: number = 0.5;

  @Output()
  resetChange = new EventEmitter<boolean>();

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement> = {} as ElementRef;

  readonly POINTS_PER_SECOND = 120;

  drawing: boolean = false;
  points: Complex[] = [];
  ftCoeffs: Complex[] = [];
  ftPoints: Complex[] = [];
  drawer: GraphOperations = {} as GraphOperations;

  tick: number = 0;
  startTick?: number;
  loadFinished: boolean = false;
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
      this.ftPoints = [];
      this.ftCoeffs = this.newFtCoeffs;
      this.startTick = undefined;
      this.loadFinished = false;
    }
    const speed = changes['speed'];
    if (speed?.previousValue === 0) {
      this.animate();
    }
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.drawing) return;
    this.addPoint(event);
    this.drawer.clear();
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
    const point = new Complex(event.clientX - rect.left - this.drawer.width / 2, event.clientY - rect.top - this.drawer.height / 2);
    const prevPoint = this.points[this.points.length - 1];

    if (!prevPoint || !prevPoint.equals(point)) this.points.push(point);
  }

  handleMouseUp() {
    this.drawing = false;
    this.ftCoeffs = this.newFtCoeffs;
    this.animate();
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
    this.ftPoints = [];
    this.ftCoeffs = [];
    this.tick = 0;
    this.startTick = undefined;
    this.loadFinished = false;
  }

  increaseTime(): void {
    const delta = Date.now() - (this.prevTime ?? 0);
    if (delta < 1000 / this.POINTS_PER_SECOND) return;
    this.prevTime = Date.now();
    this.tick = this.nextTick;
  }

  animate() {
    if (this.speed === 0) return;
    this.drawer.clear();
    if (this.drawing || this.points.length === 0) return;

    this.drawer.drawPoints(this.points, true);
    const idftPoints = ift(this.tick / this.points.length, this.ftCoeffs);
    this.drawer.drawRadii(idftPoints);
    if (this.circles) this.drawer.drawCircles(idftPoints);
    if (!this.loadFinished) this.ftPoints.push(idftPoints.pop()!);
    this.drawer.drawPoints(this.ftPoints);

    this.startTick ??= this.tick;
    this.loadFinished = this.loadFinished || this.tick < this.startTick && (this.nextTick >= this.startTick || this.tick > this.nextTick);
    this.increaseTime();
    window.requestAnimationFrame(() => this.animate());
  }

  get nextTick(): number {
    return (this.tick + this.speed) % this.points.length;
  }

  get newFtCoeffs(): Complex[] {
    return fts(this.terms, this.points);
  }

}
