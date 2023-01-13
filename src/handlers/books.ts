import express, {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import BookStore, {Book} from '../models/book';

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET as unknown as string;

const store = new BookStore();

const index = async (_req: Request, res: Response): Promise<void> => {
    const books = await store.index();
    res.json(books);
};

const show = async (req: Request, res: Response) => {
    try {
        const book = await store.show(req.params.id);
        res.json(book);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const create = async (req: Request, res: Response) => {
    const bookN = {
        title: req.body.title,
        author: req.body.author,
        total_pages: req.body.total_pages as unknown as number,
        summary: req.body.summary
    }
    try {
        const newUser = await store.create(bookN);
        res.json(newUser);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};


const destroy = async (req: Request, res: Response) => {
    try {
        const deleted = await store.delete(req.params.id);
        res.json(deleted);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

export const verifyAuthToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization as unknown as string;
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(token, TOKEN_SECRET);
        next();
    } catch (err) {
        res.status(401);
        res.json(err);
    }
}

const book_store_routes = (app: express.Application) => {
    app.get('/books', index);
    app.get('/books/:id', show);
    app.post('/books', verifyAuthToken, create);
    app.delete('/books/:id', verifyAuthToken, destroy);
};

export default book_store_routes;