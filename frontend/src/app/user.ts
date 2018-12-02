import {Usergroup} from './usergroup';

/**
 * Frontend model for users
 */
export class User {

  /**
   * Creates a new user
   * @param username Username
   * @param password Password
   * @param type Type of the user, view definition of usergroup for more information
   * @param enabled Flag if user has been enabled by admin or not
   * @param suspended Flag if user has been suspended by admin or not
   */
  constructor(
    public username: string,
    public password: string,
    public type: Usergroup,
    public enabled: boolean,
    public suspended: boolean = false,
  ) {
  }

}
