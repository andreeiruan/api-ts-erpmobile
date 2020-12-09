import { Cryptography } from '@helpers/Cryptography'
import { ConflictError } from '@helpers/errors/conflictError'
import { InvalidParamError } from '@helpers/errors/InvalidParamError'
import { MissingParamError } from '@helpers/errors/missingParamError'
import { HttpResponse, IHttpResponse } from '@helpers/HttpResponse'
import { IUserAttributes, IUserRepository } from '@repositories/interfaces/IUserRepository'

export class SignUpUseCase {
  private readonly _userRepository: IUserRepository
  constructor (userRepository: IUserRepository) {
    this._userRepository = userRepository
  }

  async execute (data: IUserAttributes): Promise<IHttpResponse> {
    try {
      const { name, email, password, confirmPassword } = data
      if (!name) {
        return HttpResponse.badRequest(new MissingParamError('name'))
      }

      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }

      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }

      if (password !== confirmPassword) {
        return HttpResponse.badRequest(new InvalidParamError('passwords do not match'))
      }

      const userExists = await this._userRepository.findByEmail(email)
      if (userExists) {
        return HttpResponse.conflict(new ConflictError('User by email already exists'))
      }

      const hashPassword = await Cryptography.criptPassword(password)
      const user = await this._userRepository.create({ name, email, password: hashPassword })

      user.password = undefined

      return HttpResponse.created(user)
    } catch (error) {
      return HttpResponse.serverError(error)
    }
  }
}
