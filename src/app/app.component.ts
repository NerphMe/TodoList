// noinspection NegatedConditionalExpressionJS,TypeScriptUnresolvedVariable
// noinspection NestedFunctionCallJS

import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Todo} from './todo';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
declare var $ : any;


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
  public closeResult = '';
  public todoId = null;


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

  onCreateChildren(): void {
    if (this.childTitle) {
      this.httpClint
        .post<Todo[]>('http://127.0.0.1:8000/api/create/children/todo', {title: this.childTitle, parent_id: this.todoId})
        .subscribe(todo => {
            // @ts-ignore
            this.todoList.find(todo => todo.id === todo.id).children.push(todo);
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


  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
