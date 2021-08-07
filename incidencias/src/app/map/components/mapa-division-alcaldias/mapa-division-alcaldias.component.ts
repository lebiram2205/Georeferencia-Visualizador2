import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MapService } from "../../../services/map.service";
import * as L from 'leaflet';
import 'leaflet.markercluster';

@Component({
  selector: 'app-mapa-division-alcaldias',
  templateUrl: './mapa-division-alcaldias.component.html',
  styleUrls: ['./mapa-division-alcaldias.component.css']
})
export class MapaDivisionAlcaldiasComponent implements AfterViewInit {

  @ViewChild('mapClustering', { static: true }) mapContainer: ElementRef;
  mapServiceU: MapService;
  lista: string[] = [""];//agrupa todos los lugares con incidencias

  constructor(public mapService: MapService) {
      this.mapServiceU = mapService;
  }
  ngAfterViewInit() {

      this.mapServiceU.getCities().subscribe((data: any) => {
          this.lista = Object.values(data);
          this.lista.push("Todos");
      });
      var mymap5 = L.map('mapid5').setView([19.37596, -99.07000], 11);

      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
              '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
              'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox/streets-v11'
      }).addTo(mymap5);

      this.mapServiceU.getAlcaldias().subscribe((data: any) => {
          L.geoJSON(data[0]).addTo(mymap5);
      });

  }

}
