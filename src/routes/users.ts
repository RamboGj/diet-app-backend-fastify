import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

import * as zod from 'zod'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const createUserSchema = zod.object({
      email: zod.string(),
      password: zod.string().min(6, 'Your password is too short'),
    })

    const body = createUserSchema.parse(req.body)

    const { email, password } = body

    let sessionId = req.cookies.sessionId
    sessionId = randomUUID()

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    })

    const user = await knex('users').insert({
      id: randomUUID(),
      session_id: sessionId,
      email,
      password,
      streak: 0,
    })

    console.log('user created', user)

    return reply.status(201).send()
  })

  app.get('/', async (req, reply) => {
    const users = await knex('users').select('*')

    return {
      users,
    }
  })

  app.get('/meals', async (req, reply) => {
    const { sessionId } = req.cookies

    const userMeals = await knex('meals').where('user', sessionId).select('*')

    return {
      userMeals,
    }
  })
}
