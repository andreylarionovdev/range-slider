import Observer from './Observer';

describe('Observer', () => {
  it('implements event subscribing and notifying', () => {
    const observer = new Observer();

    let counter = 0;
    const callback = (): void => { counter += 1; };

    observer.on('some.event', callback);

    expect(counter).toEqual(0);

    observer.trigger('some.event');

    expect(counter).toEqual(1);
  });

  it('transmitted data', () => {
    const observer = new Observer();

    let counter = 0;
    const callback = (delta): void => { counter += delta; };

    observer.on('some.event', callback);

    expect(counter).toEqual(0);

    observer.trigger('some.event', 42);

    expect(counter).toEqual(42);
  });
});
