import Complex from "complex.js";
import ColorLineDrawer from "./color-line-drawer";

export default class CircleDrawer extends ColorLineDrawer {
    override drawShape(prevPoint: Complex, curPoint: Complex): void {
        this.graph.drawCircle(prevPoint.re, prevPoint.im, curPoint.sub(prevPoint).abs());
    }
}