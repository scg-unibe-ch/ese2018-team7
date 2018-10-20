import {Moment} from 'moment';
import * as moment from 'moment';
import {Skill} from './skill';
import {Company} from './company';

export class Job {

  constructor(
    public id: number = null,
    public title: string = '',
    public departement: string = '',
    public placeofwork: string = '',
    public startofwork: Moment = moment(),
    public workload: number = 100,
    public description: string = '',
    public skills: Skill[] = [],
    public contactinfo: string = '',
    public company: Company = new Company (),
    public startofpublication: Moment = moment(),
    public endofpublication: Moment = moment().add(3, 'M'),
    public approved: boolean = true,
    public changed: boolean = false,
  ) {
  }

}
