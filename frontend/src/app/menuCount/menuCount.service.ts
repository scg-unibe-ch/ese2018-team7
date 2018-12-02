import {HttpClient} from '@angular/common/http';

import {AuthService} from '../auth/auth.service';

/**
 * Service to display a small badge in the menu with number of jobs or users
 * that need special attention by the user or administrator
 */
export class MenuCountService {

  /**
   * Number of jobs that need attention
   */
  private static jobCount;

  /**
   * Number of users that need attention
   */
  private static userCount;

  /**
   * Get number of jobs that need attention
   */
  static getJobCount() {
    if (AuthService.isLogin()) {
      return MenuCountService.jobCount;
    }
    return 0;
  }

  /**
   * Get number of users that need attention
   */
  static getUserCount() {
    if (AuthService.isModOrAdmin()) {
      return MenuCountService.userCount;
    }
    return 0;
  }

  /**
   * Update and reload the numbers from the server
   * @param httpClient
   */
  static async update(httpClient: HttpClient) {
    if (AuthService.isLogin()) {
      httpClient.get('/menuCount', {withCredentials: true}).subscribe(
        (res: any) => {
          MenuCountService.jobCount = res.jobs;
          MenuCountService.userCount = res.users;

          if (MenuCountService.jobCount === 0) {
            MenuCountService.jobCount = null;
          }
          if (MenuCountService.userCount === 0) {
            MenuCountService.userCount = null;
          }

        },
        err => {
          MenuCountService.jobCount = null;
          MenuCountService.userCount = null;
        }
      );
    }
  }

}
