import {Usergroup} from './usergroup';

export class User {

  constructor(
    public username: string,
    public password: string,
    public type: Usergroup,
    public enabled: boolean,
  ) {
  }

}
