import Complex from "complex.js";

function f(time: number, inputAmplitudes: Complex[]) {
    const left = inputAmplitudes[time];
    const right = inputAmplitudes[time + 1] ?? new Complex(0);

    const leftWeight = 1
    const rightWeight = 0;
    const leftWeighed = left.mul(leftWeight);
    const rightWeighed = right.mul(rightWeight);

    return leftWeighed.add(rightWeighed);
}

export function ft(frequency: number, inputAmplitudes: Complex[]) {
    let coeff = new Complex(0);
    for (let i = 0; i < inputAmplitudes.length; i++) {
        const value = f(i, inputAmplitudes);
        const rotationTerm = new Complex({ abs: 1, arg: - 2 * Math.PI * frequency * i / (inputAmplitudes.length - 1) });
        let rotated = value.mul(rotationTerm);
        if (i === 0 || i === 1) rotated = rotated.div(2);
        coeff = coeff.add(rotated);
    }
    return coeff.div(inputAmplitudes.length);
}

export function ift(time: number, terms: number, inputAmplitudes: Complex[]) {
    time = time / (inputAmplitudes.length - 1);
    let steps: Complex[] = [Complex(0)];
    for (let i = 0; i < terms; i++) {
        const current = steps[i];
        const trueIndex = Math.floor((i + 1) / 2);
        const frequency = i % 2 === 0 ? -trueIndex : trueIndex;
        const term = ft(frequency, inputAmplitudes);
        steps.push(current.add(term.mul(new Complex({ abs: 1, arg: 2 * Math.PI * frequency * time }))));
    }
    return steps;
}