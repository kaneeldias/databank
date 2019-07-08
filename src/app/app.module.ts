import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule, MatFormField, MatFormFieldModule, MatSelectModule, MatRadioButton, MatRadioModule, MatButtonModule} from '@angular/material';
import { MainComponent } from './main/main.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PapaParseModule } from 'ngx-papaparse';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatCardModule, MatFormFieldModule, MatSelectModule, MatRadioModule, MatButtonModule,
    FlexLayoutModule,
    HttpClientModule,
    PapaParseModule,
    Ng2GoogleChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
