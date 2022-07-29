import Complex from "complex.js";
import { GraphOperations } from "../graph-operations";

export default class LineDrawer {
    graph: GraphOperations;
    defaultColor: string = 'black';

    constructor(graph: GraphOperations) {
        this.graph = graph;
    }

    withDefaultColor(color: string): LineDrawer {
        this.defaultColor = color;
        return this;
    }

    nextColor(): string {
        return this.defaultColor;
    }

    drawShape(prevPoint: Complex, curPoint: Complex): void {
        this.graph.drawLine(prevPoint, curPoint);
    }

    draw(points: Complex[]) {
        if (points.length < 2) return;

        let prevPoint: Complex | undefined;
        let curPoint: Complex | undefined;
        for (const point of points) {
            if (!curPoint) {
                curPoint = point;
                continue;
            }
            prevPoint = curPoint;
            curPoint = point;
            this.graph.setStrokeColor(this.nextColor());
            this.drawShape(prevPoint, curPoint);
        }
    }
}