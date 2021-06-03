import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaTraficoComponent } from './mapa-trafico.component';

describe('MapaTraficoComponent', () => {
  let component: MapaTraficoComponent;
  let fixture: ComponentFixture<MapaTraficoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaTraficoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaTraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
