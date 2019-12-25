import Observer from '../src/ts/Observer/Observer';

describe('Observer', () => {
  it('implements event subscribing and notifying', () => {
    const observer = new Observer();

    let counter = 0;
    const callback = () => { counter += 1; };

    observer.on('some.event', callback);

    expect(counter).toEqual(0);

    observer.trigger('some.event');

    expect(counter).toEqual(1);
  });

  it('transmitted data', () => {
    const observer = new Observer();

    let counter = 0;
    const callback = (delta) => { counter += delta; };

    observer.on('some.event', callback);

    expect(counter).toEqual(0);

    observer.trigger('some.event', 42);

    expect(counter).toEqual(42);
  });
});