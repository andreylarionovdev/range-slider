import $ from 'jquery';
import State from '../../Interfaces/State';

const template = require('./RangeBubbleView.pug');

class RangeBubbleView {
  private $handle: JQuery;

  private $element: JQuery;

  constructor($handle, state: State) {
    this.$handle = $handle;

    this.init(state);
  }

  update(state: State): void {
    const { value, value2 } = state;

    this.$element.text(`${value}-${value2}`);
  }

  private init(state: State): void {
    this.$element = $(template({ state }));
    this.$handle.append(this.$element);
  }
}

export default RangeBubbleView;
