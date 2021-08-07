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
// import { ChartComponent } from './components/chart/chart.component';
// import { MapComponent } from './components/map/map.component';
import { MapService } from './services/map.service';

import { SharedModule } from './shared/shared.module';
import { MapModule } from './map/map.module';



import * as $ from 'jquery';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//Api datePiker
import {MatDatepickerModule} from '@angular/material/datepicker';
//import {MatNativeDateModule}from '@angular/material/core/';
import { MatMomentDateModule} from "@angular/material-moment-adapter";
import {MatFormFieldModule} from '@angular/material/form-field';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
@NgModule({
  declarations: [
    AppComponent,
    // ChartComponent,
    // MapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    APP_ROUTING,
    HttpClientModule,
    ChartsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    //MatNativeDateModule,
    MatFormFieldModule,
    MatMomentDateModule,
    NgbModule,
    SweetAlert2Module.forRoot(),
    FormsModule,


    SharedModule,
    MapModule,
    

  ],
  providers: [MapService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
