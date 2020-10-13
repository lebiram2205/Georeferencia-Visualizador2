import { Component, OnInit } from '@angular/core';
import { MapService } from "../../services/map.service";
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { FormBuilder, FormGroup, FormGroupName } from "@angular/forms";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  
  private barChartOption:ChartOptions;
  mapServiceU : MapService;
  public formGrup:FormGroup;

  constructor(public mapService:MapService, public fb:FormBuilder) {
    this.mapServiceU = mapService;
    
   }
  anio:string[]=["2019","2020"];
  incidencia:string[]=["ACCIDENT",
    "POLICE",
    "ROAD_CLOSED",
    "HAZARD",
    "JAM",
    "CHIT_CHAT"];

  listform=this.fb.group({
    anio:[''],
    incidencia:['']
  })

  onSubmit(){
    let tipoIncidencia:any=this.listform.value.incidencia;
    let fechaInc:any=this.listform.value.anio;
    // alert(this.listform.value.anio);
    // alert(this.listform.value.incidencia);
    this.mapServiceU.getIncidencias().subscribe( ( data:any ) => {
      var incidencia;
      var totales = [];
      var etiquetasFinales = [];
      var totalMes, etiquetaMes;

      for (var i = 0; i < data[0].incidencia.length; i++) {
        if (data[0].incidencia[i].anio == fechaInc) {
          for (var j = 0; j < data[0].incidencia[i].mes.length; j++) {
            for (var k = 0; k < (data[0].incidencia[i].mes[j].datos[0].tipo.length) ; k++) {                 
              if (tipoIncidencia.toLowerCase() == data[0].incidencia[i].mes[j].datos[0].tipo[k].tipo) {
                totalMes = data[0].incidencia[i].mes[j].datos[0].tipo[k].total;
                etiquetaMes = data[0].incidencia[i].mes[j].mes;
                totales.push(totalMes);
                etiquetasFinales.push(etiquetaMes);
              }
            }
          }
        }
      }
      console.log("Total " + totales);
      console.log("Etiquetas de meses"+ etiquetasFinales);
      this.randomize(totales, etiquetasFinales,fechaInc,tipoIncidencia);
    });

  }


  ngOnInit(): void {
    

  
  }


  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{ticks: {beginAtZero: true}}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [
    { data: [892420, 989092, 755321, 912970, 922403], label: '2019' },
    { data: [1012349, 586073, 80753, 80541, 76972], label: '2020' }
  ];
  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
  public randomize(t:any,e:any,f:any,i:any): void {
    console.log(i);
    if(i=="Totales Incidencias" && f=="Todos"){
      this.barChartData[0].data=[892420, 989092, 755321, 912970, 922403];
      this.barChartData[1].data=[1012349, 586073, 80753, 80541, 76972];
      this.barChartData[0].label = '2019';
      this.barChartData[1].label = '2020';
    }
    else{
      // Only Change 3 values
      const data = t;
      const labels=e;
      const fecha=f;  
      this.barChartData[0].data = data;
      this.barChartData[0].label = fecha;
      delete this.barChartData[1].data;
      this.barChartLabels=labels;
    }
  }
  
}//fin de la clase