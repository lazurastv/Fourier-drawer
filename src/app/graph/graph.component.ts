import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
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
  terms?: number;
  @Input()
  circles: boolean = false;
  @Input()
  period: number = 1;

  @Output()
  resetChange = new EventEmitter<boolean>();

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement> = {} as ElementRef;


  drawing: boolean = false;
  points: ComplexNumber[] = [];
  drawer: GraphOperations = {} as GraphOperations;

  time: number = 0;
  prevTime?: number;

  ngAfterViewInit(): void {
    this.drawer = new GraphOperations(this.canvas.nativeElement);
    this.drawer.reset();
  }

  ngOnChanges(changes: SimpleChanges) {
    const prevReset = changes['reset']?.previousValue;
    if (prevReset === false && this.reset === true) {
      this.handleReset();
    }
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.drawing) return;
    this.addPoint(event);
    this.drawer.drawPoints(this.points);
  }

  handleMouseDown(event: MouseEvent) {
    this.resetChange.emit(false);
    this.addPoint(event);
    this.drawer.drawPoints(this.points);
    this.drawing = true;
  }

  addPoint(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const point = new ComplexNumber(event.clientX - rect.left - this.drawer.width / 2, event.clientY - rect.top - this.drawer.height / 2);
    const prevPoint = this.points[this.points.length - 1];

    if (!prevPoint || !prevPoint.equals(point)) this.points.push(point);
  }

  handleMouseUp() {
    const dftCoeffs = dft(this.points);
    this.animate(dftCoeffs);
    this.disableDrawing();
  }

  handleMouseLeave() {
    this.disableDrawing();
  }

  disableDrawing() {
    this.drawing = false;
  }

  handleReset() {
    this.points = [];
    this.drawer.reset();
  }

  increaseTime(): void {
    if (!this.prevTime) this.prevTime = Date.now();
    const delta = Date.now() - this.prevTime;
    const msPerPoint = 5000 * this.period / this.points.length;
    const increase = Math.floor(delta / msPerPoint);
    if (increase < 1) return;

    this.prevTime = Date.now();
    this.time += increase;
    this.time %= this.points.length;
  }

  animate(dftCoeffs: ComplexNumber[]) {
    this.drawer.reset();
    this.drawer.drawPoints(this.points);
    if (this.terms?.toString() === "") this.terms = undefined;
    this.drawer.drawRadii(idft(dftCoeffs.slice(0, this.terms), this.time));
    this.increaseTime();

    if (this.reset) {
      this.handleReset();
      return;
    }

    window.requestAnimationFrame(() => this.animate(dftCoeffs));
  }

}
