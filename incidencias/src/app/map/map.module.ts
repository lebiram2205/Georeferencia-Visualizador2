import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageMapComponent } from './pages/page-map/page-map.component';
import { MapaIncidenciasComponent } from './components/mapa-incidencias/mapa-incidencias.component';
import { MapaTraficoComponent } from './components/mapa-trafico/mapa-trafico.component';
import { MapaTraficoDensoComponent } from './components/mapa-trafico-denso/mapa-trafico-denso.component';
import { MapasSemaforosCallesCerradasComponent } from './components/mapas-semaforos-calles-cerradas/mapas-semaforos-calles-cerradas.component';
import { MapaCallesReportadasComponent } from './components/mapa-calles-reportadas/mapa-calles-reportadas.component';
import { MapaDivisionAlcaldiasComponent } from './components/mapa-division-alcaldias/mapa-division-alcaldias.component';


@NgModule({
  declarations: [
    PageMapComponent, 
    MapaIncidenciasComponent, 
    MapaTraficoComponent, 
    MapaTraficoDensoComponent, 
    MapasSemaforosCallesCerradasComponent, 
    MapaCallesReportadasComponent, 
    MapaDivisionAlcaldiasComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MapModule { }
