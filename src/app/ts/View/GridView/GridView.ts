import State from '../../Interfaces/State';
import Observer from '../../Observer/Observer';
import Observable from '../../Interfaces/Observable';

const template = require('./GridView.pug');

interface Tick {
  position: string,
  value: number,
}

class GridView {
  private $slider: JQuery;

  private $element: JQuery;

  private announcer: Observable;

  constructor($slider: JQuery, state: State) {
    this.announcer = new Observer();
    this.$slider = $slider;
    this.init(state);
  }

  onClickTick(callback: (number) => void): void {
    this.announcer.on('click.tick', callback);
  }

  private init(state: State): void {
    const ticks = this.getTicks(state);
    this.$element = $(template({ ticks }));
    this.$slider.append(this.$element);

    this.bindDocumentEvents();
  }

  private bindDocumentEvents(): void {
    this.$element.find('.range-slider__grid-label').on('click', this.handleTickClick);
  }

  private handleTickClick = (e): void => {
    const value = Number($(e.target).text());
    this.announcer.trigger('click.tick', value);
  };

  private getTicks(state: State): Array<Tick> {
    const { min, max, gridDensity } = state;
    const ticks = [];
    const step = Math.round((max - min) / gridDensity);
    const cssProp = this.isVertical() ? 'top' : 'left';

    for (let currentValue = min; currentValue < max; currentValue += step > 0 ? step : 1) {
      const position = GridView.valueToPercent(min, max, currentValue);
      ticks.push({
        position: `${cssProp}:${position}%`,
        value: currentValue,
      });
    }

    if (ticks.length > gridDensity) ticks.pop();

    ticks.push({
      position: `${cssProp}:100%`,
      value: max,
    });

    return ticks;
  }

  private isVertical(): boolean {
    return this.$slider.hasClass('range-slider_orientation_vertical');
  }

  private static valueToPercent(min: number, max: number, value: number): number {
    const range = max - min;
    const boundStart = 0;
    const boundEnd = 100;

    const percent = ((value - min) * 100) / range;

    if (percent > boundEnd) return boundEnd;
    if (percent < boundStart) return boundStart;

    return percent;
  }
}

export default GridView;
