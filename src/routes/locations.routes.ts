import { Router } from 'express';
import multer from 'multer';
import knex from '../database/connection';
import multerConfig from '../config/multer';

const locationsRouter = Router();

const upload = multer(multerConfig);

//Busca dados da location por ID
locationsRouter.get('/', async (request, response) => {
    const { city, uf, items } = request.query;

    if (city && uf && items) {

        const parsedItems: Number[] = String(items).split(',').map(item => Number(item.trim()));

        const locations = await knex('locations')
            .join('location_items', 'locations.id', '=', 'location_items.location_id')
            .whereIn('location_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('locations.*');

        return response.json(locations);

    } else {
        const locations = await knex('locations').select('*');

        return response.json(locations);
    }
});

//Busca dados da location por ID
locationsRouter.get('/:id', async (request, response) => {
    const { id } = request.params;

    const location = await knex('locations').where('id', id).first();

    if (!location) {
        return response.status(400).json({ message: 'Location não encontrada' });
    }

    const items = await knex('items')
        .join('location_items', 'items.id', '=', 'location_items.item_id')
        .where('location_items.location_id', id)
        .select('items.title')

    return response.json({ location, items });
});

//Inserir arquivos na tabela locations
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

    const locationItems = items
        .map((item_id: number) => {
            const selectedItem = transaction('items').where('id', item_id).first();

            if (!selectedItem) {
                return response.status(400).json({ message: 'Item not found.' });
            }

            return {
                item_id,
                location_id
            }
        });

    await transaction('location_items').insert(locationItems);

    await transaction.commit();

    return response.json({
        id: location_id,
        ...location
    });

});

locationsRouter.put('/:id', upload.single('image'), async (request, response) => {

    const { id } = request.params;

    const image = request.file?.filename;

    const location = await knex('locations').where('id', id).first();

    if (!location) {
        return response.status(400).json({ message: 'Location não encontrada.' });
    }

    const locationUpdated = {
        ...location, image
    };

    await knex('locations').update(locationUpdated).where('id', id);

    return response.json(locationUpdated);

});

export default locationsRouter;