import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { GraphOperations } from './graph-operations';
import { Point } from './point';

@Component({
  selector: 'graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.sass']
})
export class GraphComponent implements OnChanges, AfterViewInit {

  @Input()
  reset: boolean = false;

  @Output()
  resetChange = new EventEmitter<boolean>();

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement> = {} as ElementRef;


  drawing: boolean = false;
  points: Point[] = [];
  drawer: GraphOperations = {} as GraphOperations;

  time: number = 0;

  ngAfterViewInit(): void {
    this.drawer = new GraphOperations(this.canvas.nativeElement);
    this.drawer.reset();
  }

  ngOnChanges(changes: SimpleChanges) {
    const prevReset = changes['reset'].previousValue;
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
    const point = new Point(event.clientX - rect.left, event.clientY - rect.top);
    const prevPoint = this.points[this.points.length - 1];

    if (!prevPoint || !prevPoint.equals(point)) this.points.push(point);
  }

  handleMouseUp() {
    this.drawer.drawPoints(this.points, true);
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

  updateTime(): void {
    this.time += 0.1;
    this.time %= 15;
  }

}
