import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenciasCdmxComponent } from './incidencias-cdmx.component';

describe('IncidenciasCdmxComponent', () => {
  let component: IncidenciasCdmxComponent;
  let fixture: ComponentFixture<IncidenciasCdmxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidenciasCdmxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidenciasCdmxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
