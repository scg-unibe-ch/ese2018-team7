import {Table, Column, Model, HasMany, DataType} from 'sequelize-typescript';
import {Skill} from './skill.model';

@Table
export class Job extends Model<Job> {

  @Column
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @HasMany(() => Skill)
  skills!: Skill[];

  toSimplification(): any {
    return {
      'id': this.id,
      'title': this.title,
      'description': this.description,
    };
  }

  fromSimplification(simplification: any): void {
    this.title = simplification['title'];
    this.description = simplification['description'];
  }

}
