import ProductStore, { Product } from '../models/product';
import express, { Request, Response } from 'express';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
	try {
		const allProducts: Product[] = await store.index();
		res.json(allProducts);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

const create = async (req: Request, res: Response) => {
	const product1: Product = {
		name: req.body.name,
		price: req.body.price,
	};
	try {
		const newProduct = await store.create(product1);
		res.json(newProduct);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

const show = async (req: Request, res: Response) => {
	try {
		const product = await store.show(req.params.id);
		res.json(product);
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

const productsRoutes = (app: express.Application) => {
	app.get('/products', index);
	app.get('/products/:id', show);
	app.post('/products', create);
	app.delete('/products/:id', destroy);
};

export default productsRoutes;
