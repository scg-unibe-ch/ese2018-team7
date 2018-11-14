import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';

export class MenuCountService {

  private static jobCount;
  private static userCount;

  static getJobCount() {
    if (AuthService.isLogin()) {
      return MenuCountService.jobCount;
    }
    return 0;
  }
  static getUserCount() {
    if (AuthService.isModOrAdmin()) {
      return MenuCountService.userCount;
    }
    return 0;
  }
  static async update(httpClient: HttpClient) {
    if (AuthService.isLogin()) {
      httpClient.get('/menuCount', {withCredentials: true}).subscribe(
        (res: any) => {
          MenuCountService.jobCount = res.jobs;
          MenuCountService.userCount = res.users;
        },
        err => {
          MenuCountService.jobCount = null;
          MenuCountService.userCount = null;
        }
      );
    }
  }

}
