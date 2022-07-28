import Complex from "complex.js";
import { idft } from "./dft";

export default function interpolateIdft(dfts: Complex[], render: number, tick: number, rendersPerTick: number): Complex[] {
    const nextTick = (tick + 1) % dfts.length;
    const idftCoeffs = idft(dfts, tick);
    const nextIdftCoeffs = idft(dfts, nextTick);
    const currentWeight = new Complex(rendersPerTick - render);
    const nextWeight = new Complex(render);

    for (let i = 0; i < idftCoeffs.length; i++) {
        const current = idftCoeffs[i].mul(currentWeight);
        const next = nextIdftCoeffs[i].mul(nextWeight);
        idftCoeffs[i] = current.add(next).div(rendersPerTick);
    }
    return idftCoeffs;
}