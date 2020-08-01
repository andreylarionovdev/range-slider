import State from '../../Interfaces/State';
import Model from '../../Model/Model';
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

  onClickTick(callback): void {
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
    /** % */
    const step = Number(100 / gridDensity);
    const cssProp = this.isVertical() ? 'top' : 'left';

    let currentPosition = 0;
    let prevPosition = 0;
    while (currentPosition < 100) {
      ticks.push({
        position: `${cssProp}:${currentPosition}%`,
        value: Model.percentToValue(min, max, currentPosition),
      });
      prevPosition = currentPosition;
      currentPosition = Math.round(currentPosition + step);
      if (currentPosition === prevPosition) {
        currentPosition += 1;
        prevPosition += 1;
      }
    }
    if (ticks.length > gridDensity) {
      ticks.pop();
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
