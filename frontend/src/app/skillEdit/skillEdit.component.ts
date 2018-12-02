import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';

import {Skill} from '../skill';
import {JobEditComponent} from '../jobEdit/jobEdit.component';

/**
 * Component to display one skill in an editable format (edit mode).
 */
@Component({
  selector: 'app-skill-edit',
  templateUrl: './skillEdit.component.html',
  styleUrls: ['./skillEdit.component.css']
})

export class SkillEditComponent implements OnInit {

  /**
   * Skill that should be edited
   */
  @Input()
  skill: Skill;

  /**
   * Simple EventEmitter to delete the component
   */
  @Output()
  destroy = new EventEmitter<Skill>();

  /**
   * Injects the skillEdit into the JobEditComponent of a specific job
   * @param job Job that the skill belongs to
   */
  constructor(@Inject(JobEditComponent) private job: JobEditComponent) {
  }

  /**
   * @ignore
   */
  ngOnInit() {
  }

  /**
   * Save the changed skill on the server
   */
  onSave() {
    this.job.onSaveSkills();
  }

  /**
   * Delete this skill
   */
  onDestroy() {
    this.job.onSkillDestroy(this.skill);
  }

}
