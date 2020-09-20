import { Component, OnInit } from '@angular/core';
import { MapService } from "../../services/map.service";
import * as L from 'leaflet';
import 'leaflet.markercluster';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers:[MapService]
})
export class MapComponent implements OnInit {

  mapServiceU : MapService;

  constructor(public mapService:MapService) {
    this.mapServiceU = mapService;

  }
  ngOnInit() {
    
    var mymap = L.map('mapid').setView([19.37596, -99.07000], 12);
    var mymap2 = L.map('mapid2').setView([19.37596, -99.07000], 12);
    var mymap3 = L.map('mapid3').setView([19.37596, -99.07000], 12);
    var mymap4 = L.map('mapid4').setView([19.37596, -99.07000], 12);
    var mymap5 = L.map('mapid5').setView([19.37596, -99.07000], 11);
    var mapClustering = L.map('mapClustering').setView([19.37596, -99.07000], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="copyright">Openstreetmap</a>'
    }).addTo(mapClustering);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11'
    }).addTo(mymap);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11'
    }).addTo(mymap2);

    L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap3);

    L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap4);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11'
            }).addTo(mymap5);

  var Icon = L.icon({iconUrl: '../.././assets/trafficlight.png',
        iconSize: [20, 20],
        iconAnchor: [22, 20],
        popupAnchor: [-3, -76]});
    this.mapServiceU.getSemaforoizt().subscribe( ( data:any ) => {
      var marker;
        for (let i = 0; i < data.length; i++) {

            marker = L.marker([data[i].latitud, data[i].longitud], {icon:Icon}).addTo(mymap).bindPopup("Hola.");

        }
    });
    this.mapServiceU.getSemaforoizc().subscribe( ( data:any ) => {
      var marker;
        for (let i = 0; i < data.length; i++) {

            marker = L.marker([data[i].latitud, data[i].longitud]).addTo(mymap).bindPopup("Hola2");

        }
    });

    this.mapServiceU.getSemaforomh().subscribe( ( data:any ) => {
      var marker;
        for (let i = 0; i < data.length; i++) {

          marker = L.marker([data[i].latitud, data[i].longitud]).addTo(mymap).bindPopup("Hola3");

        }
    });

this.mapServiceU.getCallesCerradas().subscribe( ( data:any ) => {
  let marker;
  let marker2;
  for (let i = 0; i < data.jams.length; i++) {

            
    const opcionesPopUp = L.popup() //Funcion de leaflet
        .setContent(`<p><b>Alcaldia:</b> ${data.jams[i].city}</p>
        <p> <b>Calle:</b>  ${data.jams[i].street}</p>
        `)

    if (data.jams[i].blockType == "ROAD_CLOSED_EVENT") {
        
        marker = L.marker([data.jams[i].line[0].y, data.jams[i].line[0].x]).addTo(mymap2).bindPopup(opcionesPopUp);
       
    }
    else if(data.jams[i].blockType == "ROAD_CLOSED_CONSTRUCTION") {
        marker2 = L.marker([data.jams[i].line[0].y, data.jams[i].line[0].x]).addTo(mymap2).bindPopup(opcionesPopUp);
    }
}
});

this.mapServiceU.getCallesCerradas2().subscribe( ( data:any ) => {
  var markers = L.markerClusterGroup();
var markerList = [];    

var Icon1 = L.icon({iconUrl: '../.././assets/accesdenied.png',
    iconSize: [20, 20],
    iconAnchor: [22, 20],
    popupAnchor: [-3, -76]});
var Icon2 = L.icon({iconUrl: '../.././assets/construction.png',
    iconSize: [20, 20],
    iconAnchor: [22, 20],
    popupAnchor: [-3, -76]});
for (let i = 0; i < data.jams.length; i++) {

    const opcionesPopUp = L.popup() //Funcion de leaflet
        .setContent(`<p><b>Alcaldia:</b> ${data.jams[i].city}</p>
        <p> <b>Calle:</b>  ${data.jams[i].street}</p>
        `)

    if (data.jams[i].blockType == "ROAD_CLOSED_EVENT") {
        
        var marker = L.marker(L.latLng(data.jams[i].line[0].y, data.jams[i].line[0].x), {icon: Icon1}).bindPopup(opcionesPopUp);
        markerList.push(marker);

    }
    else if(data.jams[i].blockType == "ROAD_CLOSED_CONSTRUCTION") {
        var marker2 = L.marker(L.latLng(data.jams[i].line[0].y, data.jams[i].line[0].x), {icon: Icon2}).bindPopup(opcionesPopUp);
        markerList.push(marker2);
    }
    
    
}
  

markers.addLayers(markerList);
mapClustering.addLayer(markers);

});
this.mapServiceU.getCallesCerradas().subscribe( ( data:any ) => {
let marker;
for (let i = 0; i < data.alerts.length; i++) {
  if (data.alerts[i].type == "ROAD_CLOSED") {
      marker = L.marker([data.alerts[i].location.y, data.alerts[i].location.x]).addTo(mymap3).bindPopup("Soy un nuevo");
  } 
  
}
});
this.mapServiceU.getCallesCerradas().subscribe( ( data:any ) => {
  let marker;
  var polygon = L.polygon([
    [19.360512, -99.143214],
    [19.316003, -99.084884],
    [19.323093, -99.188257]
]).addTo(mymap4);
});


this.mapServiceU.getAlcaldias().subscribe( ( data:any ) => {
  var marker;
  L.geoJSON(data).addTo(mymap5);
});
  





  }


}
