// noinspection NegatedConditionalExpressionJS,TypeScriptUnresolvedVariable
// noinspection NestedFunctionCallJS

import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Todo} from './todo';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = '';
  public childTitle = '';
  public toggle = [];
  public todoList: Todo[];
  private httpClint: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClint = httpClient;
  }

  ngOnInit(): void {
    this.httpClint.get<Todo[]>('http://127.0.0.1:8000/api/todos')
      .subscribe(todoList => {
          this.todoList = todoList;
      });
  }

  onCreate(): void {
    if (this.title) {
      this.httpClint
        .post<Todo[]>('http://127.0.0.1:8000/api/create/todo', {title: this.title})
        .subscribe(todo => {
            // @ts-ignore
            return this.todoList.push(todo);
          }
        );
      this.title = '';
    }
  }

  onCreateChildren(createChildren: Todo): void {
    if (this.childTitle) {
      this.httpClint
        .post<Todo[]>('http://127.0.0.1:8000/api/create/children/todo', {title: this.childTitle, parent_id: createChildren.id})
        .subscribe(todo => {
            // @ts-ignore
            this.todoList.find(todo => todo.id === createChildren.id).children.push(todo);
          }
        );
      this.childTitle = '';
    }
  }

  onRemoveChildren(removeChildren: Todo): void {
    this.httpClint
      .delete<void>('http://127.0.0.1:8000/api/delete/children/todo/' + removeChildren.id)
      .subscribe(todo => {
          // @ts-ignore
          this.ngOnInit();
        }
      );
  }

  onRemove(todoOnDelete: Todo): void {
    this.httpClint
      .delete<void>('http://127.0.0.1:8000/api/delete/todo/' + todoOnDelete.id)
      .subscribe(() => {
          this.todoList = this.todoList.filter(todo => todo.id !== todoOnDelete.id);
        }
      );
  }

  onComplete(todoOnComplete: Todo): void {
    this.httpClint
      .patch<Todo>('http://127.0.0.1:8000/api/update/todo/' + todoOnComplete.id, {
        isCompleted: !todoOnComplete.isCompleted
      }).subscribe((updatedTodo: Todo) => {
      this.todoList = this.todoList.map(todo => todo.id !== updatedTodo.id ? todo : updatedTodo);
    });
  }

  onSearch() {
    const params = new HttpParams().append('title', this.title);
    this.httpClint.get<Todo>('http://127.0.0.1:8000/api/search/todos', {params})
      .subscribe((searchedTodo: Todo) => {
        // @ts-ignore
       if (this.title === '') {
         this.ngOnInit();
       } else {
         // @ts-ignore
          this.todoList = this.todoList.filter(todo => todo.id === searchedTodo.id);
       }
      });
  }
}
