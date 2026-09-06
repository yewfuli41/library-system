# Library Management System

A full-stack Book CRUD app built for the UECS3563 assignment, using **Angular** (front-end) and
**Spring Boot** (back-end). The business logic is intentionally simple — managing a catalogue of
books is the primary feature — so the project can focus on demonstrating the required Angular and
Spring Boot framework features.

## Project structure

```
library-system/
├── back-end/    Spring Boot REST API (Java 17, Spring Boot 4, Spring Data JPA, MySQL)
└── front-end/   Angular 21 SPA (standalone components, Tailwind CSS)
```

## Prerequisites

- Java 17+, Maven (or use the included `./mvnw`)
- Node.js + npm
- MySQL running locally

## Running the app

**1. Create the database** (once):

```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS library_db;"
```

Edit `back-end/src/main/resources/application.properties` if your MySQL username/password differ
from `root` / (empty).

**2. Start the back-end** (http://localhost:8080):

```bash
cd back-end
./mvnw spring-boot:run
```

The schema is (re)created and reseeded with 6 sample books every time the app starts
(`spring.jpa.hibernate.ddl-auto=create-drop` + `data.sql`) — the simplest possible setup for a
demo/assignment project.

**3. Start the front-end** (http://localhost:4200):

```bash
cd front-end
npm install
npm start
```

Open http://localhost:4200 — it proxies API calls straight to `http://localhost:8080/api` (CORS is
enabled on the backend for the Angular dev server origin).

## REST API

| Method | Endpoint                       | Description                                   |
|--------|---------------------------------|------------------------------------------------|
| GET    | `/api/books?sortBy=&order=`     | List all books, optionally sorted              |
| GET    | `/api/books/{id}`                | Get one book by id                             |
| GET    | `/api/books/genre/{genre}`       | Books in a genre (derived query)               |
| GET    | `/api/books/search?keyword=`     | Search by title/author (JPQL query)             |
| POST   | `/api/books`                     | Create a book                                  |
| PUT    | `/api/books/{id}`                | Update a book                                  |
| DELETE | `/api/books/{id}`                | Delete a book                                  |

## Assignment feature mapping

Every compulsory feature from the assignment brief is implemented and commented in the code at the
point it's used. Summary below (also see inline comments marked `Angular feature N` / `Backend
feature N`).

### Angular (front-end)

| # | Feature | Where |
|---|---------|-------|
| 1 | Interpolation & property binding | Throughout, e.g. [book-card.html](front-end/src/app/components/book-card/book-card.html) |
| 2 | Class/style binding, NgClass/NgStyle + CSS | [book-card.html](front-end/src/app/components/book-card/book-card.html) (`[ngClass]`), [book-detail.html](front-end/src/app/pages/book-detail/book-detail.html) (`[style.color]`) |
| 3 | Event binding | Buttons/selects across all pages, e.g. [book-list.html](front-end/src/app/pages/book-list/book-list.html) |
| 4 | Component hierarchy (root/child/grandchild) | `App` → `BooksLayout` → `BookList` → `BookCard` |
| 5 | @Input / @Output | [book-card.ts](front-end/src/app/components/book-card/book-card.ts) |
| 6 | @if/@else and @switch/@case | [book-list.html](front-end/src/app/pages/book-list/book-list.html) (`@if/@else`), [book-card.html](front-end/src/app/components/book-card/book-card.html) (`@switch/@case`) |
| 7 | @for with $index/$count/$first | [book-list.html](front-end/src/app/pages/book-list/book-list.html) |
| 8 | Reactive forms, grouped controls | [book-form.ts](front-end/src/app/pages/book-form/book-form.ts) |
| 9 | Form validation + error messages | [book-form.html](front-end/src/app/pages/book-form/book-form.html) |
| 10 | HttpClient GET/POST/PUT/DELETE + Observables/Subscriptions | [book.service.ts](front-end/src/app/services/book.service.ts), subscription handling in [book-list.ts](front-end/src/app/pages/book-list/book-list.ts) |
| 11 | Routes, redirect, wildcard | [app.routes.ts](front-end/src/app/app.routes.ts) |
| 12 | Route params & query params | [book-detail.ts](front-end/src/app/pages/book-detail/book-detail.ts) (route param), [book-list.ts](front-end/src/app/pages/book-list/book-list.ts) (query params) |
| 13 | Nested/child routes | [app.routes.ts](front-end/src/app/app.routes.ts) + [books-layout.ts](front-end/src/app/pages/books-layout/books-layout.ts) |
| 14 | Programmatic navigation | [book-card.ts](front-end/src/app/components/book-card/book-card.ts), [book-form.ts](front-end/src/app/pages/book-form/book-form.ts), [book-detail.ts](front-end/src/app/pages/book-detail/book-detail.ts) |

### Spring Boot (back-end)

| # | Feature | Where |
|---|---------|-------|
| 1-2 | REST endpoint design with path/query params, `@RestController`/`@xMapping` annotations | [BookController.java](back-end/src/main/java/com/workshop/library/controller/BookController.java) |
| 3 | Domain class + DB init | [Book.java](back-end/src/main/java/com/workshop/library/model/Book.java), [data.sql](back-end/src/main/resources/data.sql) |
| 4 | CRUD + sorting via JpaRepository | [BookRepository.java](back-end/src/main/java/com/workshop/library/repository/BookRepository.java), `findAll(Sort)` used in the controller |
| 5 | Derived query + JPQL query | [BookRepository.java](back-end/src/main/java/com/workshop/library/repository/BookRepository.java) |
| 6 | Custom exception handling, status codes | [GlobalExceptionHandler.java](back-end/src/main/java/com/workshop/library/exception/GlobalExceptionHandler.java) |

## Notes

- No borrow/return or membership workflow — this is deliberately a plain Book CRUD app per the
  assignment's "simplified back-end" guidance; business logic is out of scope for this assignment.
- `spring.jpa.hibernate.ddl-auto=create-drop` recreates the schema on every restart. This is fine
  for a demo/assignment; a real deployment would use a migration tool (Flyway/Liquibase) instead.
