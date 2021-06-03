import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaTraficoDensoComponent } from './mapa-trafico-denso.component';

describe('MapaTraficoDensoComponent', () => {
  let component: MapaTraficoDensoComponent;
  let fixture: ComponentFixture<MapaTraficoDensoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaTraficoDensoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaTraficoDensoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
