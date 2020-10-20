import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";//para comunicar con nuestra API REST
import { MapComponent } from "../components/map/map.component";
@Injectable({
  providedIn: 'root'
})
export class MapService {
  readonly URL_API= 'http://localhost:3000';

  constructor(private http:HttpClient) { }

  //2020-01-14 05:57:00:000
  getTrafico(){
    return this.http.get(this.URL_API +'/trafico');
    //return this.http.get(this.URL_API +'/trafico'+'/2020-01-14 05:57:00:000');
  }
  getTraficoCluster(date:any,city:any){
    return this.http.get(this.URL_API +'/trafico/'+date+' 05/'+city);
  }
  getCities(){
    return this.http.get(this.URL_API+'/trafico/cities');
  }
  getSemaforoizt(){
    return this.http.get(this.URL_API+'/semaforoizt');
  }
  getSemaforoizc(){
    return this.http.get(this.URL_API+'/semaforoizc');
  }
  getSemaforomh(){
    return this.http.get(this.URL_API+'/semaforomh');
  }
  getCallesCerradas(){
    return this.http.get(this.URL_API+'/callescerradas');
  }
  getCallesCerradas2(){
    return this.http.get(this.URL_API+'/trafico');
    //return this.http.get(this.URL_API +'/trafico'+'/2020-01-14 05:57:00:000');
  }
  getAlcaldias(){
    return this.http.get(this.URL_API+'/alcaldias');
  }
  getIncidencias(){
    return this.http.get(this.URL_API+'/incidencias');
  }
}
