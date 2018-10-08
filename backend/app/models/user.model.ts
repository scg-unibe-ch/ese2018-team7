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

  toSimplification(): any {
    return {
      'id': this.id,
      'username': this.username,
      'type': this.type,
    };
  }

  fromSimplification(simplification: any): void {
    this.username = simplification['username'];
    this.password = this.bcrypt.hashSync(simplification['password'], this.saltRounds);
    this.type = simplification['type'];
  }

}
