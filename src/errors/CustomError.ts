export default class CustomError extends Error {
  constructor(message: string, public code: number, public meta?: any) {
    super(message)
  }
}
