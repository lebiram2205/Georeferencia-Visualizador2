import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {HttpClientModule} from '@angular/common/http';
//Rutas
import {APP_ROUTING} from './app.routes';
// Graficos
import { ChartsModule } from "ng2-charts";


import{ FormsModule} from '@angular/forms';
import{ ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChartComponent } from './components/chart/chart.component';
import { MapComponent } from './components/map/map.component';
import { MapService } from './services/map.service';

import * as $ from 'jquery';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    ChartComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    APP_ROUTING,
    HttpClientModule,
    ChartsModule,
    ReactiveFormsModule
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
