import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  reset: boolean = false;
  terms?: number;

  handleReset() {
    this.reset = true;
  }

}
