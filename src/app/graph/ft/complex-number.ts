export default class ComplexNumber {
    re: number;
    im: number;

    constructor(re?: number, im?: number) {
        this.re = re ?? 0;
        this.im = im ?? 0;
    }

    add(cn: ComplexNumber) {
        let re = this.re + cn.re;
        let im = this.im + cn.im;
        return new ComplexNumber(re, im);
    }

    divide(scalar: number) {
        let re = this.re / scalar;
        let im = this.im / scalar;
        return new ComplexNumber(re, im);
    }

    multiply(cn: ComplexNumber) {
        let re = this.re * cn.re - this.im * cn.im;
        let im = this.re * cn.im + this.im * cn.re;
        return new ComplexNumber(re, im);
    }

    equals(cn: ComplexNumber) {
        return this.re === cn.re && this.im === cn.im;
    }
}