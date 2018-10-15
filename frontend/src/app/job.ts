import {Moment} from 'moment';

export class Job {

  constructor(
    public id: number,
    public title: string,
    public company: string,
    public placeofwork: string,
    public startofwork: Moment,
    public workload: number,
    public description: string,
    public approved: boolean,
  ) {
  }

}
