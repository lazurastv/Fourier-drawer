import Complex from "complex.js";

function integrate(a: Complex, b: Complex, angle: number, x: number): Complex {
    if (angle === 0) return a.mul(x / 2).add(b).mul(x);
    return a.mul(x).add(b).mul(angle).add(a.mul(0, 1)).mul(0, 1).div(-angle * angle);
}

export function ft(frequency: number, inputAmplitudes: Complex[]) {
    let coeff = new Complex(0);
    const angle = - 2 * Math.PI * frequency;
    const step = 1 / (inputAmplitudes.length - 1);
    for (let i = 0; i < inputAmplitudes.length - 1; i++) {
        const x = i * step;
        const p1 = inputAmplitudes[i];
        const p2 = inputAmplitudes[i + 1];

        const a = p2.sub(p1).div(step);
        const b = p1.sub(a.mul(x));

        let rotationTerm = new Complex({ abs: 1, arg: angle * x });
        const left = integrate(a, b, angle, x).mul(rotationTerm);
        rotationTerm = new Complex({ abs: 1, arg: angle * (x + step) });
        const right = integrate(a, b, angle, x + step).mul(rotationTerm);

        coeff = coeff.add(right.sub(left));
    }
    return coeff;
}

export function fts(frequencies: number, inputAmplitudes: Complex[]) {
    const coeffs = [];
    for (let i = 0; i < frequencies; i++) {
        const frequency = getFrequency(i);
        coeffs.push(ft(frequency, inputAmplitudes));
    }
    return coeffs;
}

export function ift(time: number, fts: Complex[]) {
    let steps: Complex[] = [Complex(0)];
    for (const [key, term] of Object.entries(fts)) {
        const i = parseInt(key);
        const current = steps[i];
        const frequency = getFrequency(i);
        steps.push(current.add(term.mul(new Complex({ abs: 1, arg: 2 * Math.PI * frequency * time }))));
    }
    return steps;
}

function getFrequency(n: number): number {
    return (n % 2 === 0 ? -1 : 1) * Math.ceil(n / 2);
}