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

  getJobCount(): number {
    console.log('length of job array:' + this.jobs.length);
    return this.jobs.length;
  }

  getAdminEditDetails(): any {

    let unapprovedChanges = false;

    if (this.company.length === 0) {

      const c: Company = new Company();
      c.createCompany({'username': this.username, 'name': '', 'logo': ''});
      this.company.push(c);

    } else {

      const companyChanges = JSON.parse(this.company[0].changes);
      unapprovedChanges = companyChanges.name !== this.company[0].name || companyChanges.logo !== this.company[0].logo;

      this.company[0].applyChanges();

    }

    return {
      'username': this.username,
      'type': this.type,
      'enabled': this.enabled,
      'suspended': this.suspended,
      'companyName': this.company[0].name,
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
