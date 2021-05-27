import { Component, OnInit, DoCheck, AfterViewInit, Injectable, ViewChild, ElementRef } from '@angular/core';
import { MapService } from "../../services/map.service";
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { stringify } from 'querystring';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { NgbTimeStruct, NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';

import Swal from 'sweetalert2';
import { Date } from 'mongoose';




@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
    providers: [MapService]
})



export class MapComponent implements AfterViewInit {

    rango           : number    = 0;
    banderaPausa    : boolean   = false;
    banderaMapa     : boolean   =  true;
    paintLine       : boolean   =  false;
    horario         : string    =  "00:00"
    arregloTrafico  : any[];
    activarBtn                  = true;
    marcas              :any;
    marcasLineas        :any;
    nombrePlayPausa     :string     = "play_circle";
    banderaPlayPausa    :boolean    = true;

    timeCtrl        = new FormControl( this.horario , [] );
    rangeControl    = new FormControl( this.rango , [ Validators.max(287) , Validators.min(0) ] );


    @ViewChild('mapClustering', { static: true }) mapContainer: ElementRef;
    time: NgbTimeStruct = { hour: 0, minute: 2, second: 0 };
    mapServiceU: MapService;
    //TIMEPICKER
    minuteStep = 5;
    //DECLARACION DE VARIABLES QUE SE IMPLEMENTAN EN EL FORMULARIO
    obtenerFecha: string = "";
    lista: string[] = [""];//agrupa todos los lugares con incidencias
    arr: any[] = [];
    selectedOptionLugar: string;
    ciudad: string;
    //time:string;
    //MAPA CLUSTER VISTO POR TODOS LOS METODOS DE LA CLASE
    mapClustering: any;
    traficoDenso: any;
    markersCluster;
    markersClusterDenso;
    markerListCluster;
    markerListClusterDenso;
    horarioTraficoDenso;
    map;

    //CHECKBOX INCIDENCIAS
    isChecked: Boolean;
    listaIncidencias = [
        { name: "ACCIDENT", check: false },
        { name: "CHIT_CHAT", check: false },
        { name: "HAZARD", check: false },
        { name: "JAM", check: false },
        { name: "POLICE", check: false },
        { name: "ROAD_CLOSED", check: false }
    ]
    horas = [{ name: "Todo el dia", check: false }]
    meses = [{ name: "Todo el mes", check: false }]

    contadorChecked = 0;
    listaIncidenciasCheck;
    markerListClusterCheck = [];
    aux = [];
    Icon1 = L.icon({
        iconUrl: '../.././assets/accesdenied.png',
        iconSize: [20, 20],
        iconAnchor: [22, 20],
        popupAnchor: [-3, -76]
    });

    constructor(public mapService: MapService) {
        this.mapServiceU = mapService;
        this.rangeControl.valueChanges.subscribe(value => {
            this.rango = value ;
            // this.banderaPausa = true;
            this.ajustarlinea(this.rango);      
        })
    }

    controlAtras(){
        if(this.rango > 0){
            this.rango-=1;;
            this.ajustarlinea(this.rango);
            // console.log(this.rango);
            
        }
    }

    controlAdelante(){
        if(this.rango < 288){
            this.rango+=1;;
            this.ajustarlinea(this.rango);
            // console.log(this.rango);
        }
    }

    buscarFecha(event: Event) {
        this.banderaPausa = false;
        event.preventDefault();
        // this.rango = this.ajustarHora(this.horario);
        // console.log(this.ajustarHora(this.horario));
        console.log('Btn buscar');
        this.fechaTrafico();
        // this.traficoDenso2(this.ajustarHora(this.horario));    
    }

    reproducir (event: Event){
        event.preventDefault();
        console.log('Btn reproducir');
        if (this.banderaPlayPausa){
            if(this.banderaPausa){
                this.borrarClosters();
                console.log('Se debe borrar');
            }
            this.banderaPausa = false;
            this.pintarClosters(this.rango);
            this.nombrePlayPausa = 'pause';        
            this.banderaPlayPausa = false;
        }else {
            this.banderaPausa = true;
            console.log("La pausa es " + this.banderaPausa);
            this.nombrePlayPausa = 'play_circle';        
            this.banderaPlayPausa = true;
        }
        // this.reprodurtor(this.rango);  
        // console.log(this.arregloTrafico);
    }

    ajustarHora (hora:string){
        // let minutos = hora.split(":");
        let horas: string[] = ["00:00","00:05","00:10","00:15","00:20","00:25","00:30","00:35","00:40","00:45","00:50","00:55","01:00","01:05","01:10","01:15","01:20","01:25","01:30","01:35","01:40","01:45","01:50","01:55","02:00","02:05","02:10","02:15","02:20","02:25","02:30","02:35","02:40","02:45","02:50","02:55","03:00","03:05","03:10","03:15","03:20","03:25","03:30","03:35","03:40","03:45","03:50","03:55","04:00","04:05","04:10","04:15","04:20","04:25","04:30","04:35","04:40","04:45","04:50","04:55","05:00","05:05","05:10","05:15","05:20","05:25","05:30","05:35","05:40","05:45","05:50","05:55","06:00","06:05","06:10","06:15","06:20","06:25","06:30","06:35","06:40","06:45","06:50","06:55","07:00","07:05","07:10","07:15","07:20","07:25","07:30","07:35","07:40","07:45","07:50","07:55","08:00","08:10","08:10","08:15","08:20","08:25","08:30","08:35","08:40","08:45","08:50","08:55","10:00","09:05","09:10","09:15","09:20","09:25","09:30","09:35","09:40","09:45","09:50","09:55","10:00","10:05","10:10","10:15","10:20","10:25","10:30","10:35","10:40","10:45","10:50","10:55","11:00","11:05","11:10","11:15","11:20","11:25","11:30","11:35","11:40","11:45","11:50","11:55","12:00","12:05","12:10","12:15","12:20","12:25","12:30","12:25","12:40","12:45","12:50","12:55","13:00","13:05","13:10","13:15","13:20","13:25","13:30","13:35","13:40","13:45","13:50","13:55","14:00","14:05","14:10","14:15","14:20","14:25","14:30","14:35","14:40","14:45","14:50","14:55","15:00","15:05","15:10","15:15","15:20","15:25","15:30","15:35","15:40","15:45","15:50","15:55","16:00","16:05","16:10","16:15","16:20","16:25","16:30","16:35","16:40","16:45","16:50","16:55","17:00","17:05","17:10","17:15","17:20","17:25","17:30","17:35","17:40","17:45","17:50","17:55","18:00","18:05","18:10","18:15","18:20","18:25","18:30","18:35","18:40","18:45","18:50","18:55","19:00","19:05","19:10","19:15","19:20","19:25","19:30","19:35","19:40","19:45","19:50","19:55","20:00","20:05","20:10","20:15","20:20","20:25","20:30","20:35","20:40","20:45","20:50","20:55","21:00","21:05","21:10","21:15","21:20","21:25","21:30","21:35","21:40","21:45","21:50","21:55","22:00","22:05","22:10","22:15","22:20","22:25","22:30","22:35","22:40","22:45","22:50","22:55","23:00","23:05","23:10","23:15","23:20","23:25","23:30","23:35","23:40","23:45","23:50","23:55"]
        for(let w=0;w<288;w++){
            if(hora == horas[w]){
                return w;
            }
        }
    }
    ajustarlinea(rango:number){
        let horas: string[] = ["00:00","00:05","00:10","00:15","00:20","00:25","00:30","00:35","00:40","00:45","00:50","00:55","01:00","01:05","01:10","01:15","01:20","01:25","01:30","01:35","01:40","01:45","01:50","01:55","02:00","02:05","02:10","02:15","02:20","02:25","02:30","02:35","02:40","02:45","02:50","02:55","03:00","03:05","03:10","03:15","03:20","03:25","03:30","03:35","03:40","03:45","03:50","03:55","04:00","04:05","04:10","04:15","04:20","04:25","04:30","04:35","04:40","04:45","04:50","04:55","05:00","05:05","05:10","05:15","05:20","05:25","05:30","05:35","05:40","05:45","05:50","05:55","06:00","06:05","06:10","06:15","06:20","06:25","06:30","06:35","06:40","06:45","06:50","06:55","07:00","07:05","07:10","07:15","07:20","07:25","07:30","07:35","07:40","07:45","07:50","07:55","08:00","08:10","08:10","08:15","08:20","08:25","08:30","08:35","08:40","08:45","08:50","08:55","10:00","09:05","09:10","09:15","09:20","09:25","09:30","09:35","09:40","09:45","09:50","09:55","10:00","10:05","10:10","10:15","10:20","10:25","10:30","10:35","10:40","10:45","10:50","10:55","11:00","11:05","11:10","11:15","11:20","11:25","11:30","11:35","11:40","11:45","11:50","11:55","12:00","12:05","12:10","12:15","12:20","12:25","12:30","12:25","12:40","12:45","12:50","12:55","13:00","13:05","13:10","13:15","13:20","13:25","13:30","13:35","13:40","13:45","13:50","13:55","14:00","14:05","14:10","14:15","14:20","14:25","14:30","14:35","14:40","14:45","14:50","14:55","15:00","15:05","15:10","15:15","15:20","15:25","15:30","15:35","15:40","15:45","15:50","15:55","16:00","16:05","16:10","16:15","16:20","16:25","16:30","16:35","16:40","16:45","16:50","16:55","17:00","17:05","17:10","17:15","17:20","17:25","17:30","17:35","17:40","17:45","17:50","17:55","18:00","18:05","18:10","18:15","18:20","18:25","18:30","18:35","18:40","18:45","18:50","18:55","19:00","19:05","19:10","19:15","19:20","19:25","19:30","19:35","19:40","19:45","19:50","19:55","20:00","20:05","20:10","20:15","20:20","20:25","20:30","20:35","20:40","20:45","20:50","20:55","21:00","21:05","21:10","21:15","21:20","21:25","21:30","21:35","21:40","21:45","21:50","21:55","22:00","22:05","22:10","22:15","22:20","22:25","22:30","22:35","22:40","22:45","22:50","22:55","23:00","23:05","23:10","23:15","23:20","23:25","23:30","23:35","23:40","23:45","23:50","23:55"];
        for(let w=0;w<288;w++){
            if(rango == w){
                this.horario = horas[w];
            }
        }
    }


    getPausa () {
        this.banderaPausa = true;
        console.log("La pausa es " + this.banderaPausa);
    }


    clearMap(m: any) {
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

    pintarLineas(event: Event){
        if(this.paintLine){
            this.paintLine = false;
            console.log(event);
        }else{
            this.paintLine = true;
            console.log(event);
        }
    }

    // *---------------------------------------------------------------------------------------------------

    ngAfterViewInit() {

        //Obtenemos de manera dinamica los lugares a mostrar en el input select
        this.mapServiceU.getCities().subscribe((data: any) => {
            this.lista = Object.values(data);
            this.lista.push("Todos");
            console.log(this.lista);
        });



        var mymap = L.map('mapid').setView([19.37596, -99.07000], 12);
        var mymap2 = L.map('mapid2').setView([19.37596, -99.07000], 12);
        var mymap3 = L.map('mapid3').setView([19.37596, -99.07000], 12);
        var mymap5 = L.map('mapid5').setView([19.37596, -99.07000], 11);
        this.map = L.map('mapDenso').setView([19.37596, -99.07000], 11);
        //Fondo de trafico denso
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="copyright">Openstreetmap</a>'
        }).addTo(this.map);
        //this.traficoDenso = L.map('mapDenso').setView([19.37596, -99.07000], 11);
        //INICIALIZAMOS EL MAP CLUSTERING 
        this.mapClustering = new L.map(this.mapContainer.nativeElement).setView([19.37596, -99.07000], 11);
        var mapTrafico = L.map('mapTrafico').setView([19.37596, -99.07000], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="copyright">Openstreetmap</a>'
        }).addTo(this.mapClustering);


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
        var cont = 0;
        let firstpolyline;
        //function animate(){ INICIO DE LA PELICULA
        do {

            //clearMap(mapTrafico);

            this.mapServiceU.getTrafico().subscribe((data: any) => {
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
                } setTimeout(function f() { console.log("out"); }, 100);
            });


            this.mapServiceU.getCallesCerradas2().subscribe((data: any) => {
                this.clearMap(this.mapClustering);
                //let markers = L.markerClusterGroup();
                //let markerList = [];    
                this.markersCluster = L.markerClusterGroup();
                this.markerListCluster = [];

                let Icon1 = L.icon({
                    iconUrl: '../.././assets/accesdenied.png',
                    iconSize: [20, 20],
                    iconAnchor: [22, 20],
                    popupAnchor: [-3, -76]
                });

                let Icon2 = L.icon({
                    iconUrl: '../.././assets/construction.png',
                    iconSize: [20, 20],
                    iconAnchor: [22, 20],
                    popupAnchor: [-3, -76]
                });

                for (let i = 0; i < data[0].jams.length; i++) {
                    const opcionesPopUp = L.popup() //Funcion de leaflet
                        .setContent(`<p><b>Alcaldia:</b> ${data[0].jams[i].city}</p>
                        <p> <b>Calle:</b>  ${data[0].jams[i].street}</p>
                        `)

                    if (data[0].jams[i].blockType == "ROAD_CLOSED_EVENT") {
                        let marker = L.marker(L.latLng(data[0].jams[i].line[0].y, data[0].jams[i].line[0].x), { icon: Icon1 }).bindPopup(opcionesPopUp);
                        this.markerListCluster.push(marker);
                    }
                    else if (data[0].jams[i].blockType == "ROAD_CLOSED_CONSTRUCTION") {
                        let marker2 = L.marker(L.latLng(data[0].jams[i].line[0].y, data[0].jams[i].line[0].x), { icon: Icon2 }).bindPopup(opcionesPopUp);
                        this.markerListCluster.push(marker2);
                    }

                }
                this.markersCluster.addLayers(this.markerListCluster);
                this.mapClustering.addLayer(this.markersCluster);
                setTimeout(function f() { console.log("outCluster"); }, 100);
            });

            cont = cont + 1;
            setTimeout(function f() { console.log("wait"); }, 100);

        } while (cont < 1); //FIN DE LA PELICULA
        console.log("FINISH");

        let Icon = L.icon({
            iconUrl: '../.././assets/trafficlight.png',
            iconSize: [20, 20],
            iconAnchor: [22, 20],
            popupAnchor: [-3, -76]
        });

        this.mapServiceU.getSemaforoizt().subscribe((data: any) => {
            let marker;
            for (let i = 0; i < data.semaforo.length; i++) {
                marker = L.marker([data.semaforo[i].latitud, data.semaforo[i].longitud], { icon: Icon }).addTo(mymap).bindPopup("Hola.");
            }
        });

        this.mapServiceU.getSemaforoizc().subscribe((data: any) => {
            let marker;
            for (let i = 0; i < data.semaforo.length; i++) {
                marker = L.marker([data.semaforo[i].latitud, data.semaforo[i].longitud], { icon: Icon }).addTo(mymap).bindPopup("Hola2");
            }
        });

        this.mapServiceU.getSemaforomh().subscribe((data: any) => {
            let marker;
            for (let i = 0; i < data.semaforo.length; i++) {
                marker = L.marker([data.semaforo[i].latitud, data.semaforo[i].longitud], { icon: Icon }).addTo(mymap).bindPopup("Hola3");
            }
        });

        this.mapServiceU.getCallesCerradas().subscribe((data: any) => {
            let marker;
            let marker2;
            let Icon1 = L.icon({
                iconUrl: '../.././assets/accesdenied.png',
                iconSize: [20, 20],
                iconAnchor: [22, 20],
                popupAnchor: [-3, -76]
            });
            let Icon2 = L.icon({
                iconUrl: '../.././assets/construction.png',
                iconSize: [20, 20],
                iconAnchor: [22, 20],
                popupAnchor: [-3, -76]
            });
            for (let i = 0; i < data[0].jams.length; i++) {
                const opcionesPopUp = L.popup() //Funcion de leaflet
                    .setContent(`<p><b>Alcaldia:</b> ${data[0].jams[i].city}</p>
                    <p> <b>Calle:</b>  ${data[0].jams[i].street}</p>
                    `)

                if (data[0].jams[i].blockType == "ROAD_CLOSED_EVENT") {
                    marker = L.marker([data[0].jams[i].line[0].y, data[0].jams[i].line[0].x], { icon: Icon1 }).addTo(mymap2).bindPopup(opcionesPopUp);
                }
                else if (data[0].jams[i].blockType == "ROAD_CLOSED_CONSTRUCTION") {
                    marker2 = L.marker([data[0].jams[i].line[0].y, data[0].jams[i].line[0].x], { icon: Icon1 }).addTo(mymap2).bindPopup(opcionesPopUp);
                }
            }
        });


        this.mapServiceU.getCallesCerradas().subscribe((data: any) => {
            let marker;
            let greenIcon = L.icon({
                iconUrl: '../.././assets/accesdenied.png',
                iconSize: [20, 20],
                iconAnchor: [22, 20],
                popupAnchor: [-3, -76]
            });
            for (let i = 0; i < data[0].alerts.length; i++) {
                if (data[0].alerts[i].type == "ROAD_CLOSED") {
                    marker = L.marker([data[0].alerts[i].location.y, data[0].alerts[i].location.x], { icon: greenIcon }).addTo(mymap3).bindPopup("Soy un nuevo");
                }
            }
        });


        this.mapServiceU.getAlcaldias().subscribe((data: any) => {
            let marker;
            L.geoJSON(data[0]).addTo(mymap5);
        });



    }//FIN OnInit
    
    fechaTrafico () {
        let horario
        this.horarioTraficoDenso = horario;
        let that = this;
                
        if(this.banderaMapa){
            this.mapServiceU.getAlcaldias().subscribe((data: any) => {
                L.geoJSON(data[0]).addTo(that.map);
                this.banderaMapa = false;
            });
            
            this.mapServiceU.gettraficoDenso().subscribe((dataT: any) => {
                this.arregloTrafico =  dataT;
                console.log('Se obtuvo los datos del mapa');
                // alert('Llegaron los datos');
                this.activarBtn = false;
            });
        }
        
    }


    borrarClosters () {
        this.map.removeLayer( this.marcas );
        this.map.removeLayer( this.marcasLineas );
    }

    pintarClosters(rango: number) {
        let markers = L.markerClusterGroup();
        let capaLineas = L.markerClusterGroup();
        let segment ;
        let tiempo = rango;
        let data = this.arregloTrafico;
        let that = this;
        let pausa : boolean;

        function animacion() {
            // console.log('El tiempo es:' + tiempo);
            pausa = that.banderaPausa
            that.rango = tiempo;
            that.ajustarlinea(tiempo);

            capaLineas.clearLayers();
            that.map.removeLayer(capaLineas);

            markers.clearLayers();
            that.map.removeLayer( markers );
            
            if ( data.length ) {
                that.map.removeLayer( markers );
                markers = L.markerClusterGroup();
                
                that.map.removeLayer(capaLineas);
                capaLineas = L.markerClusterGroup();
                
                that.horarioTraficoDenso = data[ tiempo ].tiempo[0];
                for (let j = 0; j < (data[ tiempo ].lineas.length); j++) {
                    for (let k = 0; k < (data[ tiempo ].lineas[ j ].length - 1); k++) {
                        let marker = L.marker(new L.LatLng(data[ tiempo ].lineas[ j ][ k ].y, data[ tiempo ].lineas[ j ][ k ].x), { title: "Datos Closters" });
                        markers.addLayer( marker );
                        let pointA = new L.LatLng(data[tiempo].lineas[j][k].y, data[tiempo].lineas[j][k].x);
                        let pointB = new L.LatLng(data[tiempo].lineas[j][k+1].y, data[tiempo].lineas[j][k+1].x);
                        let pointList = [pointA, pointB];
                        //console.log(data[tiempo].lineas[j][k+1].y );//lineas[12]
                        segment = new L.Polyline(pointList,
                            {color: '#DB3A34',
                            weight: 6,
                            opacity: 0.5,
                            smoothFactor: 1});
                    }//fin for k
                    segment.addTo(capaLineas);//aggrega al mapa
                }
                if(that.paintLine){
                    that.map.addLayer(capaLineas);
                }

                that.marcas = markers;
                that.marcasLineas = capaLineas;
                tiempo++;
                that.map.addLayer(markers);
                if (tiempo < data.length && pausa == false){
                    setTimeout(animacion, 2000);
                }
            }
        }
        animacion();

    }

    buscarIncidencias() {
        for (let i of this.listaIncidencias) {
            i.check = false;
        }
        this.aux = [];
        this.contadorChecked = 0;
        //console.log(this.selectedOptionLugar);
        this.ciudad = this.selectedOptionLugar;
        //VALIDACION
        if (this.ciudad == null || this.time == null || <any>this.obtenerFecha == "") {
            Swal.fire(
                'ERROR',
                'Faltan llenar campos',
                'error'
            )
        }
        else {
            //LIMPIAMOS EL MAPA CLUSTER
            this.markersCluster.removeLayers(this.markerListCluster);
            if (this.markerListClusterCheck.length > 0) {
                this.markersCluster.removeLayers(this.markerListClusterCheck);
            }
            this.markersCluster = L.markerClusterGroup();
            this.markerListCluster = [];

            let cadenaTime: string;
            this.arr = Object.values(this.time); //Almacenamos el objeto arrojado por la variable time (hora y minuto)

            //CONVIERTE LOS VALORES DE LA HORA Y MINUTO A DOS CIFRAS
            function timeText(d) {
                if (d < 10) { return (d < 10) ? '0' + d.toString() : d.toString(); }
                else { return d.toString(); }
            }

            //CONCATENAMOS LA HORA Y MINUTOS
            cadenaTime = timeText(this.arr[0]) + ":" + timeText(this.arr[1]);
            console.log(cadenaTime);

            //omitimos el tiempo si checkbox "todo el dia" es verdadero
            for (let j of this.horas) {
                if (j.check == true) { cadenaTime = ""; }
            }

            let fecha: any;
            let horarioFinal: string;

            for (let k of this.meses) {
                if (k.check == true && cadenaTime == "") {
                    fecha = (<any>this.obtenerFecha).format("YYYY-MM");
                    //CONCATENAMOS EL TIEMPO Y LA FECHA PARA NUESTRA CONSULTA
                    horarioFinal = fecha + "" + cadenaTime;
                } else {
                    //CONVERTIMOS LA FECHA AL FORMATO UTILIZADO EN LOS JSON DE LA BD
                    fecha = (<any>this.obtenerFecha).format("YYYY-MM-DD");
                    //CONCATENAMOS EL TIEMPO Y LA FECHA PARA NUESTRA CONSULTA
                    horarioFinal = fecha + " " + cadenaTime;
                }
            }



            console.log("horario final: " + horarioFinal);
            if (this.ciudad == "Todos") { this.ciudad = ""; }
            this.mapServiceU.getTraficoCluster(horarioFinal, this.ciudad).subscribe((data: any) => {
                if (data == 0) {
                    Swal.fire(
                        'ERROR',
                        'No se encontraron Incidencias en esa fecha',
                        'error'
                    )
                } else {

                    this.listaIncidenciasCheck = data;

                    //REFRESCAR EL MAPCLUSTERING PARA QUE SE UBIQUE EN LA ZONA DEL LUGAR DONDE QUEREMOS CONSULTAR
                    this.mapClustering.remove();
                    this.mapClustering = new L.map(this.mapContainer.nativeElement).setView([data[0].location.y, data[0].location.x], 13);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="copyright">Openstreetmap</a>'
                    }).addTo(this.mapClustering);
                    /*** */



                    for (let i = 0; i < data.length; i++) {
                        let marker = L.marker(L.latLng(data[i].location.y, data[i].location.x), { icon: this.Icon1 });
                        this.markerListCluster.push(marker);
                    }
                    this.markersCluster.addLayers(this.markerListCluster);
                    this.mapClustering.addLayer(this.markersCluster);
                }

            });
            for (let j of this.horas) {
                if (j.check == true) { j.check = false; }
            }
            for (let k of this.meses) {
                if (k.check == true) { k.check = false; }
            }

            console.log((<any>this.obtenerFecha).format("YYYY-MM-DD"));
        }
    }//Fin SUBMIT


    //CHECKBOX
    filtraIncidencia(e: any) {
        if (this.listaIncidenciasCheck != null) {
            this.markersCluster.removeLayers(this.markerListCluster);
            this.markersCluster.removeLayers(this.markerListClusterCheck);
            this.markerListClusterCheck = [];
            this.clearMap(this.mapClustering);
            var remove = (arr, item) => {
                var i = arr.indexOf(item);
                i !== -1 && arr.splice(i, 1);
            };

            if (e.target.checked) {
                this.contadorChecked = this.contadorChecked + 1;
                this.markersCluster = L.markerClusterGroup();
                this.markersCluster.removeLayers(this.markerListCluster);
                this.markersCluster.removeLayers(this.markerListClusterCheck);
                console.log(this.listaIncidenciasCheck);
                for (let x of this.listaIncidenciasCheck) {
                    if (x.Type == e.target.value) {
                        this.aux.push(x);
                    }
                }
                this.markerListClusterCheck = [];
                for (let i = 0; i < this.aux.length; i++) {
                    console.log(i);
                    let marker = L.marker(L.latLng(this.aux[i].location.y, this.aux[i].location.x), { icon: this.Icon1 });
                    this.markerListClusterCheck.push(marker);
                }
                this.markersCluster.addLayers(this.markerListClusterCheck);
                this.mapClustering.addLayer(this.markersCluster);
                console.log(this.aux);
                console.log("contador " + this.contadorChecked);

            } else {
                this.contadorChecked = this.contadorChecked - 1;
                this.markersCluster = L.markerClusterGroup();
                this.markersCluster.removeLayers(this.markerListCluster);
                this.markersCluster.removeLayers(this.markerListClusterCheck);
                console.log("***");
                console.log(this.aux.length);
                let longitud = this.aux.length;

                for (let x = longitud - 1; x >= 0; x--) {
                    console.log(x);
                    if (this.aux[x].Type == e.target.value) {
                        remove(this.aux, this.aux[x]);
                    }
                }
                console.log(this.aux);
                this.markerListClusterCheck = [];
                for (let i = 0; i < this.aux.length; i++) {
                    let marker = L.marker(L.latLng(this.aux[i].location.y, this.aux[i].location.x), { icon: this.Icon1 });
                    this.markerListClusterCheck.push(marker);
                }
                this.markersCluster.addLayers(this.markerListClusterCheck);
                this.mapClustering.addLayer(this.markersCluster);
                console.log("contador " + this.contadorChecked);

                if (this.contadorChecked == 0) {
                    for (let i = 0; i < this.listaIncidenciasCheck.length; i++) {
                        let marker = L.marker(L.latLng(this.listaIncidenciasCheck[i].location.y, this.listaIncidenciasCheck[i].location.x), { icon: this.Icon1 });
                        this.markerListClusterCheck.push(marker);
                    }
                    this.markersCluster.addLayers(this.markerListClusterCheck);
                    this.mapClustering.addLayer(this.markersCluster);
                }
            }
        }


    }


}//fin clase