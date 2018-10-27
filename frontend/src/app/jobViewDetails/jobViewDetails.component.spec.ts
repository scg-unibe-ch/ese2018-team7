import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {JobViewDetailsComponent} from './jobViewDetails.component';


describe('JobViewDetailsComponent', () => {
  let component: JobViewDetailsComponent;
  let fixture: ComponentFixture<JobViewDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobViewDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
