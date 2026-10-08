import { Component, OnInit } from '@angular/core';
import { LessonsService } from '../shared/services/lessons.service';
import { Lesson } from '../shared/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user = { name: 'Learner', level: 5, xp: 420, xpNeeded: 500 };
  lessons: Lesson[] = [];

  features = [
    { title: 'Lessons', desc: 'DepEd-aligned Science & Math', icon: 'book', route: '/lessons', color: 'primary' },
    { title: 'Quizzes', desc: 'Earn points & badges', icon: 'trophy', route: '/quizzes', color: 'secondary' },
  ];

  constructor(private lessonsService: LessonsService) {}

  ngOnInit() {
    this.lessons = this.lessonsService.getAll();
  }
}