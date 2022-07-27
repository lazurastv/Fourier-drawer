import ComplexNumber from "./complex-number";
import { idft } from "./dft";

export default function interpolateIdft(dfts: ComplexNumber[], render: number, tick: number, rendersPerTick: number): ComplexNumber[] {
    const nextTick = (tick + 1) % dfts.length;
    const idftCoeffs = idft(dfts, tick);
    const nextIdftCoeffs = idft(dfts, nextTick);
    const currentWeight = new ComplexNumber(rendersPerTick - render);
    const nextWeight = new ComplexNumber(render);

    for (let i = 0; i < idftCoeffs.length; i++) {
        const current = idftCoeffs[i].multiply(currentWeight);
        const next = nextIdftCoeffs[i].multiply(nextWeight);
        idftCoeffs[i] = current.add(next).divide(rendersPerTick);
    }
    return idftCoeffs;
}