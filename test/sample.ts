import Model from '../src/ts/Model/Model';

describe('Model', () => {
  it('can create', () => {
    const model: Model = new Model();
    expect(model).not.toBe(null);
  });

  it('echo() works', () => {
    const model: Model = new Model();
    let echo = model.echo('test');
    expect(echo).toEqual('test');
  });
});