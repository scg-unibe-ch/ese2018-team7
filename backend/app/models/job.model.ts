import {Table, Column, Model, HasMany, DataType, ForeignKey} from 'sequelize-typescript';
import {Skill} from './skill.model';
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

  @Column
  approved!: boolean;

  @HasMany(() => Skill)
  skills!: Skill[];

  @ForeignKey(() => User) @Column
  owner!: String;

  toSimplification(): any {
    return {
      'id': this.id,
      'title': this.title,
      'company': this.company,
      'placeofwork': this.placeofwork,
      'startofwork': this.startofwork,
      'workload': this.workload,
      'description': this.description,
      'approved': this.approved,
    };
  }

  fromSimplification(simplification: any): void {
    this.title = simplification['title'];
    this.company = simplification['company'];
    this.placeofwork = simplification['placeofwork'];
    this.startofwork = simplification['startofwork'];
    this.workload = simplification['workload'];
    this.description = simplification['description'];
    if (simplification['owner'] != null) {
      this.owner = simplification['owner'];
    }
    if (simplification['approved'] != null) {
      this.approved = simplification['approved'];
    }
  }

}
