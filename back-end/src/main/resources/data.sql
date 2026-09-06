-- Initial records for the books table (Backend feature 3: seed data for the domain class)
INSERT INTO books (title, author, isbn, genre, publication_year, copies) VALUES
('The Hobbit', 'J.R.R. Tolkien', '978-0261102217', 'Fantasy', 1937, 4),
('1984', 'George Orwell', '978-0451524935', 'Dystopian', 1949, 6),
('Clean Code', 'Robert C. Martin', '978-0132350884', 'Technology', 2008, 3),
('The Pragmatic Programmer', 'Andrew Hunt', '978-0201616224', 'Technology', 1999, 2),
('To Kill a Mockingbird', 'Harper Lee', '978-0446310789', 'Fiction', 1960, 5),
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0743273565', 'Fiction', 1925, 0);
