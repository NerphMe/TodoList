// noinspection NegatedConditionalExpressionJS,TypeScriptUnresolvedVariable
// noinspection NestedFunctionCallJS

import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Todo} from './todo';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public title = '';
  public title_search = '';
  public childTitle = '';
  public toggle = [];
  public todoList: Todo[];
  private httpClint: HttpClient;
  public text = '#41';

  constructor(httpClient: HttpClient, private modalService: NgbModal) {
    this.httpClint = httpClient;
  }

  ngOnInit(): void {
    this.httpClint.get<Todo[]>('http://127.0.0.1:8000/api/todos')
      .subscribe(todoList => {
         return this.todoList = todoList;
      });
  }

  onCreate(): void {
    if (this.title) {
      this.httpClint
        .post<Todo[]>('http://127.0.0.1:8000/api/create/todo', {title: this.title})
        .subscribe(todo => {
            // @ts-ignore
            return this.todoList.push(todo) ?? todo;
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
      .subscribe(() => this.ngOnInit());
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

  // tslint:disable-next-line:typedef
  onSearch() {
    const params = new HttpParams().append('title', this.title_search);
    this.httpClint.get<Todo[]>('http://127.0.0.1:8000/api/search/todos', {params})
      .subscribe(todoList => {
        // @ts-ignore
       if (this.title_search === '') {
         this.ngOnInit();
       } else {
         // @ts-ignore
          this.todoList = todoList;
       }
      });
  }

  onShow(showTodo: Todo) {
    this.httpClint.get<Todo[]>('http://127.0.0.1:8000/api/show/todo/' + showTodo.id)
      .subscribe(todoList => {
        // @ts-ignore

      });
  }

}
