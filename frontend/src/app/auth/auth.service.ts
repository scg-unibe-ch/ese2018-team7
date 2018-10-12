import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

/**
 * Provides the components if the user is login or admin and redirects if needed
 */
export class AuthService {

  private static login = false;
  private static admin = false;
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
      this.login = response.value === 'true' ;
      this.admin = response.value === 'true' && response.admin === 'true';
      this.set = true;
    }

    return true;
  }

  /**
   * If the current user isn't loggedin -> redirect to the login-page
   */
  static async allowOnlyLogin(httpClient: HttpClient, router: Router) {

    await this.update(httpClient);

    if (!this.login) {
      router.navigate(['/login']);
    }

  }

  /**
   * If the current user isn't an admin -> redirect to the login-page
   */
  static async allowOnlyAdmin(httpClient: HttpClient, router: Router) {

    await this.update(httpClient);

    if (!this.admin) {
      router.navigate(['/login']);
    }

  }

  /**
   * If the current user isn't loggedin at all -> redirect to /
   */
  static async allowOnlyPublic(httpClient: HttpClient, router: Router) {

    await this.update(httpClient);

    if (this.login) {
      router.navigate(['/']);
    }

  }

  /**
   * Returns the last status, if the user is login
   * DOESN'T UPDATE STATUS!
   */
  static isLogin() {
   return this.login;
  }

  /**
   * Returns the last status, if the user is an admin
   * DOESN'T UPDATE STATUS!
   */
  static isAdmin() {
    return this.login && this.admin;
  }

}
