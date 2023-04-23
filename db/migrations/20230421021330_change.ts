import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.('course_id').unsigned().notNullable()
    .references('id').inTable('courses');
  })
}

export async function down(knex: Knex): Promise<void> {}
