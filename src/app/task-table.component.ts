import {Component, Input, OnInit, Pipe, PipeTransform} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from './types';


@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-slate-100 p-4">
      <div class="grid gap-4 mb-2 font-bold" [style.grid-template-columns]="gridColumns">
        <div [ngClass]="[cellClass, 'ml-20']">NAME</div>
        <div [ngClass]="cellClass">START</div>
        <div [ngClass]="cellClass">END</div>
        <div [ngClass]="cellClass">PRIORITY</div>
        <div [ngClass]="cellClass">PROGRESS</div>
      </div>
      <div class="space-y-2">
        <ng-container *ngFor="let item of displayItems">
          <div class="flex bg-white rounded-lg shadow overflow-hidden"
               [style.margin-left.px]="item.depth * indentWidth">
            <div class="flex-grow overflow-hidden  grid gap-4 items-center"
                 [style.grid-template-columns]="getNameColumnWidth(item.depth)">
              <div [ngClass]="cellClass + ' flex items-center gap-4'">
                <!-- status indicator -->
                <div [ngClass]="{
                    'rounded-full w-3 h-3 absolute -ml-[27px]': true,
                    'bg-gray-400': item.task.status === 'TO_DO',
                    'bg-green-400': item.task.status === 'IN_PROGRESS',
                }"></div>

                <!-- is child indicator -->
                <svg *ngIf="item.depth > 0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="absolute size-4 text-rose-700 -ml-[50px]">
                  <path fill-rule="evenodd" d="M2.75 2a.75.75 0 0 1 .75.75v6.5h7.94l-.97-.97a.75.75 0 0 1 1.06-1.06l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H2.75A.75.75 0 0 1 2 10V2.75A.75.75 0 0 1 2.75 2Z" clip-rule="evenodd" />
                </svg>

                <img src="https://picsum.photos/seed/{{item.task.id}}/64/64" class="w-16 h-16" alt=""/>
                <div class="grid">
                  <span class="truncate  font-semibold text-base text-slate-900">{{ item.task.name }}</span>

                  <div class="flex items-center gap-2">
                    <span class="text-xs font-semibold text-slate-400">{{item.task.taskNumber}}</span>
                    <button *ngIf="item.task.childTasks.length > 0" (click)="toggleTask(item.task)"
                            class="mr-2 w-6 px-6 py-3.5 h-6 flex items-center justify-center font-bold border border-rose-700 text-rose-700 rounded-md">


                      <div class="flex items-center gap-1">
<!--                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"-->
<!--                             xmlns="http://www.w3.org/2000/svg">-->
<!--                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"-->
<!--                                [attr.d]="isExpanded(item.task) ? 'M19 9l-7 7-7-7' : 'M9 5l7 7-7 7'"></path>-->
<!--                        </svg>-->
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                          <path fill-rule="evenodd" d="M2.75 2a.75.75 0 0 1 .75.75v6.5h7.94l-.97-.97a.75.75 0 0 1 1.06-1.06l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H2.75A.75.75 0 0 1 2 10V2.75A.75.75 0 0 1 2.75 2Z" clip-rule="evenodd" />
                        </svg>


                        <div class="ml-1.5">{{item.task.childTasks.length}}</div>

                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex-shrink-0 grid gap-4 items-center" style="grid-template-columns: 120px 120px 130px 130px;">
              <div [ngClass]="[cellClass, 'font-medium']">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-slate-600">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <span class="truncate">{{ item.task.startDate | date:'MMM d' }}</span>
              </div>
              <div [ngClass]="[cellClass, 'font-medium']">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-slate-600">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <span class="truncate">{{ item.task.endDate | date:'MMM d' }}</span>
              </div>
              <div [ngClass]="cellClass">
                <span class="px-2 py-1 rounded text-sm font-medium truncate" [ngClass]="{
                  'text-rose-600': item.task.priority === 'HIGH',
                  'text-orange-500': item.task.priority === 'MEDIUM',
                  'text-gray-400': item.task.priority === 'NORMAL',
                  'text-blue-400': item.task.priority === 'LOW'
                }">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M3 2.25a.75.75 0 0 1 .75.75v.54l1.838-.46a9.75 9.75 0 0 1 6.725.738l.108.054A8.25 8.25 0 0 0 18 4.524l3.11-.732a.75.75 0 0 1 .917.81 47.784 47.784 0 0 0 .005 10.337.75.75 0 0 1-.574.812l-3.114.733a9.75 9.75 0 0 1-6.594-.77l-.108-.054a8.25 8.25 0 0 0-5.69-.625l-2.202.55V21a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 3 2.25Z" clip-rule="evenodd" />
</svg>
                </span>

                <div class="-ml-2 font-semibold">{{item.task.priority | titlecase}}</div>
              </div>
              <div [ngClass]="[cellClass, 'font-medium']">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-slate-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>

                {{item.task.percentageOfProgress}} %
<!--                <div class="w-full bg-slate-200 rounded-full h-2.5">-->
<!--                  <div class="bg-blue-600 h-2.5 rounded-full" [style.width.%]="item.task.percentageOfProgress"></div>-->
<!--                </div>-->
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `
})
export class TaskTableComponent implements OnInit {
  @Input() tasks: Task[] = [];
  displayItems: { task: Task; depth: number }[] = [];
  expandedTasks: Set<string> = new Set();

  readonly indentWidth = 30;
  readonly gridColumns = `1fr 120px 120px 130px 130px`;
  readonly cellClass = 'py-2 px-5 overflow-hidden flex items-center gap-2 text-sm text-slate-950';

  ngOnInit() {
    this.updateDisplayItems();
  }

  toggleTask(task: Task) {
    if (this.expandedTasks.has(task.id)) {
      this.expandedTasks.delete(task.id);
    } else {
      this.expandedTasks.add(task.id);
    }
    this.updateDisplayItems();
  }

  isExpanded(task: Task): boolean {
    return this.expandedTasks.has(task.id);
  }

  updateDisplayItems() {
    this.displayItems = this.flattenTasks(this.tasks);
  }

  flattenTasks(tasks: Task[], depth = 0): { task: Task; depth: number }[] {
    let result: { task: Task; depth: number }[] = [];
    for (const task of tasks) {
      result.push({ task, depth });
      if (task.childTasks && task.childTasks.length > 0 && this.isExpanded(task)) {
        result = result.concat(this.flattenTasks(task.childTasks, depth + 1));
      }
    }
    return result;
  }

  getNameColumnWidth(depth: number): string {
    return `calc(100% - ${depth * this.indentWidth}px)`;
  }
}

interface TaskWrapper {
  task: Task;
  expanded: boolean;
  depth: number;
}
