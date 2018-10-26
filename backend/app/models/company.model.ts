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

  setChanges(change: any) {
    const company: Company = new Company();
    let c: string;
    try {
      c = JSON.parse(company.changes);
    } catch (e) {
      c = '';
    }
    company.fromSimplification(c);
    company.fromSimplification(change);

    this.changes = JSON.stringify(company.toSimplification());
  }
  applyChanges() {
    let c: string;
    try {
      c = JSON.parse(this.changes);
    } catch (e) {
      c = '';
    }
    this.fromSimplification(c);
    this.changes = JSON.stringify(this.toSimplification());
  }

  forEdit(): any {
    const changes = JSON.parse(this.changes);
    const unapprovedchanges = changes.name !== this.name || changes.logo !== this.logo;

    this.applyChanges();

    return {
      'username': this.username,
      'name': this.name,
      'logo': this.logo,
      'unapprovedchanges': unapprovedchanges
    };
  }

  toSimplification(): any {
    return {
      'username': this.username,
      'name': this.name,
      'logo': this.logo,
    };
  }


  fromSimplification(simplification: any): void {
    this.username = simplification['username'];
    this.name = simplification['name'];
    if (simplification['logo'] != null) {
      this.logo = simplification['logo'];
    }
    this.changes = '';
    this.changes = JSON.stringify(this);
  }

}
