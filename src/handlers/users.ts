import UserStore, {User} from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import express, {Request, Response} from 'express';
import { verifyAuthToken } from './books';
dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET as unknown as string;
const store = new UserStore();

const index = async (_req: Request, res: Response) => {
    try {
        const allUsers = await store.index();
        res.json(allUsers);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const create = async (req: Request, res: Response) => {
    const userN = {
        username: req.body.username,
        password: req.body.password
    }
    try {
        const newUser = await store.create(userN);
        var token = jwt.sign({user: newUser}, TOKEN_SECRET);
        res.json(token);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const update = async (req: Request, res: Response) => {
    const userN = {
        username: req.body.username,
        password: req.body.password
    };
    try {
        const updatedUser = await store.update(userN);
        res.json(updatedUser);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const user = await store.show(req.params.id);
        res.json(user);
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

const authenticate = async (req: Request, res: Response) => {
    try {
        const isAuthenticated = await store.authenticate(req.body.username, req.body.password);
        if (isAuthenticated) {
            var token = jwt.sign({user: isAuthenticated}, TOKEN_SECRET);
            res.json(token);
        }
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}



const usersRoutes = (app: express.Application) => {
    app.get('/authenticate', authenticate);
    app.post('/signup', create);
    app.get('/users', verifyAuthToken, index);
    app.get('/users/:id', verifyAuthToken, show);
    app.put('/users/:id', verifyAuthToken, update);
    app.delete('/users/:id', verifyAuthToken, destroy);
};

export default usersRoutes;