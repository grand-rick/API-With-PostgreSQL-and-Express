import {Weapon, MythicalWeaponStore} from '../mythical_weapon';

const store = new MythicalWeaponStore;

describe('Mythical Weapon Model', () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('index method should return a list of products', async() => {
        const result = await store.index();
        expect(result).toEqual([]);
    })
})