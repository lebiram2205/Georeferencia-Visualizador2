import { Component, OnInit, DoCheck, AfterViewInit, Injectable, ViewChild, ElementRef } from '@angular/core';
import { MapService } from "../../services/map.service";
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Form } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { stringify } from 'querystring';


import {NgbTimeStruct, NgbTimeAdapter} from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';

import Swal from 'sweetalert2';




@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
    providers:[MapService]
})



export class MapComponent implements AfterViewInit {
    @ViewChild('mapClustering', {static: true}) mapContainer:ElementRef;
    time: NgbTimeStruct = {hour: 0, minute: 2, second: 0};
    mapServiceU : MapService;
    //TIMEPICKER
    minuteStep = 5;
    //DECLARACION DE VARIABLES QUE SE IMPLEMENTAN EN EL FORMULARIO
    obtenerFecha:string="";
    lista:string[]=[""];//agrupa todos los lugares con incidencias
    arr:any[]=[];
    selectedOptionLugar:string;
    ciudad:string;
    //time:string;
    //MAPA CLUSTER VISTO POR TODOS LOS METODOS DE LA CLASE
    mapClustering : any;
    traficoDenso:any;
    markersCluster;
    markersClusterDenso;
    markerListCluster;
    markerListClusterDenso;
    horarioTraficoDenso;
    //CHECKBOX INCIDENCIAS
    isChecked: Boolean;
    listaIncidencias = [
        {name: "ACCIDENT", check: false},
        {name: "CHIT_CHAT", check: false},
        {name: "HAZARD", check: false},
        {name: "JAM", check: false},
        {name: "POLICE", check: false},
        {name: "ROAD_CLOSED" ,check: false}
    ]
    horas = [{name: "Todo el dia", check: false}]
    meses = [{name: "Todo el mes", check: false}]

    contadorChecked = 0;
    listaIncidenciasCheck;
    markerListClusterCheck = [];
    aux = [];
    Icon1 = L.icon({iconUrl: '../.././assets/accesdenied.png',
                    iconSize: [20, 20],
                    iconAnchor: [22, 20],
                    popupAnchor: [-3, -76]});
    
    constructor(public mapService:MapService) {
        this.mapServiceU = mapService;
    }


    clearMap(m:any) {
        for (let i in m._layers) {
            if (m._layers[i]._path != undefined) {
                try {
                    m.removeLayer(m._layers[i]);
                } catch (e) {
                    console.log("problem with " + e + m._layers[i]);
                }
            }
        }
    }

    
    ngAfterViewInit() {

        //Obtenemos de manera dinamica los lugares a mostrar en el input select
            this.mapServiceU.getCities().subscribe( ( data:any ) => {
                this.lista=Object.values(data);
                this.lista.push("Todos");
                console.log(this.lista);
            });
            
            
        
        var mymap = L.map('mapid').setView([19.37596, -99.07000], 12);
        var mymap2 = L.map('mapid2').setView([19.37596, -99.07000], 12);
        var mymap3 = L.map('mapid3').setView([19.37596, -99.07000], 12);
        var mymap5 = L.map('mapid5').setView([19.37596, -99.07000], 11);
        this.traficoDenso = L.map('mapDenso').setView([19.37596, -99.07000], 11);
        //INICIALIZAMOS EL MAP CLUSTERING 
        this.mapClustering = new L.map(this.mapContainer.nativeElement).setView([19.37596, -99.07000], 11);
        var mapTrafico = L.map('mapTrafico').setView([19.37596, -99.07000], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="copyright">Openstreetmap</a>'
        }).addTo(this.mapClustering);
         //Fondo de trafico denso
         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="copyright">Openstreetmap</a>'
        }).addTo(this.traficoDenso);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="copyright">Openstreetmap</a>'
        }).addTo(mapTrafico);

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

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox/streets-v11'
                }).addTo(mymap5);
        /** 
        function clearMap(m:any) {
            for (let i in m._layers) {
                if (m._layers[i]._path != undefined) {
                    try {
                        m.removeLayer(m._layers[i]);
                    } catch (e) {
                        console.log("problem with " + e + m._layers[i]);
                    }
                }
            }
        }**/
        var cont=0;
        let firstpolyline;
        //function animate(){ INICIO DE LA PELICULA
        do{
            
            //clearMap(mapTrafico);
            
            this.mapServiceU.getTrafico().subscribe( ( data:any ) => {
                this.clearMap(mapTrafico);
                for (let i = 0; i < data[0].jams.length; i++) {
                    for (let j = 1; j < (data[0].jams[i].line.length - 1); j++) {

                        let pointA = new L.LatLng(data[0].jams[i].line[j].y, data[0].jams[i].line[j].x);
                        let pointB = new L.LatLng(data[0].jams[i].line[j + 1].y, data[0].jams[i].line[j + 1].x);
                        let pointList = [pointA, pointB];

                        if (data[0].jams[i].speed < 5) {
                            firstpolyline = new L.Polyline(pointList, {
                                color: 'red',
                                weight: 6,
                                opacity: 0.5,
                                smoothFactor: 1
                            });
                        } else {
                            firstpolyline = new L.Polyline(pointList, {
                                color: 'orange',
                                weight: 6,
                                opacity: 0.5,
                                smoothFactor: 1
                            });
                        }
                        firstpolyline.addTo(mapTrafico);
                    }
                }setTimeout(function f(){console.log("out");},100); 
            });

            
            this.mapServiceU.getCallesCerradas2().subscribe( ( data:any ) => {
                this.clearMap(this.mapClustering);
                //let markers = L.markerClusterGroup();
                //let markerList = [];    
                this.markersCluster = L.markerClusterGroup();
                this.markerListCluster = [];
    
                let Icon1 = L.icon({iconUrl: '../.././assets/accesdenied.png',
                    iconSize: [20, 20],
                    iconAnchor: [22, 20],
                    popupAnchor: [-3, -76]});
    
                let Icon2 = L.icon({iconUrl: '../.././assets/construction.png',
                    iconSize: [20, 20],
                    iconAnchor: [22, 20],
                    popupAnchor: [-3, -76]});
    
                for (let i = 0; i < data[0].jams.length; i++) {
                    const opcionesPopUp = L.popup() //Funcion de leaflet
                        .setContent(`<p><b>Alcaldia:</b> ${data[0].jams[i].city}</p>
                        <p> <b>Calle:</b>  ${data[0].jams[i].street}</p>
                        `)
    
                    if (data[0].jams[i].blockType == "ROAD_CLOSED_EVENT") {
                        let marker = L.marker(L.latLng(data[0].jams[i].line[0].y, data[0].jams[i].line[0].x), {icon: Icon1}).bindPopup(opcionesPopUp);
                        this.markerListCluster.push(marker);
                    }
                    else if(data[0].jams[i].blockType == "ROAD_CLOSED_CONSTRUCTION") {
                        let marker2 = L.marker(L.latLng(data[0].jams[i].line[0].y, data[0].jams[i].line[0].x), {icon: Icon2}).bindPopup(opcionesPopUp);
                        this.markerListCluster.push(marker2);
                    }
                
                }
                this.markersCluster.addLayers(this.markerListCluster);
                this.mapClustering.addLayer(this.markersCluster);
                setTimeout(function f(){console.log("outCluster");},100);
            });
            
            cont=cont+1;
            setTimeout(function f(){console.log("wait");},100); 

        }while(cont<1); //FIN DE LA PELICULA
        console.log("FINISH");   
    
        let Icon = L.icon({iconUrl: '../.././assets/trafficlight.png',
            iconSize: [20, 20],
            iconAnchor: [22, 20],
            popupAnchor: [-3, -76]
        });

        this.mapServiceU.getSemaforoizt().subscribe( ( data:any ) => {
            let marker;
            for (let i = 0; i < data.semaforo.length; i++) {
                marker = L.marker([data.semaforo[i].latitud, data.semaforo[i].longitud], {icon:Icon}).addTo(mymap).bindPopup("Hola.");
            }
        });

        this.mapServiceU.getSemaforoizc().subscribe( ( data:any ) => {
            let marker;
            for (let i = 0; i < data.semaforo.length; i++) {
                marker = L.marker([data.semaforo[i].latitud, data.semaforo[i].longitud], {icon:Icon}).addTo(mymap).bindPopup("Hola2");
            }
        });

        this.mapServiceU.getSemaforomh().subscribe( ( data:any ) => {
            let marker;
            for (let i = 0; i < data.semaforo.length; i++) {
                marker = L.marker([data.semaforo[i].latitud, data.semaforo[i].longitud], {icon:Icon}).addTo(mymap).bindPopup("Hola3");
            }
        });

        this.mapServiceU.getCallesCerradas().subscribe( ( data:any ) => {
            let marker;
            let marker2;
            let Icon1 = L.icon({iconUrl: '../.././assets/accesdenied.png',
                iconSize: [20, 20],
                iconAnchor: [22, 20],
                popupAnchor: [-3, -76]});
            let Icon2 = L.icon({iconUrl: '../.././assets/construction.png',
                iconSize: [20, 20],
                iconAnchor: [22, 20],
                popupAnchor: [-3, -76]});
            for (let i = 0; i < data[0].jams.length; i++) {
                const opcionesPopUp = L.popup() //Funcion de leaflet
                    .setContent(`<p><b>Alcaldia:</b> ${data[0].jams[i].city}</p>
                    <p> <b>Calle:</b>  ${data[0].jams[i].street}</p>
                    `)

                if (data[0].jams[i].blockType == "ROAD_CLOSED_EVENT") {
                    marker = L.marker([data[0].jams[i].line[0].y, data[0].jams[i].line[0].x], {icon: Icon1}).addTo(mymap2).bindPopup(opcionesPopUp);
                }
                else if(data[0].jams[i].blockType == "ROAD_CLOSED_CONSTRUCTION") {
                    marker2 = L.marker([data[0].jams[i].line[0].y, data[0].jams[i].line[0].x], {icon: Icon1}).addTo(mymap2).bindPopup(opcionesPopUp);
                }
            }
        });
        

        this.mapServiceU.getCallesCerradas().subscribe( ( data:any ) => {
            let marker;
            let greenIcon = L.icon({iconUrl: '../.././assets/accesdenied.png',
                iconSize: [20, 20],
                iconAnchor: [22, 20],
                popupAnchor: [-3, -76]
            });
            for (let i = 0; i < data[0].alerts.length; i++) {
                if (data[0].alerts[i].type == "ROAD_CLOSED") {
                    marker = L.marker([data[0].alerts[i].location.y, data[0].alerts[i].location.x],{icon: greenIcon}).addTo(mymap3).bindPopup("Soy un nuevo");
                } 
            }
        });


        this.mapServiceU.getAlcaldias().subscribe( ( data:any ) => {
            let marker;
            L.geoJSON(data[0]).addTo(mymap5);
        });

        
        
    }//FIN OnInit
    //
    traficoDenso2(){
    this.mapServiceU.getAlcaldias().subscribe( ( data:any ) => {
        let marker;
        L.geoJSON(data[0]).addTo(this.traficoDenso);
    });
    this.mapServiceU.gettraficoDenso().subscribe( ( data:any ) => {
        let marker;
        this.markersClusterDenso = L.markerClusterGroup();
        this.markerListClusterDenso = [];
        
        let greenIcon = L.icon({iconUrl: '../.././assets/accesdenied.png',
            iconSize: [20, 20],
            iconAnchor: [22, 20],
            popupAnchor: [-3, -76]
        });
        //console.log(data)
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].lineas.length; j++) {
                 setTimeout(()=>{                  
                // console.log(data[i].lineas[j].y);
                this.horarioTraficoDenso=data[i].tiempo
                let marker = L.marker(L.latLng(data[i].lineas[j].y, data[i].lineas[j].x), {icon: this.Icon1});
               

                this.markerListClusterDenso.push(marker);
                this.markersClusterDenso.addLayers(this.markerListClusterDenso);
                this.traficoDenso.addLayer(this.markersClusterDenso);
                 },i*1000);
            }
            
        }
        
     
   
        
    });
}
    //fin de trafico denso

    //Metodo SUBMIT
    buscarIncidencias() {
        for(let i of this.listaIncidencias){
            i.check=false;
        }
        this.aux = [];
        this.contadorChecked = 0;
        //console.log(this.selectedOptionLugar);
        this.ciudad=this.selectedOptionLugar;
        //VALIDACION
        if(this.ciudad==null || this.time==null || <any>this.obtenerFecha=="" ){
            Swal.fire(
                'ERROR',
                'Faltan llenar campos',
                'error'
              )
        }
        else{
            //LIMPIAMOS EL MAPA CLUSTER
            this.markersCluster.removeLayers(this.markerListCluster);
            if(this.markerListClusterCheck.length>0){
                this.markersCluster.removeLayers(this.markerListClusterCheck);
            }
            this.markersCluster = L.markerClusterGroup();
            this.markerListCluster = [];
            
            let cadenaTime:string;
            this.arr=Object.values(this.time); //Almacenamos el objeto arrojado por la variable time (hora y minuto)

            //CONVIERTE LOS VALORES DE LA HORA Y MINUTO A DOS CIFRAS
            function timeText(d) {
                if(d<10){return (d < 10) ? '0' + d.toString() : d.toString();}
                else{return d.toString();}
            }
            
            //CONCATENAMOS LA HORA Y MINUTOS
            cadenaTime = timeText(this.arr[0])+":"+timeText(this.arr[1]);
            console.log(cadenaTime);

            //omitimos el tiempo si checkbox "todo el dia" es verdadero
            for(let j of this.horas){
                if (j.check==true){cadenaTime="";}
            }

            let fecha:any;
            let horarioFinal: string;

            for(let k of this.meses){
                if (k.check==true && cadenaTime==""){
                    fecha = (<any>this.obtenerFecha).format("YYYY-MM");
                    //CONCATENAMOS EL TIEMPO Y LA FECHA PARA NUESTRA CONSULTA
                    horarioFinal= fecha + "" + cadenaTime;
                }else{
                    //CONVERTIMOS LA FECHA AL FORMATO UTILIZADO EN LOS JSON DE LA BD
                    fecha = (<any>this.obtenerFecha).format("YYYY-MM-DD");
                    //CONCATENAMOS EL TIEMPO Y LA FECHA PARA NUESTRA CONSULTA
                    horarioFinal= fecha + " " + cadenaTime;
                }
            }

            
            
            console.log("horario final: "+horarioFinal);
            if(this.ciudad=="Todos"){this.ciudad="";}
            this.mapServiceU.getTraficoCluster(horarioFinal,this.ciudad).subscribe( ( data:any ) => {
                if(data == 0){
                    Swal.fire(
                        'ERROR',
                        'No se encontraron Incidencias en esa fecha',
                        'error'
                    )
                }else{

                this.listaIncidenciasCheck=data;
                
                //REFRESCAR EL MAPCLUSTERING PARA QUE SE UBIQUE EN LA ZONA DEL LUGAR DONDE QUEREMOS CONSULTAR
                this.mapClustering.remove();
                this.mapClustering = new L.map(this.mapContainer.nativeElement).setView([data[0].location.y, data[0].location.x], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="copyright">Openstreetmap</a>'
                }).addTo(this.mapClustering);
                /***** */
                


                for (let i = 0; i < data.length; i++) {
                    let marker = L.marker(L.latLng(data[i].location.y, data[i].location.x), {icon: this.Icon1});
                    this.markerListCluster.push(marker);
                }
                this.markersCluster.addLayers(this.markerListCluster);
                this.mapClustering.addLayer(this.markersCluster);
                }
                
            });
            for(let j of this.horas){
                if(j.check==true){j.check=false;}
            }
            for(let k of this.meses){
                if(k.check==true){k.check=false;}
            }
            
            console.log((<any>this.obtenerFecha).format("YYYY-MM-DD"));
        }
    }//Fin SUBMIT
    
    
    //CHECKBOX
    filtraIncidencia(e:any){
        if(this.listaIncidenciasCheck != null){
            this.markersCluster.removeLayers(this.markerListCluster);
            this.markersCluster.removeLayers(this.markerListClusterCheck);
            this.markerListClusterCheck = [];
            this.clearMap(this.mapClustering);
            var remove = ( arr, item ) => {
                var i = arr.indexOf( item );
                i !== -1 && arr.splice( i, 1 );
              };
            
            if(e.target.checked){ 
                this.contadorChecked = this.contadorChecked + 1;
                this.markersCluster = L.markerClusterGroup();
                this.markersCluster.removeLayers(this.markerListCluster);
                this.markersCluster.removeLayers(this.markerListClusterCheck);
                console.log(this.listaIncidenciasCheck);
                for (let x of this.listaIncidenciasCheck) {
                      if(x.Type == e.target.value){
                        this.aux.push(x);
                      } 
                  }
                this.markerListClusterCheck = [];
                for (let i = 0; i < this.aux.length; i++) {
                    console.log(i);
                    let marker = L.marker(L.latLng(this.aux[i].location.y, this.aux[i].location.x), {icon: this.Icon1});
                    this.markerListClusterCheck.push(marker);
                }
                this.markersCluster.addLayers(this.markerListClusterCheck);
                this.mapClustering.addLayer(this.markersCluster);
                console.log(this.aux);
                console.log("contador "+this.contadorChecked);
                
            }else{
                this.contadorChecked = this.contadorChecked - 1;
                this.markersCluster = L.markerClusterGroup();
                this.markersCluster.removeLayers(this.markerListCluster);
                this.markersCluster.removeLayers(this.markerListClusterCheck);
                console.log("*****");
                console.log(this.aux.length);
                let longitud = this.aux.length;
    
                for (let x= longitud-1; x>=0 ; x--) {
                    console.log(x);
                    if(this.aux[x].Type == e.target.value){
                      remove(this.aux,this.aux[x]);
                    } 
                }
                console.log(this.aux);
                this.markerListClusterCheck = [];
                for (let i = 0; i < this.aux.length; i++) {
                    let marker = L.marker(L.latLng(this.aux[i].location.y, this.aux[i].location.x), {icon: this.Icon1});
                    this.markerListClusterCheck.push(marker);
                }
                this.markersCluster.addLayers(this.markerListClusterCheck);
                this.mapClustering.addLayer(this.markersCluster);
                console.log("contador "+this.contadorChecked);
                
                if(this.contadorChecked == 0){
                    for (let i = 0; i < this.listaIncidenciasCheck.length; i++) {
                        let marker = L.marker(L.latLng(this.listaIncidenciasCheck[i].location.y, this.listaIncidenciasCheck[i].location.x), {icon: this.Icon1});
                        this.markerListClusterCheck.push(marker);
                    }
                    this.markersCluster.addLayers(this.markerListClusterCheck);
                    this.mapClustering.addLayer(this.markersCluster);
                }
            }
        }

        
    }



}//fin clase
