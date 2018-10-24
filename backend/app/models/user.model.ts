import {Table, Column, Model, PrimaryKey} from 'sequelize-typescript';
import {Usergroup} from '../enums/usergroup.enum';

@Table
export class User extends Model<User> {

  bcrypt = require('bcrypt');
  saltRounds = 10;

  @PrimaryKey @Column
  username!: string;

  @Column
  password!: string;

  @Column
  type!: Usergroup;

  @Column
  enabled!: boolean;

  authentify(passwordClear: string): boolean {
    return this.bcrypt.compareSync(passwordClear, this.password);

  }
  setPassword(passwordClear: string) {
    this.password = this.bcrypt.hashSync(passwordClear, this.saltRounds);
  }
  enable() {
    this.enabled = true;
  }

  toSimplification(): any {
    return {
      'username': this.username,
      'type': this.type,
      'enabled': this.enabled,
    };
  }

  fromSimplification(simplification: any): void {
    this.username = simplification['username'];
    this.setPassword(simplification['password']);
    this.type = simplification['type'];
    this.enabled = simplification['enabled'];
  }

}
