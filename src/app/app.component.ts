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
  speed: number = 5;

  termsInput: string = "";
  termsError: boolean = false;
  maxTerms: number = 0;

  handleReset() {
    this.reset = true;
    this.terms = 0;
    this.maxTerms = 0;
    this.speed = 5;
    this.termsInput = "";
  }

  handleTermsChange(terms: number) {
    this.terms = terms;
    this.maxTerms = terms;
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

  get rendersPerTick(): number {
    return this.speed === 0 ? 0 : 11 - this.speed;
  }

}
