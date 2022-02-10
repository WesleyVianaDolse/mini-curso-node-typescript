import { Router } from 'express';
import knex from '../database/connection';

const locationsRouter = Router();

locationsRouter.get('/', async (request, response) => {
    const locations = await knex('locations').select('*');

    const serializedItems = locations.map(location => {
        return {
            id: location.id,
            name: location.name,
            email: location.email,
            whatsapp: location.whatsapp,
            city: location.city,
            uf: location.uf
        }
    });

    return response.json(serializedItems);
});

locationsRouter.post('/', async (request, response) => {
    const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items
    } = request.body;

    const location = {
        image: "fake-image.jpg",
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
    };

    const transaction = await knex.transaction();

    const newIds = await transaction('locations').insert(location);

    const location_id = newIds[0];
    [1, 3, 7]
    const locationItems = items.map(async (item_id: number) => {
        const selectedItem = await transaction('items').where('id', item_id).first();

        if (!selectedItem) {
            return response.status(400).json({ message: 'Item não encontrado.' });
        }

        return {
            item_id,
            location_id
        }
    });

    console.log(locationItems);

    await transaction('location_items').insert(locationItems);

    await transaction.commit();

    return response.json({
        id: location_id,
        ...location
    });
});

export default locationsRouter;