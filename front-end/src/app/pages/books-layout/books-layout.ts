import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Angular feature 13: parent route component hosting nested/child routes (list, detail, new, edit)
@Component({
  selector: 'app-books-layout',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class BooksLayout {}
