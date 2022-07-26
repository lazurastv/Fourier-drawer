import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Point } from './point';

@Component({
  selector: 'graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.sass']
})
export class GraphComponent implements AfterViewInit {

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement> = {} as ElementRef;
  context: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;

  drawing: boolean = false;
  previousPosition?: Point;
  currentPosition?: Point;

  time: number = 0;

  ngAfterViewInit(): void {
    const context = this.canvas.nativeElement.getContext('2d')!;
    this.context = context;
    context.lineWidth = 1;
    context.lineCap = 'round';
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.drawing) return;

    this.movePosition(event);
    this.drawInput();
  }

  handleMouseDown(event: MouseEvent) {
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
    console.log(this.previousPosition, this.currentPosition);
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

  updateTime(): void {
    this.time += 0.1;
    this.time %= 15;
  }

  repaint(): void {
    const context = this.context;
    context.clearRect(0, 0, 500, 500);
    this.drawCircle();
    this.updateTime();
  }

  drawCircle(): void {
    const anglesPerSecond = 2 * Math.PI / 15;
    const context = this.context;
    context.strokeStyle = "#000000";

    context.beginPath();
    context.moveTo(300, 300);
    context.arc(300, 300, 100, this.time * anglesPerSecond, 2 * Math.PI + this.time * anglesPerSecond);
    context.stroke();
  }

  drawInput() {
    const prevPos = this.previousPosition;
    const curPos = this.currentPosition;
    if (!prevPos || !curPos) return;

    const context = this.context;
    context.strokeStyle = "#000000";
    context.beginPath();
    context.moveTo(prevPos.x, prevPos.y);
    context.lineTo(curPos.x, curPos.y);
    context.stroke();
    context.closePath();
  }

}
