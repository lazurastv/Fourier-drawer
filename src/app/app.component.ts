import { Component, ViewChild } from '@angular/core';
import Complex from 'complex.js';
import { getFrequency } from './graph/ft/ft';
import { GraphComponent } from './graph/graph.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  @ViewChild('graph')
  graph!: GraphComponent;

  readonly DEFAULT_TERMS = 50;

  reset: boolean = false;
  circles: boolean = false;
  terms: number;

  speedInput: number = 50;
  termsInput: string = "";
  vectorDataVisible: boolean = false;
  termsError: string = "";

  constructor() {
    this.terms = this.DEFAULT_TERMS;
  }

  handleReset() {
    this.reset = true;
    this.terms = this.DEFAULT_TERMS;
    this.speedInput = 50;
    this.termsInput = "";
    this.vectorDataVisible = false;
  }

  handleTermsInputChange(termsString: string) {
    if (termsString === "") {
      this.terms = this.DEFAULT_TERMS;
      this.termsError = "";
      return;
    }

    if (!/^(0|[1-9][0-9]*)$/.test(termsString)) {
      this.termsError = "Invalid terms count";
      return;
    }

    this.terms = Math.min(parseInt(termsString), 1000);
  }

  getFrequency(index: number) {
    return getFrequency(index);
  }

  getMagnitude(cn: Complex) {
    const mag = cn.abs().toExponential(2).split('e');
    let exponent = '';
    for (const char of mag[1]) {
      if (char === '+') continue;
      if (char === '-') {
        exponent += '⁻'
        continue;
      }
      exponent += '⁰¹²³⁴⁵⁶⁷⁸⁹'[parseInt(char)];
    }
    return mag[0] + '·10' + exponent;
  }

  getAngle(cn: Complex) {
    return (cn.arg() * 180 / Math.PI).toFixed(2);
  }

  get speed(): number {
    return this.speedInput / 100;
  }

  get dropdownEnabled(): boolean {
    return this.graph.ftCoeffs.length > 0;
  }

  get viewwidth(): number {
    return window.innerWidth;
  }
}
