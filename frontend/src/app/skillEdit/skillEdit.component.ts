import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Skill} from '../skill';
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

  constructor(@Inject(JobEditComponent) private job: JobEditComponent) {
  }

  ngOnInit() {
  }

  /**
   * Save the changed on the server
   */
  onSave() {
    this.job.onSave();
  }

  /**
   * Delete this skill
   */
  onDestroy() {
    this.job.onSkillDestroy(this.skill);
  }

}
