import {Table, Column, Model, DataType, ForeignKey} from 'sequelize-typescript';
import {User} from './user.model';

@Table
export class Job extends Model<Job> {

  @Column
  title!: string;

  @Column
  company!: string;

  @Column
  placeofwork!: string;

  @Column
  startofwork!: number;

  @Column(DataType.INTEGER)
  workload!: number;

  @Column(DataType.TEXT)
  description!: string;

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

  @ForeignKey(() => User) @Column
  owner!: string;

  @Column(DataType.TEXT)
  changes!: string;

  toSimplification(): any {
    return {
      'id': this.id,
      'title': this.title,
      'company': this.company,
      'placeofwork': this.placeofwork,
      'startofwork': this.startofwork,
      'workload': this.workload,
      'description': this.description,
      'skills': this.skills,
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
      this.company = simplification['company'];
      this.placeofwork = simplification['placeofwork'];
      this.startofwork = simplification['startofwork'];
      this.workload = simplification['workload'];
      this.description = simplification['description'];
      this.skills = simplification['skills'];
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
