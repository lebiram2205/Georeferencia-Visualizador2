import{ RouterModule, Routes} from '@angular/router';
// import{ MapComponent} from './components/map/map.component';
// import { ChartComponent } from "./components/chart/chart.component";

import { PageMapComponent } from './map/pages/page-map/page-map.component';
import { PageChartComponent } from './chart/pages/page-chart/page-chart.component';


//arreglo de rutas 
const APP_ROUTES:Routes=[

    {path: 'map', component:PageMapComponent},
    {path: 'chart', component:PageChartComponent},
    {path: '**', pathMatch:'full', redirectTo:'map'}
   
];
export const APP_ROUTING=RouterModule.forRoot(APP_ROUTES);