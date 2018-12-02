import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JobViewComponent} from './jobView.component';

describe('JobComponent', () => {
  let component: JobViewComponent;
  let fixture: ComponentFixture<JobViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
