// eslint-disable-next-line no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      session_id?: string
      email: string
      password: string
      streak: number
      meals: {
        user: string
        id: string
        name: string
        description: string
        created_at: string
        password: string
        is_diet: boolean
      }[]
    }
    meals: {
      user: string
      id: string
      name: string
      description: string
      created_at: string
      password: string
      is_diet: boolean
    }
  }
}
