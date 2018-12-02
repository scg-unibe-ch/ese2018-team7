import {User} from '../user';
import {Company} from '../company';

/**
 * User-Company interface which is used in the `usersEditDataProvider`
 */
export interface UsersEdit {

  /**
   * User
   */
  user: User;

  /**
   * Company which belongs to the user
   */
  company: Company;
}
