import {Table, Column, Model, DataType, ForeignKey, BelongsTo} from 'sequelize-typescript';
import {User} from './user.model';
import {Company} from './company.model';

@Table
export class Job extends Model<Job> {

  @Column
  title!: string;

  @Column
  department!: string;

  @Column
  placeOfWork!: string;

  @Column
  contractType!: string;

  @Column
  startOfWork!: number;

  @Column
  endOfWork!: number;

  @Column(DataType.INTEGER)
  workload!: number;

  @Column
  shortDescription!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column
  phone!: string;

  @Column
  email!: string;

  @Column(DataType.TEXT)
  contactInfo!: string;

  @Column
  startOfPublication!: number;

  @Column
  endOfPublication!: number;

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
      c.createCompany({'username': this.owner, 'name': '', 'logo': ''});
      this.user.company.push(c);

    }

    return {
      'id': this.id,
      'title': this.title,
      'department': this.department,
      'placeOfWork': this.placeOfWork,
      'contractType': this.contractType,
      'startOfWork': this.startOfWork,
      'endOfWork': this.endOfWork,
      'workload': this.workload,
      'shortDescription': this.shortDescription,
      'description': this.description,
      'skills': this.skills,
      'email': this.email,
      'phone': this.phone,
      'contactInfo': this.contactInfo,
      'startOfPublication': this.startOfPublication,
      'endOfPublication': this.endOfPublication,
      'approved': this.approved,
      'companyName': this.user.company[0].name,
      'companyLogo': this.user.company[0].logo,
    };

  }

  getSimpleJob(): any {

    return {
      'id': this.id,
      'title': this.title,
      'department': this.department,
      'placeOfWork': this.placeOfWork,
      'contractType': this.contractType,
      'startOfWork': this.startOfWork,
      'endOfWork': this.endOfWork,
      'workload': this.workload,
      'shortDescription': this.shortDescription,
      'description': this.description,
      'skills': this.skills,
      'email': this.email,
      'phone': this.phone,
      'contactInfo': this.contactInfo,
      'startOfPublication': this.startOfPublication,
      'endOfPublication': this.endOfPublication,
      'approved': this.approved,
    };

  }
  getJobWithAdditionalDetails(): any {
    console.log(this.changes);
    console.log(this.getJSONforChange());
    return {
      'id': this.id,
      'title': this.title,
      'department': this.department,
      'placeOfWork': this.placeOfWork,
      'contractType': this.contractType,
      'startOfWork': this.startOfWork,
      'endOfWork': this.endOfWork,
      'workload': this.workload,
      'shortDescription': this.shortDescription,
      'description': this.description,
      'skills': this.skills,
      'email': this.email,
      'phone': this.phone,
      'contactInfo': this.contactInfo,
      'startOfPublication': this.startOfPublication,
      'endOfPublication': this.endOfPublication,
      'approved': this.approved,
      'changed': this.changes !== this.getJSONforChange(),
    };

  }

  getJSONforChange() {
    return JSON.stringify({
      'title': this.title,
      'department': this.department,
      'placeOfWork': this.placeOfWork,
      'contractType': this.contractType,
      'startOfWork': this.startOfWork,
      'endOfWork': this.endOfWork,
      'workload': this.workload,
      'shortDescription': this.shortDescription,
      'description': this.description,
      'skills': this.skills,
      'email': this.email,
      'phone': this.phone,
      'contactInfo': this.contactInfo,
      'startOfPublication': this.startOfPublication,
      'endOfPublication': this.endOfPublication,
      'approved': this.approved,
    });
  }

  addChanges(change: any) {

    const job: Job = new Job();
    let c: string;

    try {
      c = JSON.parse(job.changes);
    } catch (e) {
      c = '';
    }

    job.createJob(c);
    job.createJob(change);

    this.changes = job.getJSONforChange();

  }

  applyChanges() {

    let c: string;

    try {
      c = JSON.parse(this.changes);
    } catch (e) {
      c = '';
    }

    this.createJob(c);

  }


  createJob(simplification: any): void {

    if (simplification != null) {

      if (simplification['title'] != null) {
        this.title = simplification['title'];
      }

      if (simplification['department'] != null) {
        this.department = simplification['department'];
      }

      if (simplification['placeOfWork'] != null) {
        this.placeOfWork = simplification['placeOfWork'];
      }

      if (simplification['contractType'] != null) {
        this.contractType = simplification['contractType'];
      }

      if (simplification['startOfWork'] != null) {
        this.startOfWork = simplification['startOfWork'];
      }

      if (simplification['endOfWork'] != null) {
        this.endOfWork = simplification['endOfWork'];
      } else {
        console.error('End of work is undefined');
      }

      if (simplification['workload'] != null) {
        this.workload = simplification['workload'];
      }

      if (simplification['shortDescription'] != null) {
        this.shortDescription = simplification['shortDescription'];
      }

      if (simplification['description'] != null) {
        this.description = simplification['description'];
      }

      if (simplification['skills'] != null) {
        this.skills = simplification['skills'];
      }

      if (simplification['email'] != null) {
        this.email = simplification['email'];
      }

      if (simplification['phone'] != null) {
        this.phone = simplification['phone'];
      }

      if (simplification['contactInfo'] != null) {
        this.contactInfo = simplification['contactInfo'];
      }

      if (simplification['startOfPublication'] != null) {
        this.startOfPublication = simplification['startOfPublication'];
      }

      if (simplification['endOfPublication'] != null) {
        this.endOfPublication = simplification['endOfPublication'];
      }

      if (simplification['owner'] != null) {
        this.owner = simplification['owner'];
      }

      if (simplification['approved'] != null) {
        this.approved = simplification['approved'];
      }

      this.changes = this.getJSONforChange();

    }

  }

}
