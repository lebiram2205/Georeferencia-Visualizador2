import{ RouterModule, Routes} from '@angular/router';
import{ MapComponent} from './components/map/map.component';
import { ChartComponent } from "./components/chart/chart.component";
//arreglo de rutas 
const APP_ROUTES:Routes=[

    {path: 'map', component:MapComponent},
    {path: 'chart', component:ChartComponent},
    {path: '**', pathMatch:'full', redirectTo:'map'}
   
];
export const APP_ROUTING=RouterModule.forRoot(APP_ROUTES);