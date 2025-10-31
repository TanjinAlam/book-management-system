export class NotFoundWhileDeleteException extends Error {
  constructor(id: number, message: string) {
    super(message);
    this.name = 'NotFoundWhileDeleteException';

    Object.setPrototypeOf(this, NotFoundWhileDeleteException.prototype);
  }
}
