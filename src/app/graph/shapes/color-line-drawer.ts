import LineDrawer from "./line-drawer";

export default class ColorLineDrawer extends LineDrawer {
    index: number = 0;
    colors: string[] = ['blue', 'red', 'green'];

    override nextColor(): string {
        const color = this.colors[this.index];
        this.index++;
        this.index %= this.colors.length;
        return color;
    }
}