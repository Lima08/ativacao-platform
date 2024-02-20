export default class CustomError extends Error {
  public code: number
  public meta: any

  constructor(message: string, code: number, meta?: any) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.meta = meta

    Error.captureStackTrace(this, this.constructor)
  }
}
