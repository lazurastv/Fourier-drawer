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

  getMagnitude(cn: Complex) {
    return Math.round(cn.abs() * 100) / 100;
  }

  getAngle(cn: Complex) {
    return Math.round(cn.arg() * 180 / Math.PI * 100) / 100;
  }

  getFrequency(index: number) {
    return getFrequency(index);
  }

  get speed(): number {
    return this.speedInput / 100;
  }
}
