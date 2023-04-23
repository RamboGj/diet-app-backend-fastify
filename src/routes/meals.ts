import { FastifyInstance } from 'fastify'

import * as zod from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const createMealSchema = zod.object({
      name: zod.string(),
      description: zod.string(),
      isDiet: zod.boolean(),
    })

    const { description, name, isDiet } = createMealSchema.parse(req.body)

    const { sessionId } = req.cookies
    console.log('session on Create', String(sessionId))

    if (!sessionId) {
      return reply.status(401).send({ message: 'No session id found.' })
    }

    const meal = await knex('meals').insert({
      user: sessionId,
      id: randomUUID(),
      name,
      description,
      is_diet: isDiet,
    })

    console.log('new meal', meal)

    return reply.status(201).send()
  })

  app.get('/:id', async (req, reply) => {
    const getUniqueMealParamsSchema = zod.object({
      id: zod.string(),
    })

    const params = getUniqueMealParamsSchema.parse(req.params)

    const { id } = params

    const meal = await knex('meals').where('id', id).first()

    if (meal) {
      return { meal }
    } else {
      return reply
        .status(400)
        .send({ error: 'Meal with the given ID was not found' })
    }
  })

  app.get('/', async (req, reply) => {
    const { sessionId } = req.cookies

    console.log('sessionId', sessionId)

    const userMeals = await knex('meals').select('*')

    return {
      userMeals,
    }
  })

  app.delete('/:id', async (req, reply) => {
    const deleteMealParamsSchema = zod.object({
      id: zod.string(),
    })

    const query = deleteMealParamsSchema.parse(req.params)

    const { sessionId } = req.cookies

    const { id } = query

    const mealToDelete = await knex('meals')
      .where({
        id,
        user: sessionId,
      })
      .delete()

    if (mealToDelete) {
      return reply.status(200).send()
    } else {
      return reply
        .status(400)
        .send({ error: 'Meal with this ID was not found' })
    }
  })

  app.put('/:id', async (req, reply) => {
    const updateMealParamsSchema = zod.object({
      id: zod.string(),
    })

    const updateMealBodySchema = zod.object({
      name: zod.string().nullable(),
      description: zod.string().nullable(),
      isDiet: zod.boolean().nullable(),
      createdAt: zod.string().nullable(),
    })

    const params = updateMealParamsSchema.parse(req.params)
    const body = updateMealBodySchema.parse(req.body)

    const { sessionId } = req.cookies
    const { name, description, isDiet, createdAt } = body

    const { id } = params

    const updatedMeal = await knex('meals')
      .where({
        id,
        user: sessionId,
      })
      .update({
        name,
        description,
        is_diet: isDiet,
        created_at: createdAt,
      })

    console.log(updatedMeal)
  })
}
