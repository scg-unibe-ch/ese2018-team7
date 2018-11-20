import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {SelectLogoComponent} from './selectLogo.component';


describe('SelectLogoComponent', () => {
  let component: SelectLogoComponent;
  let fixture: ComponentFixture<SelectLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectLogoComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
