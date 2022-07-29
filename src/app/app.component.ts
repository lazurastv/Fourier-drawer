import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  readonly DEFAULT_TERMS = 50;

  reset: boolean = false;
  circles: boolean = false;
  terms: number;

  speedInput: number = 50;
  termsInput: string = "";
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

  get speed(): number {
    return this.speedInput / 100;
  }
}
