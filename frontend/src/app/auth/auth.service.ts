import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Usergroup} from '../usergroup';

/**
 * Provides the components if the user is login or admin and redirects if needed
 */
export class AuthService {

  private static usergroup = Usergroup.public;
  private static username = '';
  private static set = false;

  constructor() {}

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
      const response: any = await httpClient.get('http://localhost:3000/login/check', {withCredentials: true}).toPromise();
      if (response.value === 'true') {
        this.usergroup = response.type;
        this.username = response.username;
      } else {
        this.usergroup = Usergroup.public;
        this.username = '';
      }
      this.set = true;
    }

    return true;
  }

  /**
   * If the current user isn't loggedin -> redirect to the login-page
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
   * If the current user isn't loggedin at all -> redirect to /
   */
  static async allowOnlyPublic(httpClient: HttpClient, router: Router) {

    await this.update(httpClient);

    if (this.usergroup < Usergroup.public) {
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

  static isMe(user) {
    return user === this.username;
  }
}
