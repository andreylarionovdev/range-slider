import $ from 'jquery';
import State from '../../Interfaces/State';
import BubbleView from '../BubbleView/BubbleView';

const template = require('./RangeBubbleView.pug');

class RangeBubbleView extends BubbleView {
  update(state: State): void {
    const { value, value2 } = state;

    this.$element.text(value === value2 ? value : `${value}-${value2}`);
  }

  protected init(state: State): void {
    this.type = 'range';
    this.$element = $(template({ state }));
    this.$handle.append(this.$element);
  }
}

export default RangeBubbleView;
