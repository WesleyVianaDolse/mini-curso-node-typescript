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

    const newIds = await knex('locations').insert(location);

    const locationId = newIds[0];

    const locationItens = items.map((item_id: number) => {
        return {
            item_id,
            location_id: locationId
        }
    });

    await knex('location_items').insert(locationItens);

    return response.json({
        id: locationId,
        ...location
    });
});

export default locationsRouter;