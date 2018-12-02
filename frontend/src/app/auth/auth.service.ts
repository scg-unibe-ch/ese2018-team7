import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';

import {Usergroup} from '../usergroup';

/**
 * Authentication service which provides information about the user to the components and handles the redirecting
 *
 * This class is a Singleton.
 */
export class AuthService {

  /**
   * Usergroup of the logged in user
   */
  private static usergroup = Usergroup.public;

  /**
   * Username of the logged in user
   */
  private static username = '';

  /**
   * Ask Marcel?
   */
  private static set = false;

  /**
   * Observer for the AuthService
   */
  private static observerEl;

  /**
   * Observable for the AuthService
   */
  private static observable: Observable<Boolean> = new Observable(obs => {
    AuthService.observerEl = obs;
  });

  /**
   * Creates a new instance of AuthService
   */
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
   *
   * DOESN'T UPDATE STATUS!
   */
  static isLogin(): boolean {
   return this.usergroup < Usergroup.public;
  }

  /**
   * Returns the last status, if the user is an admin or mod
   *
   * DOESN'T UPDATE STATUS!
   */
  static isModOrAdmin(): boolean {
    return this.usergroup <= Usergroup.moderator;
  }

  /**
   * Returns the last status, if the user is an admin
   *
   * DOESN'T UPDATE STATUS!
   */
  static isAdmin(): boolean {
    return this.usergroup <= Usergroup.administrator;
  }

  /**
   * Returns the last status, the username
   * @returns Username of the logged in user
   *
   * DOESN'T UPDATE STATUS!
   */
  static getUsername(): string {
    return this.username;
  }

  /**
   * Returns the last status, if the user is an employer
   *
   * DOESN'T UPDATE STATUS!
   */
  static isEmployer(): boolean {
    return this.usergroup === Usergroup.employer;
  }

  /**
   * Returns the last status, if the provided user matches the logged in user
   * @param user User to compare with
   */
  static isMe(user): boolean {
    return user === this.username;
  }

  /**
   * Simple observer which returns Observable
   */
  static observer(): Observable<Boolean> {
    return this.observable;
  }
}
