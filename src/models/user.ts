import client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const {
    BCRYPT_PASSWORD,
    SALT_ROUNDS
} = process.env;

const pepper = BCRYPT_PASSWORD as unknown as string;
const saltRounds = SALT_ROUNDS as unknown as string;

export type User = {
    id?: string | number;
    username: string;
    password: string;
}

export default class UserStore {
    async index(): Promise<User[]> {
        try {
            const sql = 'SELECT * FROM users';
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release;
            const users = result.rows;
            return users;
        } catch (err) {
            throw new Error(`Unable to show all users. Error: ${err}`);
        }
    }

    async create(u: User): Promise<User> {
        try {
            const sql = 'INSERT INTO users (username, hash_password) VALUES ($1, $2) RETURNING *';
            const hash = await bcrypt.hash(
                `${u.password}${pepper}`,
                parseInt(saltRounds)
            );
            const conn = await client.connect();
            const result = await conn.query(sql, [u.username, hash]);
            conn.release();
            const newUser = result.rows[0];
            return newUser;
        } catch (err) {
            throw new Error(`Unable to create new user. Error ${err}`);
        }
    }

    async update(u: User): Promise<User> {
        try {
            const sql = 'UPDATE users SET username = $2, hash_pasword = $3 WHERE id = $1 ';
            const conn = await client.connect();
            const hash = await bcrypt.hash(
                `${u.password}${pepper}`,
                parseInt(saltRounds)
            );

            const result = await conn.query(sql, [u.id, u.username, hash]);
            conn.release();

            const updatedUser = result.rows[0];
            return updatedUser;
        } catch (err) {
            throw new Error(`Unable to update user. Error: ${err}`);
        }
    }

    async show(id: string): Promise<User> {
        try {
            const sql = 'SELECT * FROM users WHERE id = $1';
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            const user = result.rows[0];
            return user;
        } catch (err) {
            throw new Error(`Unable to show user. Error ${err}`);
        }
    }

    async delete(id: string) {
        try {
            const sql = 'DELETE FROM users WHERE id = $1';
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            const deleted = result.rows[0];
            return deleted;
        } catch (err) {
            throw new Error(`Unable to delete. Error${err}`);
        }
    }

    async authenticate(username: string, password: string): Promise<User | null> {
        try {
            const sql = 'SELECT * FROM users WHERE username = $1';
            const conn = await client.connect();
            const result = await conn.query(sql, [username]);

            if (result.rows.length) {
                const user = result.rows[0];
                const isPasswordValid = await bcrypt.compare(`${password}${pepper}`, user.hash_password);

                if (isPasswordValid) {
                    return user;
                } else {
                    console.log('Invalid password');
                    return null;
                }

            }
            return null;
        } catch (err) {
            throw new Error(`Unable to authenticate. Error ${err}`);
        }
    }
}