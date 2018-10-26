import {Table, Column, Model, DataType, ForeignKey, BelongsTo} from 'sequelize-typescript';
import {User} from './user.model';
import {Company} from './company.model';

@Table
export class Job extends Model<Job> {

  @Column
  title!: string;

  @Column
  departement!: string;

  @Column
  placeofwork!: string;

  @Column
  startofwork!: number;

  @Column(DataType.INTEGER)
  workload!: number;

  @Column(DataType.TEXT)
  description!: string;

  @Column
  phone!: string;

  @Column
  email!: string;

  @Column(DataType.TEXT)
  contactinfo!: string;

  @Column
  startofpublication!: number;

  @Column
  endofpublication!: number;

  @Column
  approved!: boolean;

  @Column(DataType.TEXT)
  skills!: string;

  @ForeignKey(() => User)
  @Column
  owner!: string;

  @BelongsTo(() => User)
  user!: User;

  @Column(DataType.TEXT)
  changes!: string;

  getWithCompanyData(): any {

    if (this.user.company.length === 0) {
      const c: Company = new Company();
      c.fromSimplification({'username': this.owner, 'name': '', 'logo': ''});
      this.user.company.push(c);
    }

    return {
      'id': this.id,
      'title': this.title,
      'departement': this.departement,
      'placeofwork': this.placeofwork,
      'startofwork': this.startofwork,
      'workload': this.workload,
      'description': this.description,
      'skills': this.skills,
      'email': this.email,
      'phone': this.phone,
      'contactinfo': this.contactinfo,
      'startofpublication': this.startofpublication,
      'endofpublication': this.endofpublication,
      'approved': this.approved,
      'companyName': this.user.company[0].name,
      'companyLogo': this.user.company[0].logo,
    };
  }
  toSimplification(): any {
    return {
      'id': this.id,
      'title': this.title,
      'departement': this.departement,
      'placeofwork': this.placeofwork,
      'startofwork': this.startofwork,
      'workload': this.workload,
      'description': this.description,
      'skills': this.skills,
      'email': this.email,
      'phone': this.phone,
      'contactinfo': this.contactinfo,
      'startofpublication': this.startofpublication,
      'endofpublication': this.endofpublication,
      'approved': this.approved,
    };
  }
  setChanges(change: any) {
    const job: Job = new Job();
    let c: string;
    try {
      c = JSON.parse(job.changes);
    } catch (e) {
      c = '';
    }
    job.fromSimplification(c);
    job.fromSimplification(change);

    this.changes = JSON.stringify(job.toSimplification());
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
  fromSimplification(simplification: any): void {
    if (simplification != null) {
      if (simplification['title'] != null) {
        this.title = simplification['title'];
      }
      this.departement = simplification['departement'];
      this.placeofwork = simplification['placeofwork'];
      this.startofwork = simplification['startofwork'];
      this.workload = simplification['workload'];
      this.description = simplification['description'];
      this.skills = simplification['skills'];
      this.email = simplification['email'];
      this.phone = simplification['phone'];
      this.contactinfo = simplification['contactinfo'];
      this.startofpublication = simplification['startofpublication'];
      this.endofpublication = simplification['endofpublication'];
      if (simplification['owner'] != null) {
        this.owner = simplification['owner'];
      }
      if (simplification['approved'] != null) {
        this.approved = simplification['approved'];
      }
      this.changes = '';
    }

  }

}
