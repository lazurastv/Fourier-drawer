import Complex from "complex.js";

export class GraphOperations {
    canvas: HTMLCanvasElement;
    colors: string[] = ['blue', 'red', 'green'];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context.lineCap = 'round';
        this.context.shadowColor = 'black';
        this.context.shadowBlur = 1;
    }

    defaultStyle() {
        const context = this.context;
        context.lineWidth = 3;
        context.strokeStyle = "black";
        context.fillStyle = "white";
    }

    backgroundStyle() {
        const context = this.context;
        context.lineWidth = 3;
        context.strokeStyle = "gray";
    }

    additionsStyle() {
        this.context.lineWidth = 1;
    }

    clear() {
        const context = this.context;
        this.defaultStyle();
        context.fillRect(0, 0, this.width, this.height);
        context.strokeRect(0, 0, this.width, this.height);
    }

    drawPoints(points: Complex[], asBackground: boolean = false) {
        this.defaultStyle();
        if (asBackground) this.backgroundStyle();
        this.drawShapes(points);
    }

    drawRadii(centers: Complex[]) {
        this.additionsStyle();
        this.drawShapes(centers, true);
    }

    drawCircles(centers: Complex[]) {
        this.additionsStyle();
        this.drawShapes(centers, true, true);
    }

    drawShapes(points: Complex[], colorize: boolean = false, circles: boolean = false) {
        if (points.length < 2) return;

        let prevPoint: Complex | undefined;
        let curPoint: Complex | undefined;
        let index = 0;
        for (const point of points) {
            if (!curPoint) {
                curPoint = point;
                continue;
            }
            prevPoint = curPoint;
            curPoint = point;
            if (colorize) {
                this.context.strokeStyle = this.colors[index++];
                index %= this.colors.length;
            }
            if (circles) {
                this.drawCircle(prevPoint.re, prevPoint.im, curPoint.sub(prevPoint).abs());
                continue;
            }
            this.drawLine(prevPoint, curPoint);
        }
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