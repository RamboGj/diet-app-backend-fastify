import { app } from './app'

app
  .listen({
    port: 3333,
  })
  .then((app) => {
    console.log('Server Is Running...')
  })
