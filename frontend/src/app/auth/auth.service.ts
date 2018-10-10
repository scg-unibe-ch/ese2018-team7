export class AuthService {
  private static login = false;

  constructor() {}

  static isLogin() {
   return this.login;
  }
  static setLogin(login: boolean) {
    this.login = login;
  }

}
