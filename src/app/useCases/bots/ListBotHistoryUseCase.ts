import { ServerError } from '@helpers/errors/serverError'
import { HttpResponse, IHttpResponse } from '@helpers/HttpResponse'
import { appLogger } from '@helpers/Logger'
import { IBotHistoryRepository } from '@repositories/interfaces/IBotHistoryRepository'

export class ListBotHistoryUseCase {
  private readonly _botHistoryRepository: IBotHistoryRepository

  constructor (botHistoryRepository: IBotHistoryRepository) {
    this._botHistoryRepository = botHistoryRepository
  }

  async execute (userId: string): Promise<IHttpResponse> {
    try {
      const botHistory = await this._botHistoryRepository.find(userId)

      return HttpResponse.ok(botHistory)
    } catch (error) {
      appLogger.logError({ error: error.message, filename: __filename, params: { userId } })
      return HttpResponse.serverError(new ServerError())
    }
  }
}
