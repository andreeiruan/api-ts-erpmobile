import 'reflect-metadata'
import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import { routerProducts, routerSales, routerShipment, routerUser } from './routes'
import Bullboard from 'bull-board'
// import cluster from './middlewares/cluster'

import 'dotenv/config'

import '../database/connect'
import { Queue } from '@providers/Queue'

class Application {
  public readonly app: express.Application

  constructor () {
    this.app = express()
    Bullboard.setQueues(Queue.instance().queues.map(queue => queue.bull))
    this._middlewares()
    this._routes()
  }

  private _middlewares () {
    this.app.use((req, res, next) => {
      res.set('X-Powered-By', 'PHP/7.1.7')
      return next()
    })
    this.app.use(express.json())
    this.app.use(compression())
    this.app.use(morgan('dev'))
    this.app.use('/admin/queue', Bullboard.UI)
    // this.app.use(cluster)
  }

  private _routes () {
    this.app.use('/api', routerUser)
    this.app.use('/api', routerProducts)
    this.app.use('/api', routerShipment)
    this.app.use('/api', routerSales)
  }
}

export default new Application().app
