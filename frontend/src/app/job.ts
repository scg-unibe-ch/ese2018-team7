import * as moment from 'moment';
import {Moment} from 'moment';
import {Skill} from './skill';
import {Company} from './company';
import {Salary} from './salary';

/**
 * Frontend model for job postings
 */
export class Job {

  /**
   * Creates a new job object
   * @param id Unique identifier for every job
   * @param title Job title
   * @param department Department where you work
   * @param placeOfWork Place where you work
   * @param contractType Contract type, can be limited or unlimited
   * @param startOfWork First day of work, saved as moment
   * @param endOfWork Last day of work, saved as moment, only used if contractType is limited
   * @param workload Workload percentage
   * @param salary Salary saved as special salary object
   * @param shortDescription Short description of the job
   * @param description Long description of the job formatted with markdown syntax
   * @param skills Array of necessary skills saved as skill objects
   * @param phone Contact phone number
   * @param email Contact email address
   * @param website Website for further information
   * @param contactInfo Additional contact information
   * @param company Corresponding company object
   * @param startOfPublication Start of Publication, saved as moment
   * @param endOfPublication End of Publication, saved as moment
   * @param approved Flag to check if job has been approved
   * @param changed Flag to check if there are unapproved changes
   */
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
