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
  termsError: boolean = false;

  constructor() {
    this.terms = this.DEFAULT_TERMS;
  }

  handleReset() {
    this.reset = true;
    this.terms = this.DEFAULT_TERMS;
    this.speedInput = 50;
    this.termsInput = "";
  }

  handleTermsInputChange(terms: string) {
    if (terms === "") {
      this.terms = this.DEFAULT_TERMS;
      this.termsError = false;
      return;
    }
    this.termsError = !/^(0|[1-9][0-9]*)$/.test(terms);
    if (this.termsError) return;
    this.terms = parseInt(terms);
  }

  get speed(): number {
    return this.speedInput / 100;
  }
}
