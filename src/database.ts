import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, ENV, POSTGRES_TEST_DB } =
	process.env;

// @ts-ignore
let client = new Pool();
console.log(ENV);

if (ENV === 'test') {
	client = new Pool({
		host: POSTGRES_HOST,
		database: POSTGRES_DB,
		user: POSTGRES_USER,
		password: POSTGRES_PASSWORD
	})
}

if (ENV === 'dev') {
	client = new Pool({
		host: POSTGRES_HOST,
		database: POSTGRES_TEST_DB,
		user: POSTGRES_USER,
		password: POSTGRES_PASSWORD
	})
}



export default client;
