import Complex from "complex.js";
import CircleDrawer from "./shapes/circle-drawer";
import ColorLineDrawer from "./shapes/color-line-drawer";
import LineDrawer from "./shapes/line-drawer";

export class GraphOperations {
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context.lineCap = 'round';
        this.context.shadowColor = 'black';
        this.context.shadowBlur = 1;
    }

    setStrokeColor(color: string) {
        this.context.strokeStyle = color;
    }

    clear() {
        const context = this.context;
        context.lineWidth = 3;
        context.fillStyle = "white";
        context.fillRect(0, 0, this.width, this.height);
        context.strokeRect(0, 0, this.width, this.height);
    }

    drawPoints(points: Complex[], asBackground: boolean = false) {
        this.context.lineWidth = 3;
        new LineDrawer(this).withDefaultColor(asBackground ? 'gray' : 'black').draw(points);
    }

    drawRadii(centers: Complex[]) {
        this.context.lineWidth = 1;
        new ColorLineDrawer(this).draw(centers);
    }

    drawCircles(centers: Complex[]) {
        this.context.lineWidth = 1;
        new CircleDrawer(this).draw(centers);
    }

    drawCircle(x: number, y: number, r: number): void {
        const context = this.context;
        context.beginPath();
        context.arc(x + this.width / 2, y + this.height / 2, r, 0, 2 * Math.PI);
        context.stroke();
        context.closePath();
    }

    drawLine(prevPos?: Complex, curPos?: Complex) {
        if (!prevPos || !curPos) return;

        const context = this.context;
        context.beginPath();
        context.moveTo(prevPos.re + this.width / 2, prevPos.im + this.height / 2);
        context.lineTo(curPos.re + this.width / 2, curPos.im + this.height / 2);
        context.stroke();
        context.closePath();
    }

    get width(): number {
        return this.canvas.width;
    }

    get height(): number {
        return this.canvas.height;
    }

    get context(): CanvasRenderingContext2D {
        return this.canvas.getContext('2d')!;
    }
}