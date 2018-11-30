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

  @Column
  email!: string;

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

    this.changes = company.getJSONForChange();

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

  /**
   * @swagger
   *
   * definitions:
   *   company:
   *     type: object
   *     properties:
   *       username:
   *         type: string
   *       name:
   *         type: string
   *       logo:
   *         type: string
   *         format: base64
   *       unapprovedChanges:
   *         type: boolean
   */
  forEdit(): any {

    const oldJSON: string = this.getJSONForChange();
    this.applyChanges();

    return {
      'username': this.username,
      'name': this.name,
      'email': this.email,
      'logo': this.logo,
      'unapprovedChanges': oldJSON !== this.getJSONForChange(),
    };

  }

  getJSONForChange(): any {
    return JSON.stringify({
      'username': this.username,
      'name': this.name,
      'email': this.email,
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
    if (data['email'] != null) {
      this.email = data['email'];
    }
    if (data['logo'] != null) {
      this.logo = data['logo'];
    }

    this.changes = this.getJSONForChange();

  }

}
