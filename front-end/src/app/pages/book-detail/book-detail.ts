import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';

// Angular feature 12: reads the :id route parameter of the current route
@Component({
  selector: 'app-book-detail',
  imports: [],
  templateUrl: './book-detail.html',
})
export class BookDetail implements OnInit {
  book: Book | null = null;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getById(id).subscribe({
      next: (book) => (this.book = book),
      error: () => (this.notFound = true),
    });
  }

  edit(): void {
    this.router.navigate(['/books', this.book!.id, 'edit']);
  }

  remove(): void {
    this.bookService.delete(this.book!.id!).subscribe(() => this.router.navigate(['/books']));
  }

  back(): void {
    this.router.navigate(['/books']);
  }
}
