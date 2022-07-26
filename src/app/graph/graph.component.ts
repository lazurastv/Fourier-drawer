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
  drawer: GraphOperations = {} as GraphOperations;
  previousPosition?: Point;
  currentPosition?: Point;

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

    this.movePosition(event);
    this.drawer.drawLine(this.previousPosition, this.currentPosition);
  }

  handleMouseDown(event: MouseEvent) {
    this.resetChange.emit(false);
    this.movePosition(event);
    this.drawing = true;
  }

  movePosition(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.previousPosition = this.currentPosition;
    this.currentPosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  handleMouseUp() {
    this.disableDrawing();
  }

  handleMouseLeave() {
    this.disableDrawing();
  }

  disableDrawing() {
    this.currentPosition = undefined;
    this.drawing = false;
  }

  handleReset() {
    this.drawer.reset();
  }

  updateTime(): void {
    this.time += 0.1;
    this.time %= 15;
  }

}
