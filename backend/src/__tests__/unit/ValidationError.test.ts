import {ValidationError} from "../../errors/ValidationError";

describe('ValidationError', () => {
    it('should create an instance of ValidationError', () => {
        const error = new ValidationError('Validation error');
        expect(error).toBeInstanceOf(ValidationError);
    });

    it('should set the message property', () => {
        const error = new ValidationError('Validation error');
        expect(error.message).toBe('Validation error');
    });

    it('should set the status property to 400', () => {
        const error = new ValidationError('Validation error');
        expect(error.status).toBe(400);
    });

    it('should set the name property to ValidationError', () => {
        const error = new ValidationError('Validation error');
        expect(error.name).toBe('ValidationError');
    });
});