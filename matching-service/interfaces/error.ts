export class MissingInputError extends Error {
    constructor(msg: string) {
        super(msg);

        Object.setPrototypeOf(this, MissingInputError.prototype);
    }
}