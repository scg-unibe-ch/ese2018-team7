import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JobsEditComponent} from './jobsEdit.component';

describe('JobsEditComponent', () => {
  let component: JobsEditComponent;
  let fixture: ComponentFixture<JobsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsEditComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
