import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Usergroup} from '../usergroup';
import {Observable, of} from 'rxjs';
import {MenuCountService} from '../menuCount/menuCount.service';

/**
 * Provides the components if the user is login or admin and redirects if needed
 */
export class AuthService {

  private static usergroup = Usergroup.public;
  private static username = '';
  private static set = false;
  private static observerEl;
  private static observable: Observable<Boolean> = new Observable(obs => {
    AuthService.observerEl = obs;
  });

  constructor() {
    AuthService.observable = of(AuthService.set);
  }

  /**
   * Forces to ask the server for the current status
   */
  static async forceUpdate(httpClient: HttpClient) {
    this.set = false;
    return await this.update(httpClient);
  }

  /**
   * Updates the current status if needed, but has a buffer
   */
  static async update(httpClient: HttpClient) {
    if (!this.set) {
      const response: any = await httpClient.get('/login/check', {withCredentials: true}).toPromise();
      if (response.value === 'true') {
        this.usergroup = response.type;
        this.username = response.username;
      } else {
        this.usergroup = Usergroup.public;
        this.username = '';
      }
      this.set = true;
      this.observerEl.next();
    }

    return true;
  }

  /**
   * If the current user isn't logged in -> redirect to the login-page
   */
  static async allowOnlyLogin(httpClient: HttpClient, router: Router) {

    await this.update(httpClient);

    if (this.usergroup >= Usergroup.public) {
      router.navigate(['/login']);
    }

  }

  /**
   * If the current user isn't an admin -> redirect to the login-page
   */
  static async allowOnlyModsAndAdmin(httpClient: HttpClient, router: Router) {

    await this.update(httpClient);

    if (this.usergroup > Usergroup.moderator) {
      router.navigate(['/login']);
    }

  }

  /**
   * If the current user isn't logged in at all -> redirect to /
   */
  static async allowOnlyPublic(httpClient: HttpClient, router: Router) {

    await this.update(httpClient);

    if (this.usergroup < Usergroup.public) {
      router.navigate(['/']);
    }

  }

  /**
   * If the current user isn't logged in at all -> redirect to /
   */
  static async allowOnlyEmployer(httpClient: HttpClient, router: Router) {

    await this.update(httpClient);

    if (this.usergroup !== Usergroup.employer) {
      router.navigate(['/']);
    }

  }

  /**
   * Returns the last status, if the user is login
   * DOESN'T UPDATE STATUS!
   */
  static isLogin() {
   return this.usergroup < Usergroup.public;
  }

  /**
   * Returns the last status, if the user is an admin or mod
   * DOESN'T UPDATE STATUS!
   */
  static isModOrAdmin() {
    return this.usergroup <= Usergroup.moderator;
  }

  /**
   * Returns the last status, if the user is an admin
   * DOESN'T UPDATE STATUS!
   */
  static isAdmin() {
    return this.usergroup <= Usergroup.administrator;
  }

  /**
   * Returns the last status, the username
   * DOESN'T UPDATE STATUS!
   */
  static getUsername() {
    return this.username;
  }

  /**
   * Returns the last status, if the user is an employer
   * DOESN'T UPDATE STATUS!
   */
  static isEmployer() {
    return this.usergroup === Usergroup.employer;
  }

  static isMe(user) {
    return user === this.username;
  }

  static observer(): Observable<Boolean> {
    return this.observable;
  }
}
