import $ from 'jquery';
import State from '../../Interfaces/State';
import Observable from '../../Interfaces/Observable';
import Observer from '../../Observer/Observer';

const template = require('./ConfigView.pug');

class ConfigView {
  private announcer: Observable;

  private $slider: JQuery;

  private $element: JQuery;

  private handleChangeConfig = (e): void => this.changeConfig(e);

  constructor($slider: JQuery, state: State) {
    this.announcer = new Observer();
    this.$slider = $slider;
    this.render(state);
  }

  render(state: State): void {
    this.$element = $(template({ state }));
    this.$slider.append(this.$element);

    this.bindDocumentEvents();
  }

  update(state: State): void {
    const { value, value2 } = state;
    this.$element.find('input[name="value"]').val(value);
    this.$element.find('input[name="value2"]').val(value2);
  }

  onChange(callback): void {
    this.announcer.on('change.config', callback);
  }

  private bindDocumentEvents(): void {
    this.$element.find('.js-range-slider__config-input_type_text').on('blur', this.handleChangeConfig);
    this.$element.find('.js-range-slider__config-input_type_checkbox').on('change', this.handleChangeConfig);
  }

  private changeConfig(e): void {
    const $input = $(e.currentTarget);
    const checkboxes = ['vertical', 'range', 'showConfig', 'showBubble'];

    const key = $input.attr('name');
    const value = checkboxes.includes(key)
      ? $input.is(':checked')
      : $input.val();

    const state: State = { [key]: value };

    this.announcer.trigger('change.config', state);
  }
}

export default ConfigView;
