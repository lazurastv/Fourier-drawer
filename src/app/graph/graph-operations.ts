import ComplexNumber from "./ft/complex-number";

export class GraphOperations {
    canvas: HTMLCanvasElement;
    colors: string[] = ['blue', 'red', 'green'];
    anglesPerSecond = 2 * Math.PI / 15;

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
    }

    additionsStyle() {
        this.context.lineWidth = 1;
    }

    reset() {
        const context = this.context;
        this.defaultStyle();
        context.clearRect(0, 0, this.width, this.height);
        context.strokeRect(0, 0, this.width, this.height);
    }

    drawCircle(x: number, y: number, r: number, time: number): void {
        const context = this.context;
        const angle = time * this.anglesPerSecond;
        this.defaultStyle()

        context.beginPath();
        context.moveTo(x, y);
        context.arc(x, y, r, angle, angle + 2 * Math.PI);
        context.stroke();
        context.closePath();
    }

    drawPoints(points: ComplexNumber[]) {
        this.defaultStyle();
        this.drawLines(points);
        // close!
    }

    drawRadii(centers: ComplexNumber[]) {
        this.additionsStyle();
        this.drawLines(centers, true);
    }

    drawLines(points: ComplexNumber[], colorize: boolean = false) {
        if (points.length < 2) return;

        let startPoint: ComplexNumber | undefined;
        let prevPoint: ComplexNumber | undefined;
        let curPoint: ComplexNumber | undefined;
        let index = 0;
        for (const point of points) {
            if (!curPoint) {
                startPoint = point;
                curPoint = point;
                continue;
            }
            prevPoint = curPoint;
            curPoint = point;
            if (colorize) {
                this.context.strokeStyle = this.colors[index++];
                index %= this.colors.length;
            }
            this.drawLine(prevPoint, curPoint);
        }
    }

    drawLine(prevPos?: ComplexNumber, curPos?: ComplexNumber) {
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