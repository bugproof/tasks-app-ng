import {Component, Input, OnInit, Pipe, PipeTransform} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from './types';


@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-100 p-4">
      <div class="grid gap-4 mb-2 font-bold" [style.grid-template-columns]="gridColumns">
        <div [ngClass]="cellClass">NAME</div>
        <div [ngClass]="cellClass">START</div>
        <div [ngClass]="cellClass">END</div>
        <div [ngClass]="cellClass">PRIORITY</div>
        <div [ngClass]="cellClass">PROGRESS</div>
      </div>
      <div class="space-y-2">
        <ng-container *ngFor="let item of displayItems">
          <div class="flex bg-white rounded-lg shadow-sm overflow-hidden"
               [style.margin-left.px]="item.depth * indentWidth">
            <div class="flex-grow overflow-hidden grid gap-4 items-center"
                 [style.grid-template-columns]="getNameColumnWidth(item.depth)">
              <div [ngClass]="cellClass + ' flex items-center'">
                <button *ngIf="item.task.childTasks.length > 0" (click)="toggleTask(item.task)"
                        class="mr-2 w-6 h-6 flex-shrink-0 flex items-center justify-center">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                       xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          [attr.d]="isExpanded(item.task) ? 'M19 9l-7 7-7-7' : 'M9 5l7 7-7 7'"></path>
                  </svg>
                </button>
                <span class="truncate">{{ item.task.name }}</span>
              </div>
            </div>
            <div class="flex-shrink-0 grid gap-4 items-center" style="grid-template-columns: 100px 100px 100px 100px;">
              <div [ngClass]="cellClass">
                <span class="truncate">{{ item.task.startDate | date:'MMM d' }}</span>
              </div>
              <div [ngClass]="cellClass">
                <span class="truncate">{{ item.task.endDate | date:'MMM d' }}</span>
              </div>
              <div [ngClass]="cellClass">
                <span class="px-2 py-1 rounded text-sm font-medium truncate" [ngClass]="{
                  'bg-red-100 text-red-800': item.task.priority === 'HIGH',
                  'bg-yellow-100 text-yellow-800': item.task.priority === 'MEDIUM',
                  'bg-blue-100 text-blue-800': item.task.priority === 'NORMAL',
                  'bg-green-100 text-green-800': item.task.priority === 'LOW'
                }">{{ item.task.priority }}</span>
              </div>
              <div [ngClass]="cellClass">
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div class="bg-blue-600 h-2.5 rounded-full" [style.width.%]="item.task.percentageOfProgress"></div>
                </div>
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

  readonly indentWidth = 20;
  readonly gridColumns = `1fr 100px 100px 100px 100px`;
  readonly cellClass = 'py-3 px-4 overflow-hidden';

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
