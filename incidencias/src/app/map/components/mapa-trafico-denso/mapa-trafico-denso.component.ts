import { Component, OnInit, DoCheck, AfterViewInit, Injectable, ViewChild, ElementRef } from '@angular/core';
import { MapService } from "../../../services/map.service";
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { FormControl, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { stringify } from 'querystring';
import { NgModule } from '@angular/core';


import { NgbTimeStruct, NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';

import Swal from 'sweetalert2';
import { Date } from 'mongoose';



@Component({
    selector: 'app-mapa-trafico-denso',
    templateUrl: './mapa-trafico-denso.component.html',
    styleUrls: ['./mapa-trafico-denso.component.css']
})
export class MapaTraficoDensoComponent implements AfterViewInit {

    rango: number = 0;
    banderaPausa: boolean = false;
    banderaMapa: boolean = true;
    paintLine: boolean = false;
    horario: string = "00:00"
    arregloTrafico: any[];
    activarBtn = true;
    marcas: any;
    marcasLineas: any;
    nombrePlayPausa: string = "play_circle";
    banderaPlayPausa: boolean = true;

    timeCtrl = new FormControl(this.horario, []);
    rangeControl = new FormControl(this.rango, [Validators.max(287), Validators.min(0)]);


    @ViewChild('mapClustering', { static: true }) 
    mapContainer: ElementRef;
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
            this.rango = value;
            // this.banderaPausa = true;
            this.ajustarlinea(this.rango);
            console.log(value);
            
        })
    }

    ngAfterViewInit() {

        //Obtenemos de manera dinamica los lugares a mostrar en el input select
        this.mapServiceU.getCities().subscribe((data: any) => {
            this.lista = Object.values(data);
            this.lista.push("Todos");
        });

        this.map = L.map('mapDenso').setView([19.37596, -99.07000], 11);
        //Fondo de trafico denso
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="copyright">Openstreetmap</a>'
        }).addTo(this.map);

    }

    controlAtras(event: Event) {
        if (this.rango > 0) {
            this.rango -= 1;;
            this.ajustarlinea(this.rango);
            event.preventDefault();

        }
    }

    controlAdelante(event: Event) {
        if (this.rango < 288) {
            this.rango += 1;;
            this.ajustarlinea(this.rango);
            event.preventDefault();
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

    reproducir(event: Event) {
        event.preventDefault();
        console.log('Btn reproducir');
        if (this.banderaPlayPausa) {
            if (this.banderaPausa) {
                this.borrarClosters();
                console.log('Se debe borrar');
            }
            this.banderaPausa = false;
            this.pintarClosters(this.rango);
            this.nombrePlayPausa = 'pause';
            this.banderaPlayPausa = false;
        } else {
            this.banderaPausa = true;
            console.log("La pausa es " + this.banderaPausa);
            this.nombrePlayPausa = 'play_circle';
            this.banderaPlayPausa = true;
        }
        // this.reprodurtor(this.rango);  
        // console.log(this.arregloTrafico);
    }

    ajustarHora(hora: string) {
        // let minutos = hora.split(":");
        let horas: string[] = ["00:00", "00:05", "00:10", "00:15", "00:20", "00:25", "00:30", "00:35", "00:40", "00:45", "00:50", "00:55", "01:00", "01:05", "01:10", "01:15", "01:20", "01:25", "01:30", "01:35", "01:40", "01:45", "01:50", "01:55", "02:00", "02:05", "02:10", "02:15", "02:20", "02:25", "02:30", "02:35", "02:40", "02:45", "02:50", "02:55", "03:00", "03:05", "03:10", "03:15", "03:20", "03:25", "03:30", "03:35", "03:40", "03:45", "03:50", "03:55", "04:00", "04:05", "04:10", "04:15", "04:20", "04:25", "04:30", "04:35", "04:40", "04:45", "04:50", "04:55", "05:00", "05:05", "05:10", "05:15", "05:20", "05:25", "05:30", "05:35", "05:40", "05:45", "05:50", "05:55", "06:00", "06:05", "06:10", "06:15", "06:20", "06:25", "06:30", "06:35", "06:40", "06:45", "06:50", "06:55", "07:00", "07:05", "07:10", "07:15", "07:20", "07:25", "07:30", "07:35", "07:40", "07:45", "07:50", "07:55", "08:00", "08:10", "08:10", "08:15", "08:20", "08:25", "08:30", "08:35", "08:40", "08:45", "08:50", "08:55", "10:00", "09:05", "09:10", "09:15", "09:20", "09:25", "09:30", "09:35", "09:40", "09:45", "09:50", "09:55", "10:00", "10:05", "10:10", "10:15", "10:20", "10:25", "10:30", "10:35", "10:40", "10:45", "10:50", "10:55", "11:00", "11:05", "11:10", "11:15", "11:20", "11:25", "11:30", "11:35", "11:40", "11:45", "11:50", "11:55", "12:00", "12:05", "12:10", "12:15", "12:20", "12:25", "12:30", "12:25", "12:40", "12:45", "12:50", "12:55", "13:00", "13:05", "13:10", "13:15", "13:20", "13:25", "13:30", "13:35", "13:40", "13:45", "13:50", "13:55", "14:00", "14:05", "14:10", "14:15", "14:20", "14:25", "14:30", "14:35", "14:40", "14:45", "14:50", "14:55", "15:00", "15:05", "15:10", "15:15", "15:20", "15:25", "15:30", "15:35", "15:40", "15:45", "15:50", "15:55", "16:00", "16:05", "16:10", "16:15", "16:20", "16:25", "16:30", "16:35", "16:40", "16:45", "16:50", "16:55", "17:00", "17:05", "17:10", "17:15", "17:20", "17:25", "17:30", "17:35", "17:40", "17:45", "17:50", "17:55", "18:00", "18:05", "18:10", "18:15", "18:20", "18:25", "18:30", "18:35", "18:40", "18:45", "18:50", "18:55", "19:00", "19:05", "19:10", "19:15", "19:20", "19:25", "19:30", "19:35", "19:40", "19:45", "19:50", "19:55", "20:00", "20:05", "20:10", "20:15", "20:20", "20:25", "20:30", "20:35", "20:40", "20:45", "20:50", "20:55", "21:00", "21:05", "21:10", "21:15", "21:20", "21:25", "21:30", "21:35", "21:40", "21:45", "21:50", "21:55", "22:00", "22:05", "22:10", "22:15", "22:20", "22:25", "22:30", "22:35", "22:40", "22:45", "22:50", "22:55", "23:00", "23:05", "23:10", "23:15", "23:20", "23:25", "23:30", "23:35", "23:40", "23:45", "23:50", "23:55"]
        for (let w = 0; w < 288; w++) {
            if (hora == horas[w]) {
                return w;
            }
        }
    }
    ajustarlinea(rango: number) {
        let horas: string[] = ["00:00", "00:05", "00:10", "00:15", "00:20", "00:25", "00:30", "00:35", "00:40", "00:45", "00:50", "00:55", "01:00", "01:05", "01:10", "01:15", "01:20", "01:25", "01:30", "01:35", "01:40", "01:45", "01:50", "01:55", "02:00", "02:05", "02:10", "02:15", "02:20", "02:25", "02:30", "02:35", "02:40", "02:45", "02:50", "02:55", "03:00", "03:05", "03:10", "03:15", "03:20", "03:25", "03:30", "03:35", "03:40", "03:45", "03:50", "03:55", "04:00", "04:05", "04:10", "04:15", "04:20", "04:25", "04:30", "04:35", "04:40", "04:45", "04:50", "04:55", "05:00", "05:05", "05:10", "05:15", "05:20", "05:25", "05:30", "05:35", "05:40", "05:45", "05:50", "05:55", "06:00", "06:05", "06:10", "06:15", "06:20", "06:25", "06:30", "06:35", "06:40", "06:45", "06:50", "06:55", "07:00", "07:05", "07:10", "07:15", "07:20", "07:25", "07:30", "07:35", "07:40", "07:45", "07:50", "07:55", "08:00", "08:10", "08:10", "08:15", "08:20", "08:25", "08:30", "08:35", "08:40", "08:45", "08:50", "08:55", "10:00", "09:05", "09:10", "09:15", "09:20", "09:25", "09:30", "09:35", "09:40", "09:45", "09:50", "09:55", "10:00", "10:05", "10:10", "10:15", "10:20", "10:25", "10:30", "10:35", "10:40", "10:45", "10:50", "10:55", "11:00", "11:05", "11:10", "11:15", "11:20", "11:25", "11:30", "11:35", "11:40", "11:45", "11:50", "11:55", "12:00", "12:05", "12:10", "12:15", "12:20", "12:25", "12:30", "12:25", "12:40", "12:45", "12:50", "12:55", "13:00", "13:05", "13:10", "13:15", "13:20", "13:25", "13:30", "13:35", "13:40", "13:45", "13:50", "13:55", "14:00", "14:05", "14:10", "14:15", "14:20", "14:25", "14:30", "14:35", "14:40", "14:45", "14:50", "14:55", "15:00", "15:05", "15:10", "15:15", "15:20", "15:25", "15:30", "15:35", "15:40", "15:45", "15:50", "15:55", "16:00", "16:05", "16:10", "16:15", "16:20", "16:25", "16:30", "16:35", "16:40", "16:45", "16:50", "16:55", "17:00", "17:05", "17:10", "17:15", "17:20", "17:25", "17:30", "17:35", "17:40", "17:45", "17:50", "17:55", "18:00", "18:05", "18:10", "18:15", "18:20", "18:25", "18:30", "18:35", "18:40", "18:45", "18:50", "18:55", "19:00", "19:05", "19:10", "19:15", "19:20", "19:25", "19:30", "19:35", "19:40", "19:45", "19:50", "19:55", "20:00", "20:05", "20:10", "20:15", "20:20", "20:25", "20:30", "20:35", "20:40", "20:45", "20:50", "20:55", "21:00", "21:05", "21:10", "21:15", "21:20", "21:25", "21:30", "21:35", "21:40", "21:45", "21:50", "21:55", "22:00", "22:05", "22:10", "22:15", "22:20", "22:25", "22:30", "22:35", "22:40", "22:45", "22:50", "22:55", "23:00", "23:05", "23:10", "23:15", "23:20", "23:25", "23:30", "23:35", "23:40", "23:45", "23:50", "23:55"];
        for (let w = 0; w < 288; w++) {
            if (rango == w) {
                this.horario = horas[w];
            }
        }
    }


    getPausa() {
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

    pintarLineas(event: Event) {
        if (this.paintLine) {
            this.paintLine = false;
            console.log(event);
        } else {
            this.paintLine = true;
            console.log(event);
        }
    }


    fechaTrafico() {
        let horario
        this.horarioTraficoDenso = horario;
        let that = this;

        if (this.banderaMapa) {
            this.mapServiceU.getAlcaldias().subscribe((data: any) => {
                L.geoJSON(data[0]).addTo(that.map);
                this.banderaMapa = false;
            });

            this.mapServiceU.gettraficoDenso().subscribe((dataT: any) => {
                this.arregloTrafico = dataT;
                console.log('Se obtuvo los datos del mapa');
                // alert('Llegaron los datos');
                this.activarBtn = false;
            });
        }

    }


    borrarClosters() {
        this.map.removeLayer(this.marcas);
        this.map.removeLayer(this.marcasLineas);
    }

    pintarClosters(rango: number) {
        let markers = L.markerClusterGroup();
        let capaLineas = L.markerClusterGroup();
        let segment;
        let tiempo = rango;
        let data = this.arregloTrafico;
        let that = this;
        let pausa: boolean;

        function animacion() {
            // console.log('El tiempo es:' + tiempo);
            pausa = that.banderaPausa
            that.rango = tiempo;
            that.ajustarlinea(tiempo);

            capaLineas.clearLayers();
            that.map.removeLayer(capaLineas);

            markers.clearLayers();
            that.map.removeLayer(markers);

            if (data.length) {
                that.map.removeLayer(markers);
                markers = L.markerClusterGroup();

                that.map.removeLayer(capaLineas);
                capaLineas = L.markerClusterGroup();

                that.horarioTraficoDenso = data[tiempo].tiempo[0];
                for (let j = 0; j < (data[tiempo].lineas.length); j++) {
                    for (let k = 0; k < (data[tiempo].lineas[j].length - 1); k++) {
                        let marker = L.marker(new L.LatLng(data[tiempo].lineas[j][k].y, data[tiempo].lineas[j][k].x), { title: "Datos Closters" });
                        markers.addLayer(marker);
                        let pointA = new L.LatLng(data[tiempo].lineas[j][k].y, data[tiempo].lineas[j][k].x);
                        let pointB = new L.LatLng(data[tiempo].lineas[j][k + 1].y, data[tiempo].lineas[j][k + 1].x);
                        let pointList = [pointA, pointB];
                        //console.log(data[tiempo].lineas[j][k+1].y );//lineas[12]
                        segment = new L.Polyline(pointList,
                            {
                                color: '#DB3A34',
                                weight: 6,
                                opacity: 0.5,
                                smoothFactor: 1
                            });
                        segment.addTo(capaLineas);//aggrega al mapa
                    }//fin for k
                }
                if (that.paintLine) {
                    that.map.addLayer(capaLineas);
                }

                that.marcas = markers;
                that.marcasLineas = capaLineas;
                tiempo++;
                that.map.addLayer(markers);
                if (tiempo < data.length && pausa == false) {
                    setTimeout(animacion, 2000);
                }
            }
        }
        animacion();

    }


}
