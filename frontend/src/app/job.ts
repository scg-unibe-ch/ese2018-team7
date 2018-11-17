import {Moment} from 'moment';
import * as moment from 'moment';
import {Skill} from './skill';
import {Company} from './company';
import {Salary} from './salary';

export class Job {

  constructor(
    public id: number = null,
    public title: string = '',
    public department: string = '',
    public placeOfWork: string = '',
    public contractType: string = 'unlimited',
    public startOfWork: Moment = moment().startOf('day'),
    public endOfWork: Moment = moment(0),
    public workload: number = 100,
    public salary: Salary = new Salary(),
    public shortDescription: string = '',
    public description: string = '',
    public skills: Skill[] = [],
    public phone: string = '',
    public email: string = '',
    public website: string = '',
    public contactInfo: string = '',
    public company: Company = new Company (),
    public startOfPublication: Moment = moment(),
    public endOfPublication: Moment = moment().add(3, 'M'),
    public approved: boolean = true,
    public changed: boolean = false,
  ) {
  }

}
