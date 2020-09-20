import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {HttpClientModule} from '@angular/common/http';
//Rutas
import {APP_ROUTING} from './app.routes';
// Graficos
import { ChartsModule } from "ng2-charts";

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
    APP_ROUTING,
    HttpClientModule,
    ChartsModule
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
