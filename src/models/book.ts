import client from '../database';

export type Book = {
    id?: string | number;
    title: string;
    author: string;
    total_pages: number;
    summary: string;
}

export default class BookStore {
    async index(): Promise<Book[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM books';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Couldn't open book ${error}`);
        }
    }
    // GET (READ)
    async show(id: string): Promise<Book> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM books where id = ($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            const book = result.rows[0];
            return book;
        } catch (error) {
            throw new Error(`Couldn't show book ${error}`);
        }
    }

    // CREATE
    async create(b: Book): Promise<Book> {
        try {
            const conn = await client.connect();
            const sql = 'INSERT INTO books(title, author, total_pages, summary) VALUES($1, $2, $3, $4) RETURNING *';
            const result = await conn.query(sql, [b.title, b.author, b.total_pages, b.summary]);
            conn.release();
            const book = result.rows[0];
            return book;
        } catch(error) {
            throw new Error(`Couldn't add new book. Error:${error}`);
        }
    }

    // DELETE
    async delete(id: string): Promise<Book> {
        try {
            const sql = 'DELETE FROM books WHERE id = ($1)';
            const conn = await client.connect();
            
            const result = await conn.query(sql, [id]);
            conn.release();

            return result.rows[0];
        } catch (error) {
            throw new Error(`Couldn't delete book. Error: ${error}`);
        }
    }
}