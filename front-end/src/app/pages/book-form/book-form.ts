import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';

// Angular feature 8/9: reactive form with grouped controls + validation, used for both create and edit
@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule],
  templateUrl: './book-form.html',
})
export class BookForm implements OnInit {
  private fb = inject(FormBuilder);

  editId: number | null = null;

  // Angular feature 8: FormGroup grouping multiple FormControls together
  form = this.fb.group({
    title: ['', [Validators.required]],
    author: ['', [Validators.required]],
    isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]{10,17}$/)]],
    genre: ['', [Validators.required]],
    publicationYear: [2024, [Validators.required, Validators.min(1000), Validators.max(2100)]],
    copies: [1, [Validators.required, Validators.min(0)]],
  });

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Angular feature 12: route param tells us whether we're editing an existing book
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editId = Number(idParam);
      this.bookService.getById(this.editId).subscribe((book) => this.form.patchValue(book));
    }
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const book = {
      title: value.title!,
      author: value.author!,
      isbn: value.isbn!,
      genre: value.genre!,
      publicationYear: value.publicationYear!,
      copies: value.copies!,
    };

    const request$ = this.editId ? this.bookService.update(this.editId, book) : this.bookService.create(book);

    // Angular feature 14: navigate programmatically back to the list once the request succeeds
    request$.subscribe((saved) => this.router.navigate(['/books', saved.id]));
  }

  cancel(): void {
    this.router.navigate(['/books']);
  }
}
