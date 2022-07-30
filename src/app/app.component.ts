import { Component, ElementRef, ViewChild } from '@angular/core';
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

  @ViewChild('ftTable')
  collapsible!: ElementRef<HTMLDivElement>;

  readonly DEFAULT_TERMS = 50;
  readonly DEFAULT_SPEED = 50;

  reset: boolean = false;
  circles: boolean = false;
  terms: number;

  speedInput: number = 50;
  termsInput: string = "";
  vectorDataVisible: boolean = false;
  termsError: boolean = false;

  constructor() {
    this.terms = this.DEFAULT_TERMS;
  }

  handleReset() {
    this.reset = true;
    this.terms = this.DEFAULT_TERMS;
    this.speedInput = this.DEFAULT_SPEED;
    this.termsInput = "";
    this.vectorDataVisible = false;
  }

  handleTermsInputChange(termsString: string) {
    if (termsString === "") {
      this.terms = this.DEFAULT_TERMS;
      this.termsError = false;
      return;
    }

    if (!/^(0|[1-9][0-9]*)$/.test(termsString)) {
      this.termsError = true;
      return;
    }

    this.terms = Math.min(parseInt(termsString), 1000);
  }

  toggleVectorData() {
    this.vectorDataVisible = this.dropdownEnabled && !this.vectorDataVisible
    this.collapsible.nativeElement.style.maxHeight = this.vectorDataVisible ? '400px' : '0px';
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
    if (this.speedInput === 0) return 0;
    return Math.pow(2, this.speedInput / 15 - 5);
  }

  get dropdownEnabled(): boolean {
    return this.graph.ftCoeffs.length > 0;
  }

  get viewwidth(): number {
    return window.innerWidth;
  }
}
