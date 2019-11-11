import { Slider } from '../src/ts/slider';

describe('Slider', () => {
  it('can create', () => {
    const slider: Slider = new Slider();
    expect(slider).not.toBe(null);
  });

  it('log() works', () => {
    const slider: Slider = new Slider();
    const returnValue = slider.log('test');
    expect(returnValue).toEqual('test');
  });
});