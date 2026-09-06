package com.workshop.library.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.workshop.library.model.Book;

/**
 * Spring Data JPA repository for Book.
 * Backend feature 4: CRUD + sorting comes free via JpaRepository (findAll(Sort)).
 */
public interface BookRepository extends JpaRepository<Book, Long> {

    // Backend feature 5 (derived query)
    List<Book> findByGenreIgnoreCase(String genre);

    // Backend feature 5 (JPQL query) - free text search across title and author
    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) "
            + "OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Book> searchByKeyword(@Param("keyword") String keyword);
}
