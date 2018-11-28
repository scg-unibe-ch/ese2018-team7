import {Table, Column, Model, PrimaryKey, HasMany} from 'sequelize-typescript';
import {Usergroup} from '../enums/usergroup.enum';
import {Job} from './job.model';
import {Company} from './company.model';

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

  @Column({defaultValue: false})
  suspended!: boolean;

  @HasMany(() => Job)
  jobs!: Job[];

  @HasMany(() => Company)
  company!: Company[];



  authenticate(passwordClear: string): boolean {
    return this.bcrypt.compareSync(passwordClear, this.password);
  }

  setPassword(passwordClear: string) {
    this.password = this.bcrypt.hashSync(passwordClear, this.saltRounds);
  }

  getAdminEditDetails(): any {

    let unapprovedChanges = false;

    if (this.company.length === 0) {

      const c: Company = new Company();
      c.createCompany({'username': this.username, 'name': '', 'email': '', 'logo': ''});
      this.company.push(c);

    } else {

      unapprovedChanges = this.company[0].changes !== this.company[0].getJSONforChange();

      this.company[0].applyChanges();

    }

    return {
      'username': this.username,
      'type': this.type,
      'enabled': this.enabled,
      'suspended': this.suspended,
      'companyName': this.company[0].name,
      'companyEmail': this.company[0].email,
      'companyLogo': this.company[0].logo,
      'companyUnapprovedChanges': unapprovedChanges,
    };

  }

  createUser(data: any): void {
    if (data['username'] != null) {
      this.username = data['username'];
    }

    if (data['password'] != null) {
      this.setPassword(data['password']);
    }

    if (data['type'] != null) {
      this.type = data['type'];
    }

    if (data['enabled'] != null) {
      this.enabled = data['enabled'];
    }

  }

}
