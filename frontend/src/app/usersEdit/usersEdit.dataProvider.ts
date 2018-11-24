import {DataSource} from '@angular/cdk/table';
import {UsersEdit} from './usersEdit.interface';
import {Observable} from 'rxjs';
import {of} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';

export class UsersEditDataProvider extends DataSource<UsersEdit> {

  constructor(private data: UsersEdit[], private filter: string) {
    super();
  }

  connect(): Observable<UsersEdit[]> {
    return of(this.data.sort((uEdit1, uEdit2) => {
      switch (this.filter) {
        case 'usernameASC':
          return (uEdit1.user.username < uEdit2.user.username ? -1 : 1);
        case 'usernameDESC':
          return (uEdit1.user.username > uEdit2.user.username ? -1 : 1);
        case 'usertypeASC':
          if (uEdit1.user.type === uEdit2.user.type) {
            return (uEdit1.user.username < uEdit2.user.username ? -1 : 1);
          }
          return (uEdit1.user.type < uEdit2.user.type ? -1 : 1);
        case 'usertypeDESC':
          if (uEdit1.user.type === uEdit2.user.type) {
            return (uEdit1.user.username > uEdit2.user.username ? -1 : 1);
          }
          return (uEdit1.user.type > uEdit2.user.type ? -1 : 1);
      }

      return 0;
    }));
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }
}
