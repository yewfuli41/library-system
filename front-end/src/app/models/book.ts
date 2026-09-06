// Domain model mirroring the backend Book entity
export interface Book {
  id?: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publicationYear: number;
  copies: number;
}
