import client from '../database';

export type Book = {
    id?: number;
    title: string;
    author: string;
    totalPages: number;
    summary: string;
}

export class BookStore {
    async index(): Promise<Book[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM full_stack_dev';
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
            const sql = 'INSERT INTO books(title, author, totalPages, summary) VALUES($1, $2, $3, $4)';
            const result = await conn.query(sql, [b.title, b.author, b.totalPages, b.summary]);
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
            const conn = await client.connect();
            const sql = 'DELETE FROM books WERE id = ($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            const book = result.rows[0];
            return book;
        } catch (error) {
            throw new Error(`Couldn't delete book. Error: ${error}`);
        }
    }
}