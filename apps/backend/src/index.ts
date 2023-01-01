

import multipart from '@fastify/multipart'
import * as Fastify from 'fastify'
import unzip from 'unzipper'

const fastify = Fastify.fastify({ logger: true })

fastify.register(multipart)

fastify.get('/', async (_request, _reply) => {
  return {
    message: 'Welcome to Zip Uploader'
  }
})

fastify.get('/health', async (_request, _reply) => {
  return {
    message: 'OK!'
  }
})

fastify.post('/upload', async (req, reply) => {
  const file = await req.file()
  if (!file) {
    reply.status(400).send({ message: 'Invalid File' })
    return
  }

  const zip = file.file.pipe(unzip.Parse({ forceStream: true }))

  for await (const entry of zip) {
    const fileName = entry.path
    console.log(fileName)
    entry.autodrain()
  }

  return {
    message: 'Uploaded'
  }
})

fastify.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log(`Server listening at ${address}`)
})
