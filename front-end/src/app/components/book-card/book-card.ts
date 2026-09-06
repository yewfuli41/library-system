import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { Book } from '../../models/book';

// Angular feature 4/5: grandchild component - receives data from BookList via @Input
// and reports user actions back up via @Output
@Component({
  selector: 'app-book-card',
  imports: [NgClass],
  templateUrl: './book-card.html',
})
export class BookCard {
  @Input({ required: true }) book!: Book;
  @Input() index = 0;
  @Input() isFirst = false;

  @Output() deleteBook = new EventEmitter<number>();

  constructor(private router: Router) {}

  // Angular feature 14: programmatic navigation instead of a routerLink
  viewDetail(): void {
    this.router.navigate(['/books', this.book.id]);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.deleteBook.emit(this.book.id);
  }
}
