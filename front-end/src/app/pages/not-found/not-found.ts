import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Angular feature 11: rendered by the wildcard (**) route for any unmatched URL
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="p-10 text-center">
      <h1 class="text-3xl font-bold mb-2">404</h1>
      <p class="text-slate-600 mb-4">Page not found.</p>
      <a routerLink="/books" class="text-slate-800 underline">Back to books</a>
    </div>
  `,
})
export class NotFound {}
