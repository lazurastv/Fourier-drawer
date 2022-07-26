import ComplexNumber from "./ft/complex-number";

export class GraphOperations {
    canvas: HTMLCanvasElement;
    anglesPerSecond = 2 * Math.PI / 15;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = this.context;
        context.lineWidth = 1;
        context.lineCap = 'round';
    }

    reset() {
        const context = this.context;
        context.strokeStyle = "#000000";

        context.clearRect(0, 0, this.width, this.height);
        context.strokeRect(0, 0, this.width, this.height);
    }

    drawCircle(x: number, y: number, r: number, time: number): void {
        const context = this.context;
        const angle = time * this.anglesPerSecond;
        context.strokeStyle = "#000000";

        context.beginPath();
        context.moveTo(x, y);
        context.arc(x, y, r, angle, angle + 2 * Math.PI);
        context.stroke();
        context.closePath();
    }

    drawPoints(points: ComplexNumber[], close: boolean = false) {
        if (points.length < 2) return;
        this.reset();

        let startPoint: ComplexNumber | undefined;
        let prevPoint: ComplexNumber | undefined;
        let curPoint: ComplexNumber | undefined;
        for (const point of points) {
            if (!curPoint) {
                startPoint = point;
                curPoint = point;
                continue;
            }
            prevPoint = curPoint;
            curPoint = point;
            this.drawLine(prevPoint, curPoint);
        }
        if (close) this.drawLine(curPoint, startPoint);
    }

    drawLine(prevPos?: ComplexNumber, curPos?: ComplexNumber) {
        if (!prevPos || !curPos) return;

        const context = this.context;
        context.strokeStyle = "#000000";

        context.beginPath();
        context.moveTo(prevPos.re, prevPos.im);
        context.lineTo(curPos.re, curPos.im);
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