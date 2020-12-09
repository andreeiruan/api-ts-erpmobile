import { SignInControllerExpress } from '@controllers/SignInControllerExpress'
import { signInUseCase, signUpUseCase } from '@useCases/users'
import { Router } from 'express'
import { SignUpUseControllerExpress } from '../app/controllers/SignUpControllerExpress'

export class AppRouter {
  public readonly routes: Router

  constructor () {
    this.routes = Router()
    this._routerUsers()
  }

  private _routerUsers () {
    this.routes.post('/signup', (req, res) => new SignUpUseControllerExpress(signUpUseCase).handle(req, res))
    this.routes.post('/signin', (req, res) => new SignInControllerExpress(signInUseCase).handle(req, res))
  }
}
