import {Table, Column, Model, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {Job} from './job.model';

@Table
export class Skill extends Model<Skill> {

  @Column
  name!: string;

  @ForeignKey(() => Job)
  @Column
  jobId!: number;

  @BelongsTo(() => Job)
  job!: Job;


  toSimplification(): any {
    return {
      'id': this.id,
      'jobId': this.jobId,
      'name': this.name,
    };
  }

  fromSimplification(simplification: any): void {
    this.name = simplification['name'];
    this.jobId = simplification['jobId'];
  }

}
