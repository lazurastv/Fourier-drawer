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
  maxTerms: number = 0;

  handleReset() {
    this.reset = true;
    this.terms = 0;
    this.maxTerms = 0;
  }

  handleTermsChange(terms: number) {
    this.terms = terms;
    this.maxTerms = terms;
  }

  handleTermsInputChange(terms: string) {
    if (terms === "") {
      this.terms = this.maxTerms;
      return;
    }
    this.terms = parseInt(terms);
    if (this.terms === NaN) {
      console.error("Wrong input");
    }
  }

}
