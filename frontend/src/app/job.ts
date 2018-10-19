import {Moment} from 'moment';
import * as moment from 'moment';

export class Job {

  constructor(
    public id: number = null,
    public title: string = '',
    public company: string = '',
    public placeofwork: string = '',
    public startofwork: Moment = moment(),
    public workload: number = 100,
    public description: string = '',
    public contactinfo: string = '',
    public startofpublication: Moment = moment(),
    public endofpublication: Moment = moment().add(3, 'M'),
    public approved: boolean = true,
    public changed: boolean = false,
  ) {
  }

}
