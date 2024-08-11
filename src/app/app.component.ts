import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Task } from './types';
import {RouterOutlet} from "@angular/router";
import {TaskTableComponent} from "./task-table.component";
import {TaskListMobileComponent} from "./task-list-mobile.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    TaskTableComponent,
    TaskListMobileComponent
  ]
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.http.get<Task[]>('assets/tasks.json').subscribe(
      {
        next: (tasks: Task[]) => {this.tasks = tasks;},
        error: (err: Error) => {console.error('Error loading tasks:', err);}
      }
    );
  }
}
