import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
      CREATE TRIGGER meals_trigger
      AFTER INSERT ON meals
      FOR EACH ROW
      BEGIN
        UPDATE users
        SET meals = (
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'id', id,
            'name', name,
            'description', description,
            'is_diet', is_diet,
            'created_at', created_at
          ))
          FROM meals
          WHERE user = NEW.user
        )
        WHERE session_id = NEW.user;
      END;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
  await knex.schema.dropTable('meals')
}
