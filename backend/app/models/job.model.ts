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

  @Column(DataType.TEXT)
  salary!: string;

  @Column
  shortDescription!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column
  phone!: string;

  @Column
  email!: string;

  @Column(DataType.TEXT)
  website!: string;

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


  /**
   * @swagger
   *
   * definitions:
   *   getJobWithCompanyData:
   *     type: object
   *     properties:
   *       id:
   *         type: integer
   *       title:
   *         type: string
   *       department:
   *         type: string
   *       placeOfWork:
   *         type: string
   *       contractType:
   *         type: string
   *       startOfWork:
   *         type: integer
   *         format: timestamp
   *       endOfWork:
   *         type: integer
   *         format: timestamp
   *         description: 0 if contractType is unlimited
   *       workload:
   *         type: integer
   *       salary:
   *         type: object
   *         properties:
   *           amount:
   *             type: integer
   *           period:
   *             type: string
   *             description: month, hour, job or other
   *       shortDescription:
   *         type: string
   *       description:
   *         type: string
   *         description: Markdown text
   *       skills:
   *         type: array
   *         items:
   *           type: object
   *           properties:
   *             name:
   *               type: string
   *       phone:
   *         type: string
   *         description: formatted phone number
   *       email:
   *         type: string
   *       website:
   *         type: string
   *       contactInfo:
   *         type: string
   *       startOfPublication:
   *         type: integer
   *         format: timestamp
   *       endOfPublication:
   *         type: integer
   *         format: timestamp
   *       approved:
   *         type: boolean
   *       companyName:
   *         type: string
   *       companyLogo:
   *         type: string
   *         format: base64
   */
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
      'salary': this.salary,
      'shortDescription': this.shortDescription,
      'description': this.description,
      'skills': this.skills,
      'email': this.email,
      'phone': this.phone,
      'website': this.website,
      'contactInfo': this.contactInfo,
      'startOfPublication': this.startOfPublication,
      'endOfPublication': this.endOfPublication,
      'approved': this.approved,
      'companyName': this.user.company[0].name,
      'companyLogo': this.user.company[0].logo,
    };

  }


  /**
   * @swagger
   *
   * definitions:
   *   getJobForEdit:
   *     type: object
   *     properties:
   *       id:
   *         type: integer
   *       title:
   *         type: string
   *       department:
   *         type: string
   *       placeOfWork:
   *         type: string
   *       contractType:
   *         type: string
   *       startOfWork:
   *         type: integer
   *         format: timestamp
   *       endOfWork:
   *         type: integer
   *         format: timestamp
   *         description: 0 if contractType is unlimited
   *       workload:
   *         type: integer
   *       salary:
   *         type: object
   *         properties:
   *           amount:
   *             type: integer
   *           period:
   *             type: string
   *             description: month, hour, job or other
   *       shortDescription:
   *         type: string
   *       description:
   *         type: string
   *         description: Markdown text
   *       skills:
   *         type: array
   *         items:
   *           type: object
   *           properties:
   *             name:
   *               type: string
   *       phone:
   *         type: string
   *         description: formatted phone number
   *       email:
   *         type: string
   *       website:
   *         type: string
   *       contactInfo:
   *         type: string
   *       startOfPublication:
   *         type: integer
   *         format: timestamp
   *       endOfPublication:
   *         type: integer
   *         format: timestamp
   *       approved:
   *         type: boolean
   *       companyName:
   *         type: string
   *       companyLogo:
   *         type: string
   *         format: base64
   *       changed:
   *         type: boolean
   */
  getJobForEdit(): any {
    const oldJson: string = this.getJSONForChange();
    this.applyChanges();
    return {
      'id': this.id,
      'title': this.title,
      'department': this.department,
      'placeOfWork': this.placeOfWork,
      'contractType': this.contractType,
      'startOfWork': this.startOfWork,
      'endOfWork': this.endOfWork,
      'workload': this.workload,
      'salary': this.salary,
      'shortDescription': this.shortDescription,
      'description': this.description,
      'skills': this.skills,
      'email': this.email,
      'phone': this.phone,
      'website': this.website,
      'contactInfo': this.contactInfo,
      'startOfPublication': this.startOfPublication,
      'endOfPublication': this.endOfPublication,
      'approved': this.approved,
      'companyName': this.user.company[0].name,
      'companyLogo': this.user.company[0].logo,
      'changed': oldJson !== this.getJSONForChange(),
    };
  }

  getJSONForChange() {
    return JSON.stringify({
      'title': this.title,
      'department': this.department,
      'placeOfWork': this.placeOfWork,
      'contractType': this.contractType,
      'startOfWork': this.startOfWork,
      'endOfWork': this.endOfWork,
      'workload': this.workload,
      'salary': this.salary,
      'shortDescription': this.shortDescription,
      'description': this.description,
      'skills': this.skills,
      'email': this.email,
      'phone': this.phone,
      'website': this.website,
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
      c = JSON.parse(this.changes);
    } catch (e) {
      c = '';
    }

    job.createJob(c);
    job.createJob(change);

    this.changes = job.getJSONForChange();

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
      } else if (this.title == null) {
        this.title = '';
      }

      if (simplification['department'] != null) {
        this.department = simplification['department'];
      } else if (this.department == null) {
        this.department = '';
      }

      if (simplification['placeOfWork'] != null) {
        this.placeOfWork = simplification['placeOfWork'];
      } else if (this.placeOfWork == null) {
        this.placeOfWork = '';
      }

      if (simplification['contractType'] != null) {
        this.contractType = simplification['contractType'];
      } else if (this.contractType == null) {
        this.contractType = 'unlimited';
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
        this.workload = (typeof simplification['workload'] === 'string') ? Number(simplification['workload']) : simplification['workload'];
      }

      if (simplification['salary'] != null) {
        this.salary = simplification['salary'];
      } else if (this.salary == null) {
        this.salary = '{"amount":-1, "period":"month"}';
      }

      if (simplification['shortDescription'] != null) {
        this.shortDescription = simplification['shortDescription'];
      } else if (this.shortDescription == null) {
        this.shortDescription = '';
      }

      if (simplification['description'] != null) {
        this.description = simplification['description'];
      } else if (this.description == null) {
        this.description = '';
      }

      if (simplification['skills'] != null) {
        this.skills = simplification['skills'];
      } else if (this.skills == null) {
        this.skills = '[]';
      }

      if (simplification['email'] != null) {
        this.email = simplification['email'];
      } else if (this.email == null) {
        this.email = '';
      }

      if (simplification['phone'] != null) {
        this.phone = simplification['phone'];
      } else if (this.phone == null) {
        this.phone = '';
      }

      if (simplification['website'] != null) {
        this.website = simplification['website'];
      } else if (this.website == null) {
        this.website = '';
      }

      if (simplification['contactInfo'] != null) {
        this.contactInfo = simplification['contactInfo'];
      } else if (this.contactInfo == null) {
        this.contactInfo = '';
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

      this.changes = this.getJSONForChange();

    }

  }

}
