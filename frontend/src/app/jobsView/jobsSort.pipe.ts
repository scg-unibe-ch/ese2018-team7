import { Pipe, PipeTransform } from '@angular/core';
import {PageEvent} from '@angular/material';
import {Job} from '../job';

@Pipe({
  name: 'jobsSortPipe',
  pure: false
})
export class JobsSortPipe implements PipeTransform {
  transform(jobs: Job[], filter: string): any {
    if (!jobs || !filter) {
      return jobs;
    }

    jobs = jobs.sort((job1, job2) => {

      switch (filter) {
        case 'titleASC':
          return (job1.title < job2.title ? -1 : 1);
        case 'titleDESC':
          return (job1.title > job2.title ? -1 : 1);
        case 'workloadASC':
          if (job1.workload === job2.workload) {
            return (job1.title < job2.title ? -1 : 1);
          }
          return (job1.workload < job2.workload ? -1 : 1);
        case 'workloadDESC':
          if (job1.workload === job2.workload) {
            return (job1.title > job2.title ? -1 : 1);
          }
          return (job1.workload > job2.workload ? -1 : 1);
        case 'startworkASC':
          if (job1.startOfWork === job2.startOfWork) {
            return (job1.title < job2.title ? -1 : 1);
          }
          return (job1.startOfWork < job2.startOfWork ? -1 : 1);
        case 'startworkDESC':
          if (job1.startOfWork === job2.startOfWork) {
            return (job1.title > job2.title ? -1 : 1);
          }
          return (job1.startOfWork > job2.startOfWork ? -1 : 1);
      }

      return 0;
    });

    return jobs;
  }
}
