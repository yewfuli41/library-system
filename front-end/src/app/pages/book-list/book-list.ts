import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookCard } from '../../components/book-card/book-card';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';

// Angular feature 4: grandchild component nested under BooksLayout (child) under App (root)
@Component({
  selector: 'app-book-list',
  imports: [BookCard],
  templateUrl: './book-list.html',
})
export class BookList implements OnInit, OnDestroy {
  books: Book[] = [];
  genre = '';
  sortBy = 'id';
  order = 'asc';
  loading = true;

  // Angular feature 10: explicit Subscription handling for the query-param-driven fetch
  private querySub?: Subscription;
  private fetchSub?: Subscription;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Angular feature 12: read query params (genre, sortBy, order) passed between routed views
    this.querySub = this.route.queryParamMap.subscribe((params) => {
      this.genre = params.get('genre') ?? '';
      this.sortBy = params.get('sortBy') ?? 'id';
      this.order = params.get('order') ?? 'asc';
      this.fetchBooks();
    });
  }

  ngOnDestroy(): void {
    this.querySub?.unsubscribe();
    this.fetchSub?.unsubscribe();
  }

  fetchBooks(): void {
    this.loading = true;
    const request$ = this.genre
      ? this.bookService.getByGenre(this.genre)
      : this.bookService.getAll(this.sortBy, this.order);

    this.fetchSub = request$.subscribe((books) => {
      this.books = books;
      this.loading = false;
    });
  }

  search(keyword: string): void {
    if (!keyword.trim()) {
      this.fetchBooks();
      return;
    }
    this.loading = true;
    this.fetchSub = this.bookService.search(keyword.trim()).subscribe((books) => {
      this.books = books;
      this.loading = false;
    });
  }

  // Angular feature 14: programmatic navigation used to update query params without a routerLink
  onSortChange(sortBy: string): void {
    this.router.navigate(['/books'], { queryParams: { ...this.currentParams(), sortBy } });
  }

  onOrderChange(order: string): void {
    this.router.navigate(['/books'], { queryParams: { ...this.currentParams(), order } });
  }

  onGenreChange(genre: string): void {
    this.router.navigate(['/books'], { queryParams: { genre: genre || null } });
  }

  onDelete(id: number): void {
    this.bookService.delete(id).subscribe(() => this.fetchBooks());
  }

  private currentParams() {
    return { genre: this.genre || null, sortBy: this.sortBy, order: this.order };
  }
}
