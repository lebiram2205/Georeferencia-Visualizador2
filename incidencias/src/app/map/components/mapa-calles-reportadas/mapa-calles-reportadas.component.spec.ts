import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaCallesReportadasComponent } from './mapa-calles-reportadas.component';

describe('MapaCallesReportadasComponent', () => {
  let component: MapaCallesReportadasComponent;
  let fixture: ComponentFixture<MapaCallesReportadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaCallesReportadasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaCallesReportadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
