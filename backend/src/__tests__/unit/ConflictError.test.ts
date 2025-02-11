import { ConflictError } from "../../errors/ConflictError";

describe('ConflictError', () => {
    it('should create an instance of ConflictError', () => {
        const error = new ConflictError('Resource conflict');
        expect(error).toBeInstanceOf(ConflictError);
    });

    it('should set the message property', () => {
        const error = new ConflictError('Resource conflict');
        expect(error.message).toBe('Resource conflict');
    });

    it('should set the status property to 409', () => {
        const error = new ConflictError('Resource conflict');
        expect(error.status).toBe(409);
    });

    it('should set the name property to ConflictError', () => {
        const error = new ConflictError('Resource conflict');
        expect(error.name).toBe('ConflictError');
    });
});
