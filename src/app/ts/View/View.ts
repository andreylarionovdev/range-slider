import $ from 'jquery';

import Observer from '../Observer/Observer';

import State from '../Interfaces/State';
import SliderView from '../Interfaces/SliderView';
import SliderViewObservable from '../Interfaces/SliderViewObservable';
import Observable from '../Interfaces/Observable';
import SliderViewExtraData from '../Interfaces/SliderViewExtraData';

const template = require('./View.pug');

class View implements SliderView, SliderViewObservable {
  announcer: Observable;

  // DOM elements
  private $target: JQuery;

  private $slider: JQuery;

  private $track: JQuery;

  private $handleFrom: JQuery;

  private $handleTo: JQuery;

  private $selection: JQuery;

  private $draggingHandle: JQuery;

  private $config: JQuery;

  private handleDragStart = (e): void => this.dragStart(e);

  private handleDrag = (e): void => this.drag(e);

  private handleDragEnd = (e): void => this.dragEnd(e);

  private handleJump = (e): void => this.jump(e);

  private handleChangeConfig = (e): void => this.changeConfig(e);

  constructor($target: JQuery, state: State) {
    this.announcer = new Observer();
    this.$target = $target;
    this.render(state);
  }

  render(state: State): void {
    this.$slider = $(template({ state }));
    this.$target.after(this.$slider).hide();

    this.$track = this.$slider.find('.js-range-slider__track');
    this.$handleFrom = this.$slider.find('.js-range-slider__handle_type_from');
    this.$handleTo = this.$slider.find('.js-range-slider__handle_type_to');
    this.$selection = this.$slider.find('.js-range-slider__selection');

    this.$config = this.$slider.find('.js-range-slider__config');

    this.bindDocumentEvents();
  }

  update(state: State, redraw?: boolean): this {
    if (redraw === true) {
      this.render(state);
    }
    this.updateHandles(state);

    return this;
  }

  moveHandle(state: State): void {
    const { min, max, range } = state;

    const value = this.$draggingHandle.hasClass('js-range-slider__handle_type_to')
      ? state.value2
      : state.value;

    const position = View.validatePosition(View.valueToPosition(min, max, value));

    this.$draggingHandle.css({
      [this.isVertical() ? 'top' : 'left']: `${position}%`,
    });
    if (range) {
      this.updateSelection(position);
    }
  }

  updateValues(state: State): void {
    const {
      value, value2, range, showBubble, showConfig,
    } = state;

    if (showBubble) {
      this.$handleFrom.find('.js-range-slider__bubble').text(value);
      if (range) {
        this.$handleTo.find('.js-range-slider__bubble').text(value2);
      }
    }

    if (showConfig) {
      this.$config.find('input[name="value"]').val(value);
      this.$config.find('input[name="value2"]').val(value2);
    }
  }

  onChange(callback): void {
    this.announcer.on('drag', callback);
    this.announcer.on('jump', callback);
    this.announcer.on('change.config', callback);
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

  private jump(e): void {
    const cursorPositionPercent = this.getCursorPositionPercent(e);
    let key = 'value';

    this.$draggingHandle = this.$handleFrom;

    /**
     * If second handle exists, determine handle that closest to cursor to move it
     */
    if (this.$handleTo.length === 1) {
      const fromHandlePercent = this.getHandlePositionPercent(this.$handleFrom);
      const toHandlePercent = this.getHandlePositionPercent(this.$handleTo);

      const distFrom = Math.abs(cursorPositionPercent - fromHandlePercent);
      const distTo = Math.abs(cursorPositionPercent - toHandlePercent);

      if (distFrom > distTo) {
        this.$draggingHandle = this.$handleTo;
        key = 'value2';
      }
    }

    const state: State = { [key]: null };
    const extra: SliderViewExtraData = { percent: cursorPositionPercent };

    this.announcer.trigger('jump', state, extra);
  }

  private drag(e): void {
    if (this.$draggingHandle) {
      e.preventDefault();
      const key = this.$draggingHandle.hasClass('js-range-slider__handle_type_to')
        ? 'value2'
        : 'value';

      const state: State = { [key]: null };
      const extra: SliderViewExtraData = { percent: this.getCursorPositionPercent(e) };

      this.announcer.trigger('drag', state, extra);
    }
  }

  private dragStart(e): void {
    e.stopPropagation();
    e.preventDefault();

    this.$draggingHandle = $(e.currentTarget);
  }

  private dragEnd(e): void {
    e.preventDefault();
    if (this.$draggingHandle) {
      this.$draggingHandle = null;
    }
  }

  private updateHandles(state: State): void {
    this.$draggingHandle = this.$handleFrom;
    this.moveHandle(state);
    if (state.range) {
      this.$draggingHandle = this.$handleTo;
      this.moveHandle(state);
    }

    this.$draggingHandle = null;
  }

  private updateSelection(position): void {
    const $handle = this.$draggingHandle;
    let updatedPosition = position;
    let prop;
    if ($handle.hasClass('js-range-slider__handle_type_from')) {
      prop = this.isVertical() ? 'top' : 'left';
    } else {
      prop = this.isVertical() ? 'bottom' : 'right';
      updatedPosition = 100 - position;
    }
    this.$selection.css({
      [prop]: `${updatedPosition}%`,
    });
  }

  private bindDocumentEvents(): void {
    this.$track.on('mousedown', this.handleJump);
    this.$handleFrom.on('mousedown', this.handleDragStart);
    this.$handleTo.on('mousedown', this.handleDragStart);
    this.$config.find('.js-range-slider__config-input_type_text').on('blur', this.handleChangeConfig);
    this.$config.find('.js-range-slider__config-input_type_checkbox').on('change', this.handleChangeConfig);

    $(document)
      .off('mouseup', this.handleDragEnd)
      .on('mouseup', this.handleDragEnd)
      .off('mousemove', this.handleDrag)
      .on('mousemove', this.handleDrag);
  }

  private isVertical(): boolean {
    return this.$slider.hasClass('js-range-slider_orientation_vertical');
  }

  private getCursorPositionPercent(e: MouseEvent): number {
    let position; // cursor position in px relative to slider
    let percent; // cursor position in percent relative to slider
    const $track = this.$slider.find('.range-slider__track');
    if (this.isVertical()) {
      position = e.pageY - $track.offset().top;
      percent = position / ($track.height() / 100);

      return percent;
    }
    position = e.pageX - $track.offset().left;
    percent = position / ($track.width() / 100);

    return percent;
  }

  private getHandlePositionPercent($handle: JQuery): number {
    const prop = this.isVertical() ? 'top' : 'left';

    return parseInt($handle.prop('style')[prop], 10);
  }

  private static valueToPosition(min: number, max: number, value: number): number {
    const range = max - min;

    return ((value - min) * 100) / range;
  }

  private static validatePosition(position: number): number {
    const boundStart = 0;
    const boundEnd = 100;

    let updatedPosition = position;

    if (position > boundEnd) {
      updatedPosition = boundEnd;
    }
    if (position < boundStart) {
      updatedPosition = boundStart;
    }

    return updatedPosition;
  }
}

export default View;
