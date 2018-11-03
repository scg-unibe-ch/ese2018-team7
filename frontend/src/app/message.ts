class Msg {
  constructor(public code: number, public message: string) {
  }
}
export class Message {
  public static error = {
    permissionDenied: new Msg(1000, 'Zugriff verweigert!'),
    notFound: new Msg(1001, 'Element nicht gefunden!'),
    permissionDeniedUserNotExist: new Msg(1002, 'Zugriff verweigert! - Benutzer existiert nicht'),
    permissionDeniedWrongPassword: new Msg(1003, 'Zugriff verweigert! - ungültiges Passwort'),
    permissionDeniedUserNotApproved: new Msg(1004, 'Zugriff verweigert! - Benutzer wurde noch nicht freigeschalten'),
    permissionDeniedUserSuspended: new Msg(1005, 'Zugriff verweigert! - Benutzer gesperrt!'),
    permissionDeniedSessionProblem: new Msg(1006, 'Zugriff verweigert! - Technisches Problem!'),
    userAlreadyExist: new Msg(1007, 'Benutzer existiert bereits!'),
    emptyUsernameNotAllowed: new Msg(1008, 'Leerer Benutzername ist nicht erlaubt!'),
    emptyPasswordNotAllowed: new Msg(1009, 'Leeres Passwort ist nicht erlaubt!'),
    permissionDeniedChangePasswordHigherLevel: new Msg(1010, 'Du bist nicht berechtigt das Passwort für diesen Benutzer zu ändern!'),

  };
  public static success = {
    success: new Msg(2000, 'Erfolgreich'),
    userLoggedOut: new Msg(2001, 'Erfolgreich abgemeldet'),
    userCreated: new Msg(2002, 'Benutzer erfolgreich erstellt'),
    userRegisteredNeedsApproval: new Msg(2003, 'Benutzer erfolgreich registiert, warte bis ein Moderator' +
      ' deinen Account freigeschalten hat!'),
  };

  public static getMessage(msgNummer: number) {
    const variables = ['error', 'success'];
    for (let i = 0; i < variables.length; ++i) {
      for (const tag in Message[variables[i]]) {
        if (Message[variables[i]][tag].code = msgNummer) {
          return Message[variables[i]][tag].message;
        }
      }
    }

    return 'Unbekannter Fehler!';
  }
}


