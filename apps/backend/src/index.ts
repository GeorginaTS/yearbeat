import 'dotenv/config'
import http from 'http'
import cors from 'cors'
import express from 'express'
import routes from './routes'
import { env } from './config/env'
import { errorHandler } from './middleware/errorHandler'
import { createSocketServer } from './socket'

const app = express()
const server = http.createServer(app)

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
)
app.use(express.json())
app.use('/api', routes)
app.use(errorHandler)

createSocketServer(server)

server.listen(env.PORT, () => {
  console.log(`YearBeat backend running on ${env.PORT}`)
})
