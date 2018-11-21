import {Usergroup} from './usergroup';

export class User {

  constructor(
    public username: string,
    public password: string,
    public email: string,
    public type: Usergroup,
    public enabled: boolean,
    public suspended: boolean = false,
  ) {
  }

}
