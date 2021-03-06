import {Pipe, PipeTransform} from '@angular/core';
import {PageEvent} from '@angular/material';

import {Job} from '../job';

/**
 * Custom paginator for our job overview which saves the users selection in a cookie
 */
@Pipe({
  name: 'jobsPaginatorPipe',
  pure: false
})

export class JobsPaginatorPipe implements PipeTransform {

  transform(jobs: Job[], filter: PageEvent): any {
    if (this.getCookie('pageSize') === '') {
      document.cookie = 'pageSize=' + filter.pageSize;
    } else {
      filter.pageSize = parseInt(this.getCookie('pageSize'), 10);
    }

    if (!jobs || !filter) {
      return jobs;
    }

    return jobs.filter(job => jobs.indexOf(job) >= (filter.pageIndex * filter.pageSize) &&
        jobs.indexOf(job) < ((filter.pageIndex + 1) * filter.pageSize));
  }

  /**
   * Get content of cookie with the specified name
   *
   * Returns an empty string if no cookie exists with this name
   * @param cname Name of the cookie that should be retrieved
   * @returns Content of the specified cookie
   */
  getCookie(cname) {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

}
