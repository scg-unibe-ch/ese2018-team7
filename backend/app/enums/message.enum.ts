
/**
 * @swagger
 *
 * definitions:
 *   message:
 *     type: object
 *     properties:
 *       code:
 *         type: integer
 *       message:
 *         type: string
 *
 */
class Msg {
  constructor(public code: number, public message: string) {
  }
}
export class Message {
  public static error = {
    permissionDenied: new Msg(1000, 'Permission denied'),
    notFound: new Msg(1001, 'not found!'),
    permissionDeniedUserNotExist: new Msg(1002, 'Permission denied! - user doesn\'t exists'),
    permissionDeniedWrongPassword: new Msg(1003, 'Permission denied! - Wrong Username / Password'),
    permissionDeniedUserNotApproved: new Msg(1004, 'Permission denied! - User not approved by administrator!'),
    permissionDeniedUserSuspended: new Msg(1005, 'Permission denied! - User suspended!'),
    permissionDeniedSessionProblem: new Msg(1006, 'Permission denied! - Problem creating session!'),
    userAlreadyExist: new Msg(1007, 'User already exists!'),
    emptyUsernameNotAllowed: new Msg(1008, 'Empty Username is not allowed!'),
    emptyPasswordNotAllowed: new Msg(1009, 'Empty Password is not allowed!'),
    permissionDeniedChangePasswordHigherLevel: new Msg(1010, 'You\'re not allowed to change password of a higher Level'),
    emptyMailNotAllowed: new Msg(1011, 'Empty Mail is not allowed!'),

  };
  public static success = {
    success: new Msg(2000, 'success'),
    userLoggedOut: new Msg(2001, 'logged out successfully'),
    userCreated: new Msg(2002, 'User created successfully'),
    userRegisteredNeedsApproval: new Msg(2003, 'User registered, wait until a moderator approved your account'),
  };
}


