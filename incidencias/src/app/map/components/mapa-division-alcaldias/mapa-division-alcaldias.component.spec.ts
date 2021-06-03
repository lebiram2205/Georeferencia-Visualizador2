import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaDivisionAlcaldiasComponent } from './mapa-division-alcaldias.component';

describe('MapaDivisionAlcaldiasComponent', () => {
  let component: MapaDivisionAlcaldiasComponent;
  let fixture: ComponentFixture<MapaDivisionAlcaldiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaDivisionAlcaldiasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaDivisionAlcaldiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
