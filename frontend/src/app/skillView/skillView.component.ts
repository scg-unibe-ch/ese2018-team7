import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Skill} from '../skill';
import {HttpClient, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-skill-view',
  templateUrl: './skillView.component.html',
  styleUrls: ['./skillView.component.css']
})
export class SkillViewComponent implements OnInit {

  @Input()
  skill: Skill;
  @Output()
  destroy = new EventEmitter<Skill>();

  constructor(private httpClient: HttpClient) {

  }

  ngOnInit() {
  }

}
