import {DataSource} from '@angular/cdk/table';
import {UsersEdit} from './usersEdit.interface';
import {Observable} from 'rxjs';
import {of} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';

export class UsersEditDataProvider extends DataSource<UsersEdit> {

  constructor(private data: UsersEdit[]) {
    super();
  }

  connect(): Observable<UsersEdit[]> {
    return of(this.data);
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }
}
