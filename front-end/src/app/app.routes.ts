import { Routes } from '@angular/router';
import { BooksLayout } from './pages/books-layout/books-layout';
import { BookList } from './pages/book-list/book-list';
import { BookForm } from './pages/book-form/book-form';
import { BookDetail } from './pages/book-detail/book-detail';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  // Angular feature 11: redirect route - '' sends users straight to the book catalogue
  { path: '', redirectTo: '/books', pathMatch: 'full' },

  // Angular feature 13: 'books' is the parent route, its children below are nested/child routes
  // rendered inside BooksLayout's <router-outlet>
  {
    path: 'books',
    component: BooksLayout,
    children: [
      { path: '', component: BookList },
      { path: 'new', component: BookForm },
      // Angular feature 12: ':id' is a route parameter passed to BookDetail
      { path: ':id', component: BookDetail },
      { path: ':id/edit', component: BookForm },
    ],
  },

  // Angular feature 11: wildcard route catches any unmatched URL
  { path: '**', component: NotFound },
];
