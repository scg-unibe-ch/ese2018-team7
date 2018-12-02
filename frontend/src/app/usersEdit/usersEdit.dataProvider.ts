import {DataSource} from '@angular/cdk/table';
import {Observable, of} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';

import {UsersEdit} from './usersEdit.interface';

/**
 * Data provider for the data table in the `UsersEditComponent`
 */
export class UsersEditDataProvider extends DataSource<UsersEdit> {

  /**
   * Create a new instance of this dataProvider with the given parameters
   * @param data
   * @param filter
   */
  constructor(private data: UsersEdit[], private filter: string) {
    super();
  }

  /**
   * Connect to the dataTable
   */
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

  /**
   * Disconnect from the dataTable
   * @param collectionViewer
   */
  disconnect(collectionViewer: CollectionViewer): void {
  }

}
