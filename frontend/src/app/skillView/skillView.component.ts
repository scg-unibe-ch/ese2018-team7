import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Skill} from '../skill';

@Component({
  selector: 'app-skill-view',
  templateUrl: './skillView.component.html',
  styleUrls: ['./skillView.component.css']
})
/**
 * Component to display a Skill
 */
export class SkillViewComponent implements OnInit {

  @Input()
  skill: Skill;
  @Output()
  destroy = new EventEmitter<Skill>();

  constructor() {
  }

  ngOnInit() {
  }

}
