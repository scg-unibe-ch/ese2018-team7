import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {UsersEditCompanyViewComponent} from './usersEditCompanyView.component';


describe('UsersEditCompanyViewComponent', () => {
  let component: UsersEditCompanyViewComponent;
  let fixture: ComponentFixture<UsersEditCompanyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersEditCompanyViewComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersEditCompanyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
