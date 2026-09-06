# Evaluation and Analysis Report

**UECS3563 — Full stack app development with Angular and Spring Boot**
**Application: Library Management System (Book catalogue CRUD)**

---

## 1. Scope and design intent

The assignment guidelines are explicit that business logic is out of scope: handler methods are to
return dummy data or retrieve data from the backing database through Spring Data JPA, and "the focus
here is to implement the features of the Spring Boot projects correctly." The absence of transaction
processing or domain rules in this application is therefore not a shortfall but the specified scope.

What is evaluated instead is whether the framework features are used correctly and in the right
places. I chose a single entity — `Book` — and implemented it completely, so that every compulsory
feature appears where it is genuinely needed rather than inserted to satisfy a checklist; a wider
domain implemented shallowly would have demonstrated the same features less convincingly. The
architecture is therefore the deliverable: a REST API with a clean resource model, and an Angular SPA
whose component tree, routing and forms are shaped by it.

## 2. Choice of endpoint names and parameters

The API is organised around one noun, `/api/books`, using the HTTP method to express intent rather
than encoding verbs in the path: `GET /api/books?sortBy=&order=` (list, sorted), `GET
/api/books/{id}`, `GET /api/books/genre/{genre}`, `GET /api/books/search?keyword=`, `POST
/api/books`, `PUT /api/books/{id}`, `DELETE /api/books/{id}`.

The split between **path** and **query** parameters is the most deliberate decision. A path parameter
identifies *which resource* is addressed: `/api/books/5` names one book, and `/api/books/genre/Fiction`
names one well-defined subset. A query parameter *modifies how* a collection is presented without
changing which collection it is: `?sortBy=title&order=desc` returns the same books in a different
order, and `?keyword=tolkien` narrows a list by a freely typed value.

This matters practically. Because sorting lives in the query string it is optional and defaultable
(`sortBy=id`, `order=asc`), so the client may omit it; because the identifier lives in the path, an
unknown id is unambiguously a "not found" condition mapping cleanly onto HTTP 404. Had sorting been
baked into the path, every new sort option would require a new route; as query parameters the same
endpoint absorbs new options without changing the URL structure.

Status codes carry meaning rather than defaulting to 200: `POST` returns **201 Created** with the
persisted entity, so the client immediately learns the server-assigned id; `DELETE` returns **204 No
Content**; validation failures return **400** and unknown ids **404**. The front-end can therefore
branch on the status code alone without parsing the body.

## 3. Data access and query strategy

`BookRepository` extends `JpaRepository`, which supplies CRUD and `findAll(Sort)` with no
implementation code — which is why sorting was exposed as an API feature at all. It was essentially
free, and it ensures the sort executes in the database rather than in Java memory, which is the
behaviour that scales.

Two query styles are used for two reasons. The genre filter is a **derived query**
(`findByGenreIgnoreCase`) because the condition is a simple equality Spring Data can infer from the
method name; hand-written SQL would add nothing. The keyword search is a **JPQL query** because it
needs an `OR` across two columns with `LIKE` and case-normalisation — a condition a derived method
name could express only clumsily. The principle: let the framework generate what it can infer, and
drop to explicit JPQL only where the query contains real logic.

The controller calls the repository directly, with no service layer. Since the guidelines direct
handler methods to retrieve data through Spring Data JPA rather than implement business logic, this
is the shape the assignment asks for: a service class would be a pass-through adding indirection
without behaviour, and would imply logic that does not exist. The endpoints were nonetheless designed
so that one could be introduced later without altering the API surface — the controller would
delegate rather than call the repository, and every URL, parameter and status code would remain
unchanged. That stability of the public contract is the point of separating resource design from what
happens behind it.

## 4. The error contract

`GlobalExceptionHandler` (`@RestControllerAdvice`) makes error responses a designed part of the API
rather than whatever Spring happens to emit. Every failure returns one shape —
`{ status, message, fieldErrors }` — so the front-end has a single error format to handle.

The `fieldErrors` map is what pays off across the stack. When Bean Validation rejects a `@Valid
@RequestBody Book`, the handler flattens the binding result into `{ "title": "Title is required",
… }`, so a client can attach server-side errors to individual fields rather than showing a generic
banner. Malformed JSON is caught separately, letting an integrator distinguish "your JSON is broken"
from "your data is invalid" — two problems with different fixes. A catch-all handler returns a
controlled 500 instead of leaking a stack trace.

## 5. Choice of components and routes

The tree is `App → BooksLayout → BookList → BookCard`, mirroring the API's resource structure rather
than being arbitrary. **`App`** holds what is true on every screen (navigation bar, top-level
`<router-outlet>`). **`BooksLayout`** parents the `books` route family so everything under `/books`
renders through a **nested route**, giving a natural home for anything later shared by all book
screens — a sub-header, breadcrumb, or permission guard — without touching the individual pages.
**`BookList`** is a routed page owning state from the URL and the server; **`BookCard`** is
presentational, owning no data and issuing no requests.

The routes encode the same resource thinking as the API: `/books`, `/books/new`, `/books/:id`,
`/books/:id/edit`. A **redirect** from `''` to `/books` gives the app a meaningful landing screen
instead of a blank root, and a **wildcard** route renders a 404 page so a mistyped URL produces a
helpful screen with a route back.

`BookForm` is reused for both create and edit. The screens have identical fields and validation and
differ only in whether an id is present in the route; reading `paramMap.get('id')` and switching
between `create()` and `update()` is a smaller, safer surface than two near-duplicate components that
would inevitably drift apart.

## 6. Choice of bindings and directives

Each binding was chosen for the kind of change it expresses. **Interpolation** (`{{ book.title }}`)
for text; **property binding** (`[title]="'ISBN ' + book.isbn"`) where a DOM property is computed.
**`[ngClass]`** on the card because *several* classes change together when a book is out of stock,
but **`[style.color]`** on the detail page because exactly *one* property changes — the narrower tool
for the narrower job keeps templates readable.

**`@switch`/`@case`** renders the stock badge because its states (out of stock / low / available) are
mutually exclusive branches of one condition, which a chain of `@if` blocks would state less clearly;
**`@if`/`@else`** handles the genuinely branching loading-vs-empty-vs-loaded flow in the list.
**`@for`** uses `track book.id` so Angular re-uses DOM nodes by identity rather than position —
without a stable key, deleting one card would re-render every card after it. Contextual variables are
used where they carry meaning: `$index` numbers each row, `$count` renders "Item 3 of 5", `$first`
marks the first entry.

## 7. Where the HTTP calls are placed

All HTTP access is centralised in `BookService` and injected only into **routed pages** (`BookList`,
`BookForm`, `BookDetail`) — never into `BookCard`.

The reasoning is ownership. A routed component already knows the URL, and the URL determines which
data the screen needs, so it is the right place to translate a route into a request. `BookCard` is
rendered many times per screen; if each card fetched its own data, one list render would fire N
requests and the card would be unusable elsewhere. Instead it receives data through **`@Input`** and
reports intent upward through **`@Output`** (`deleteBook`), and the parent — which owns the list —
performs the delete and refreshes. Data flows down, events flow up.

Within `BookList` the request is driven by a subscription to `queryParamMap`, not by the click
handlers directly. Changing genre, sort field or order calls `router.navigate()` to update the query
string, and the subscription reacts by re-fetching. This makes the URL the single source of truth:
a filtered, sorted view is shareable and bookmarkable and the back button behaves correctly, because
that state was never held privately inside the component. Both subscriptions are released in
`ngOnDestroy`.

## 8. Reactive form design and validation

A **reactive** form was chosen over template-driven because the same form serves two modes: in edit
mode the component must load a book and populate controls programmatically, which `patchValue` does
in one call. Validation rules also live in TypeScript where they can be read in one place rather than
scattered across template attributes.

Validators mirror the server's Bean Validation constraints — `required` on text fields, a `pattern`
on ISBN, `min`/`max` on year and copies. This duplication is intentional: client-side validation
exists for *responsiveness* (the user is told immediately, with no round trip), server-side for
*correctness* (the API is reachable independently of this UI and cannot trust any client). Neither
can be removed.

Two smaller decisions are worth defending. Errors appear only once a control is `touched`, so users
are not met with red text on fields they have not reached. And the submit button is deliberately
**not** disabled while the form is invalid. Disabling it is the common pattern, but on an empty form
it is a dead end: nothing is touched, so no messages are visible, and the button silently does
nothing. Submitting instead calls `markAllAsTouched()`, revealing every outstanding error at once.
Here the more obvious implementation is the worse user experience.

## 9. The end-user perspective

Together these choices make the user's mental model and the backend's resource model coincide. A
librarian browsing the catalogue is issuing `GET /api/books`; narrowing by genre changes the URL,
which changes the request; clicking a card navigates to that book's resource; saving a form is a
`POST` or `PUT` whose errors appear against the exact fields that caused them; deleting is a `DELETE`
followed by a refreshed list. Because every screen's state lives in the route, the back button,
refresh and shared links work without special handling; because the API returns typed status codes
and one error shape, the UI can respond specifically to each failure instead of showing one generic
error.

## 10. Deliberate exclusions and limitations

Two categories should be distinguished. **Excluded by the brief:** business logic, multi-step
transaction processing and any advanced system behaviour — the guidelines direct that handler methods
do no more than serve data from the database, so their absence is scope compliance, not an omission.

**Genuine technical limitations:** the schema is recreated and reseeded on every start
(`ddl-auto=create-drop`), which suits a demonstration but would need a migration tool such as Flyway
in production; there is no authentication; the list endpoint is unpaginated, which would matter well
before the catalogue reached a few thousand rows; and there is no optimistic locking, so two
librarians editing one record concurrently would see a last-write-wins result.
