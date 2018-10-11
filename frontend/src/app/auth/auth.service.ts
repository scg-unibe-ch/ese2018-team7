export class AuthService {
  private static login = false;
  private static admin = false;

  constructor() {}

  static isLogin() {
   return this.login;
  }
  static isAdmin() {
    return this.login && this.admin;
  }
  static setLogin(login: boolean, admin: boolean) {
    this.login = login;
    this.admin = admin;
  }

}
