import ComplexNumber from "./complex-number";

const CLOSE_TO_ZERO_THRESHOLD = 1e-10;

export function dft(inputAmplitudes: ComplexNumber[]) {
    const N = inputAmplitudes.length;
    const signals: ComplexNumber[] = [];

    for (let frequency = 0; frequency < N; frequency++) {
        let frequencySignal = new ComplexNumber();

        for (let timer = 0; timer < N; timer++) {
            const currentAmplitude = inputAmplitudes[timer];
            const rotationAngle = -1 * (2 * Math.PI) * frequency * (timer / N);

            const dataPointContribution = new ComplexNumber(
                Math.cos(rotationAngle),
                Math.sin(rotationAngle),
            ).multiply(currentAmplitude);

            frequencySignal = frequencySignal.add(dataPointContribution);
        }

        if (Math.abs(frequencySignal.re) < CLOSE_TO_ZERO_THRESHOLD) {
            frequencySignal.re = 0;
        }

        if (Math.abs(frequencySignal.im) < CLOSE_TO_ZERO_THRESHOLD) {
            frequencySignal.im = 0;
        }

        frequencySignal = frequencySignal.divide(N);
        signals[frequency] = frequencySignal;
    }

    return signals;
}

export function idft(signals: ComplexNumber[], timer: number) {
    const N = signals.length;
    const centers: ComplexNumber[] = [new ComplexNumber(0, 0)];

    for (let frequency = 0; frequency < N; frequency++) {
        const currentAmplitude = signals[frequency];
        const rotationAngle = (2 * Math.PI) * frequency * (timer / N);

        const dataPointContribution = new ComplexNumber(
            Math.cos(rotationAngle),
            Math.sin(rotationAngle),
        ).multiply(currentAmplitude);

        const center = centers[frequency].add(dataPointContribution);
        centers[frequency + 1] = center;
    }

    return centers;
}