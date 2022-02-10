import { Knex } from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('locations', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('image').nullable();
        table.string('email').notNullable();
        table.string('whatsapp').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('city').notNullable();
        table.string('uf').notNullable();
    });
}

//funcção para exportar para o index
export async function down(knex: Knex) {
    return knex.schema.dropTable('locations');
}

