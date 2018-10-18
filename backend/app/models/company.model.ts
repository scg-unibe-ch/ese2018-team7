import {Table, Column, Model, PrimaryKey, DataType} from 'sequelize-typescript';

@Table
export class Company extends Model<Company> {

  @PrimaryKey @Column
  username!: string;

  @Column
  name!: string;

  @Column(DataType.TEXT)
  logo!: string;

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
  }

}
