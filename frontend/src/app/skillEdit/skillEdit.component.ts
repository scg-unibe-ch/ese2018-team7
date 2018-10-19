import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Skill} from '../skill';
import {HttpClient} from '@angular/common/http';
import {JobEditComponent} from '../jobEdit/jobEdit.component';

@Component({
  selector: 'app-skill-edit',
  templateUrl: './skillEdit.component.html',
  styleUrls: ['./skillEdit.component.css']
})
/**
 * This Components displays one Skill to edit it
 */
export class SkillEditComponent implements OnInit {

  @Input()
  skill: Skill;
  @Output()
  destroy = new EventEmitter<Skill>();

  constructor(private httpClient: HttpClient, @Inject(JobEditComponent) private job: JobEditComponent) {
  }

  ngOnInit() {
  }

  /**
   * Save the changed on the server
   */
  onSave() {
    this.httpClient.put('http://localhost:3000/skills/' + this.skill.id, {
      'name': this.skill.name, 'jobId': this.skill.jobId
    }, {withCredentials: true}).subscribe();

    this.job.onSave();
  }

  /**
   * Delete this skill
   */
  onDestroy() {
    this.httpClient.delete('http://localhost:3000/skills/' + this.skill.id, {withCredentials: true}).subscribe(() => {
      this.job.onSave();
      this.destroy.emit(this.skill);
    });
  }

}
