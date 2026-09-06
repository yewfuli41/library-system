import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book';

const API_URL = 'http://localhost:8080/api/books';

// Angular feature 10: wraps every HTTPClient GET/POST/PUT/DELETE call to the backend REST API,
// each returning an Observable that components subscribe to.
@Injectable({ providedIn: 'root' })
export class BookService {
  constructor(private http: HttpClient) {}

  getAll(sortBy = 'id', order = 'asc'): Observable<Book[]> {
    return this.http.get<Book[]>(`${API_URL}?sortBy=${sortBy}&order=${order}`);
  }

  getByGenre(genre: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${API_URL}/genre/${genre}`);
  }

  search(keyword: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${API_URL}/search?keyword=${keyword}`);
  }

  getById(id: number): Observable<Book> {
    return this.http.get<Book>(`${API_URL}/${id}`);
  }

  create(book: Book): Observable<Book> {
    return this.http.post<Book>(API_URL, book);
  }

  update(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${API_URL}/${id}`, book);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
