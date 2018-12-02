import {Pipe, PipeTransform} from '@angular/core';

import {Job} from '../job';
import {AuthService} from '../auth/auth.service';

/**
 * Custom sorting options for our `jobsEdit`
 */
@Pipe({
  name: 'jobsEditSortPipe',
  pure: false
})

export class JobsEditSortPipe implements PipeTransform {

  transform(jobs: Job[], filter: string): any {
    if (!jobs || !filter) {
      return jobs;
    }

    jobs = jobs.sort((job1, job2) => {
      let title1 = job1.title;
      let title2 = job2.title;

      if (AuthService.isModOrAdmin()) {
        title1 = job1.company.name + ' - ' + job1.title;
        title2 = job2.company.name + ' - ' + job2.title;
      }

      switch (filter) {
        case 'todo':
          if ((!job1.approved && !job2.approved) ||
            (!job1.approved && job2.changed) ||
            (job1.changed && !job2.approved) ||
            (job1.changed && job2.changed) ||
            (job1.approved && !job1.changed && job2.approved && !job2.changed)
          ) {
            return (title1 < title2 ? -1 : 1);
          }
          return (!job1.approved || job1.changed) ? -1 : 1;
        case 'titleASC':
          return (title1 < title2 ? -1 : 1);
        case 'titleDESC':
          return (title1 > title2 ? -1 : 1);
        case 'workloadASC':
          if (job1.workload === job2.workload) {
            return (title1 < title2 ? -1 : 1);
          }
          return (job1.workload < job2.workload ? -1 : 1);
        case 'workloadDESC':
          if (job1.workload === job2.workload) {
            return (title1 > title2 ? -1 : 1);
          }
          return (job1.workload > job2.workload ? -1 : 1);
        case 'startworkASC':
          if (job1.startOfWork === job2.startOfWork) {
            return (title1 < title2 ? -1 : 1);
          }
          return (job1.startOfWork < job2.startOfWork ? -1 : 1);
        case 'startworkDESC':
          if (job1.startOfWork === job2.startOfWork) {
            return (title1 > title2 ? -1 : 1);
          }
          return (job1.startOfWork > job2.startOfWork ? -1 : 1);
      }
      return 0;
    });
    return jobs;
  }

}
