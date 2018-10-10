import {Table, Column, Model, PrimaryKey} from 'sequelize-typescript';

@Table
export class User extends Model<User> {

  bcrypt = require('bcrypt');
  saltRounds = 10;

  @PrimaryKey @Column
  username!: string;

  @Column
  password!: string;

  @Column
  type!: number;

  authentify(passwordClear: string): boolean {
    return this.bcrypt.compareSync(passwordClear, this.password);

  }
  setPassword(passwordClear: string) {
    this.password = this.bcrypt.hashSync(passwordClear, this.saltRounds);
  }

  toSimplification(): any {
    return {
      'id': this.id,
      'username': this.username,
      'type': this.type,
    };
  }

  fromSimplification(simplification: any): void {
    this.username = simplification['username'];
    this.setPassword(simplification['password']);
    this.type = simplification['type'];
  }

}
