import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {JobsAdvancedSearchComponent} from './jobsAdvancedSearch.component';


describe('JobsAdvancedSearchComponent', () => {
  let component: JobsAdvancedSearchComponent;
  let fixture: ComponentFixture<JobsAdvancedSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsAdvancedSearchComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsAdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
