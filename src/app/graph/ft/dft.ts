import Complex from "complex.js";

const CLOSE_TO_ZERO_THRESHOLD = 1e-10;

export function dft(inputAmplitudes: Complex[]) {
    const N = inputAmplitudes.length;
    const signals: Complex[] = [];

    for (let frequency = 0; frequency < N; frequency++) {
        let frequencySignal = new Complex(0, 0);

        for (let timer = 0; timer < N; timer++) {
            const currentAmplitude = inputAmplitudes[timer];
            const rotationAngle = -1 * (2 * Math.PI) * frequency * (timer / N);

            const dataPointContribution = new Complex({
                abs: 1,
                arg: rotationAngle
            }).mul(currentAmplitude);

            frequencySignal = frequencySignal.add(dataPointContribution);
        }

        frequencySignal = frequencySignal.div(N);
        signals[frequency] = frequencySignal;
    }

    return signals;
}

export function idft(signals: Complex[], timer: number) {
    const N = signals.length;
    const centers: Complex[] = [new Complex(0)];

    for (let frequency = 0; frequency < N; frequency++) {
        const currentAmplitude = signals[frequency];
        const rotationAngle = (2 * Math.PI) * frequency * (timer / N);

        const dataPointContribution = new Complex({
            abs: 1,
            arg: rotationAngle
        }).mul(currentAmplitude);

        const center = centers[frequency].add(dataPointContribution);
        centers[frequency + 1] = center;
    }

    return centers;
}