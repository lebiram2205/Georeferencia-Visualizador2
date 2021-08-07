import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaIncidenciasComponent } from './mapa-incidencias.component';

describe('MapaIncidenciasComponent', () => {
  let component: MapaIncidenciasComponent;
  let fixture: ComponentFixture<MapaIncidenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaIncidenciasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaIncidenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
