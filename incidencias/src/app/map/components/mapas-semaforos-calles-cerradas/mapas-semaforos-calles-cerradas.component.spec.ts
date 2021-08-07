import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapasSemaforosCallesCerradasComponent } from './mapas-semaforos-calles-cerradas.component';

describe('MapasSemaforosCallesCerradasComponent', () => {
  let component: MapasSemaforosCallesCerradasComponent;
  let fixture: ComponentFixture<MapasSemaforosCallesCerradasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapasSemaforosCallesCerradasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapasSemaforosCallesCerradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
