import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageChartComponent } from './pages/page-chart/page-chart.component';
import { IncidenciasCdmxComponent } from './components/incidencias-cdmx/incidencias-cdmx.component';



@NgModule({
  declarations: [PageChartComponent, IncidenciasCdmxComponent],
  imports: [
    CommonModule
  ]
})
export class ChartModule { }
