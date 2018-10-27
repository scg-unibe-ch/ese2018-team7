import {Table, Column, Model, PrimaryKey, DataType, ForeignKey, BelongsTo} from 'sequelize-typescript';
import {User} from './user.model';

@Table
export class Company extends Model<Company> {

  @ForeignKey(() => User)
  @PrimaryKey
  @Column
  username!: string;

  @BelongsTo(() => User)
  user!: User;

  @Column
  name!: string;

  @Column(DataType.TEXT)
  logo!: string;

  @Column(DataType.TEXT)
  changes!: string;


  addChanges(change: any) {

    const company: Company = new Company();
    let c: string;

    try {
      c = JSON.parse(company.changes);
    } catch (e) {
      c = '';
    }

    company.createCompany(c);
    company.createCompany(change);

    this.changes = company.changes;

  }

  applyChanges() {

    let c: string;

    try {
      c = JSON.parse(this.changes);
    } catch (e) {
      c = '';
    }

    this.createCompany(c);

  }

  forEdit(): any {

    const changes = JSON.parse(this.changes);
    const unapprovedChanges = changes.name !== this.name || changes.logo !== this.logo;

    this.applyChanges();

    return {
      'username': this.username,
      'name': this.name,
      'logo': this.logo,
      'unapprovedChanges': unapprovedChanges
    };

  }

  getJSONforChange(): any {
    return JSON.stringify({
      'username': this.username,
      'name': this.name,
      'logo': this.logo,
    });
  }


  createCompany(data: any): void {
    if (data['username'] != null) {
      this.username = data['username'];
    }
    if (data['name'] != null) {
      this.name = data['name'];
    }
    if (data['logo'] != null) {
      this.logo = data['logo'];
    }

    this.changes = this.getJSONforChange();

  }

}
