import { NotFoundError } from "../../errors/NotFoundError";

describe('NotFoundError', () => {
    it('should create an instance of NotFoundError', () => {
        const error = new NotFoundError('Resource not found');
        expect(error).toBeInstanceOf(NotFoundError);
    });

    it('should set the message property', () => {
        const error = new NotFoundError('Resource not found');
        expect(error.message).toBe('Resource not found');
    });

    it('should set the status property to 404', () => {
        const error = new NotFoundError('Resource not found');
        expect(error.status).toBe(404);
    });

    it('should set the name property to NotFoundError', () => {
        const error = new NotFoundError('Resource not found');
        expect(error.name).toBe('NotFoundError');
    });
})