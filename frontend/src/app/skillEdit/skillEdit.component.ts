import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Skill} from '../skill';
import {HttpClient} from '@angular/common/http';

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

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
  }

  /**
   * Save the changes on the server
   */
  onSave() {
    this.httpClient.put('http://localhost:3000/skills/' + this.skill.id, {
      'name': this.skill.name, 'jobId': this.skill.jobId
    }, {withCredentials: true}).subscribe();
  }

  /**
   * Delete this skill
   */
  onDestroy() {
    this.httpClient.delete('http://localhost:3000/skills/' + this.skill.id, {withCredentials: true}).subscribe(() => {
      this.destroy.emit(this.skill);
    });
  }

}
