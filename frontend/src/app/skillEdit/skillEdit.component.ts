import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Skill} from '../skill';
import {HttpClient, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-skill-edit',
  templateUrl: './skillEdit.component.html',
  styleUrls: ['./skillEdit.component.css']
})
export class SkillEditComponent implements OnInit {

  @Input()
  skill: Skill;
  @Output()
  destroy = new EventEmitter<Skill>();

  constructor(private httpClient: HttpClient) {

  }

  ngOnInit() {
  }

  onSave() {
    this.httpClient.put('http://localhost:3000/skillEdit/' + this.skill.id, {
      'name': this.skill.name, 'jobId': this.skill.jobId
    }).subscribe();
  }

  onDestroy() {
    this.httpClient.delete('http://localhost:3000/skillEdit/' + this.skill.id).subscribe(() => {
      this.destroy.emit(this.skill);
    });
  }

}
