import { Pipe, PipeTransform } from '@angular/core';
import {PageEvent} from '@angular/material';
import {Job} from '../job';

@Pipe({
  name: 'jobsPageinatorPipe',
  pure: false
})
export class JobsPageinatorPipe implements PipeTransform {
  transform(jobs: Job[], filter: PageEvent): any {
    if (!jobs || !filter) {
      return jobs;
    }

    return jobs.filter(job => jobs.indexOf(job) >= (filter.pageIndex * filter.pageSize) &&
        jobs.indexOf(job) < ((filter.pageIndex + 1) * filter.pageSize));
  }
}
