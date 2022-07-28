import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  reset: boolean = false;
  circles: boolean = false;
  terms: number = 0;

  speedInput: number = 50;
  termsInput: string = "";
  termsError: boolean = false;
  maxTerms: number = 0;

  handleReset() {
    this.reset = true;
    this.terms = 0;
    this.maxTerms = 0;
    this.speedInput = 50;
    this.termsInput = "";
  }

  handleMaxTermsChange(terms: number) {
    this.maxTerms = terms;
    if (this.termsInput === "") this.terms = terms;
  }

  handleTermsInputChange(terms: string) {
    if (terms === "") {
      this.terms = this.maxTerms;
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
