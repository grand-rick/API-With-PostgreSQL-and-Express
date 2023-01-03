import client from '../database';

export type Weapon = {
	id: number;
	name: string;
	type: string;
	weight: string;
};

export class MythicalWeaponStore {
	async index(): Promise<Weapon[]> {
		try {
			const conn = await client.connect();
			const sql = 'SELECT * FROM mythical_weapons';
			const result = await conn.query(sql);
			conn.release();
			return result.rows;
		} catch (error) {
			throw new Error(`Cannot get weapons ${error}`);
		}
	}

	async delete(id: string): Promise<Weapon> {
		try {
			const conn = await client.connect();
			
			const sql = 'DELETE FROM mythical_weapons WHERE id = ($1)';

			const result = await conn.query(sql, [id]);

			conn.release();

			const Weapon = result.rows[0];
			return Weapon;
		} catch(error) {
			throw new Error(`Couldn't delete weapon. Error ${error}`);
		}
	}

	async show(id: string): Promise<Weapon> {
		try {
			const conn = await client.connect();
			const sql = 'SELECT * FROM mythical_weapons WHERE id = ($1)';

			const result = await conn.query(sql, [id]);
			conn.release();

			const Weapon = result.rows[0];

			return Weapon;
		} catch (error) {
			throw new Error(`Can't show weapon. Error ${error}`);
		}
	}

	async create(w: Weapon): Promise<Weapon> {
		try {
			const conn = await client.connect();
			const sql = 'INSERT INTO mythical_weapons (name, type, weight) VALUES($1, $2, $3)';

			const result = await conn.query(sql, [w.name, w.type, w.weight]);

			conn.release();
			const Weapon = result.rows[0];
			return Weapon;
		} catch (error) {
			throw new Error(`Can't create a weapon. Error: ${error}`);
		}
	}

}

