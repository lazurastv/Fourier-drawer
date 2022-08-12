import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import "hammerjs";

import { AppComponent } from './app.component';
import { GraphComponent } from './graph/graph.component';
import { MCrewHammerConfig } from './hammer-fix';

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HammerModule
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: MCrewHammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
