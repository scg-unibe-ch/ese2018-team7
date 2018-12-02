import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Skill} from '../skill';

/**
 * Component to display one skill in a view format (view mode).
 */
@Component({
  selector: 'app-skill-view',
  templateUrl: './skillView.component.html',
  styleUrls: ['./skillView.component.css']
})

export class SkillViewComponent implements OnInit {

  /**
   * Skill that should be displayed
   */
  @Input()
  skill: Skill;

  /**
   * Simple EventEmitter to destroy this component
   */
  @Output()
  destroy = new EventEmitter<Skill>();

  /**
   * @ignore
   */
  constructor() {
  }

  /**
   * @ignore
   */
  ngOnInit() {
  }

}
