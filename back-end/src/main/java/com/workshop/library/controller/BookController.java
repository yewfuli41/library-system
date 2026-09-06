package com.workshop.library.controller;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.workshop.library.exception.BookNotFoundException;
import com.workshop.library.model.Book;
import com.workshop.library.repository.BookRepository;

import jakarta.validation.Valid;

/**
 * REST API for managing library books.
 * Backend feature 1 + 2: endpoint design with query/path params, implemented with the
 * standard @RestController/@RequestMapping/@xMapping annotations.
 */
@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookRepository bookRepository;

    public BookController(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // GET /api/books?sortBy=title&order=desc  -> list all books, optionally sorted (query params)
    @GetMapping
    public List<Book> getAllBooks(
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String order) {
        Sort sort = order.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return bookRepository.findAll(sort);
    }

    // GET /api/books/5 -> single book by id (path variable)
    @GetMapping("/{id}")
    public Book getBookById(@PathVariable Long id) {
        return bookRepository.findById(id).orElseThrow(() -> new BookNotFoundException(id));
    }

    // GET /api/books/genre/Fiction -> derived query (path variable)
    @GetMapping("/genre/{genre}")
    public List<Book> getBooksByGenre(@PathVariable String genre) {
        return bookRepository.findByGenreIgnoreCase(genre);
    }

    // GET /api/books/search?keyword=tolkien -> JPQL query (query param)
    @GetMapping("/search")
    public List<Book> searchBooks(@RequestParam String keyword) {
        return bookRepository.searchByKeyword(keyword);
    }

    // POST /api/books -> create a book, @Valid triggers Bean Validation on Book
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Book createBook(@Valid @RequestBody Book book) {
        book.setId(null);
        return bookRepository.save(book);
    }

    // PUT /api/books/5 -> update an existing book
    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @Valid @RequestBody Book book) {
        Book existing = bookRepository.findById(id).orElseThrow(() -> new BookNotFoundException(id));
        existing.setTitle(book.getTitle());
        existing.setAuthor(book.getAuthor());
        existing.setIsbn(book.getIsbn());
        existing.setGenre(book.getGenre());
        existing.setPublicationYear(book.getPublicationYear());
        existing.setCopies(book.getCopies());
        return bookRepository.save(existing);
    }

    // DELETE /api/books/5
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBook(@PathVariable Long id) {
        if (!bookRepository.existsById(id)) {
            throw new BookNotFoundException(id);
        }
        bookRepository.deleteById(id);
    }
}
