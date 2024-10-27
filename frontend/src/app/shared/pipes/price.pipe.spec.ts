import { PricePipe } from './price.pipe';

describe('PricePipe', () => {
  let pipe: PricePipe;

  beforeEach(() => {
    pipe = new PricePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return formatted price for value', () => {
    expect(pipe.transform(1234)).toBe('$12.34');
  });

  it('should transform 0 to $0.00', () => {
    expect(pipe.transform(0)).toBe('$0.00');
  });

  it('should transform 1000000 to $10,000.00', () => {
    expect(pipe.transform(1000000)).toBe('$10,000.00');
  });
});
