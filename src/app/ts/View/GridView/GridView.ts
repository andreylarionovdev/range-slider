import State from '../../Interfaces/State';
import Model from '../../Model/Model';

const template = require('./GridView.pug');

class GridView {
  private $slider: JQuery;

  private $element: JQuery;

  constructor($slider: JQuery, state: State) {
    this.$slider = $slider;
    this.init(state);
  }

  private init(state: State): void {
    const ticks = this.getTicks(state);
    this.$element = template({ ticks });
    this.$slider.append(this.$element);
  }

  private getTicks(state: State): Array<object> {
    const { min, max, gridDensity = 1 } = state;
    const ticks = [];
    /** % */
    const step = Math.floor(100 / gridDensity);
    const cssProp = this.isVertical() ? 'top' : 'left';
    for (let progress = 0; progress < 100; progress += step) {
      ticks.push({
        position: `${cssProp}:${progress}%`,
        value: Model.percentToValue(min, max, progress),
      });
    }
    ticks.push({
      position: `${cssProp}:100%`,
      value: max,
    });

    return ticks;
  }

  private isVertical(): boolean {
    return this.$slider.hasClass('range-slider_orientation_vertical');
  }
}

export default GridView;
