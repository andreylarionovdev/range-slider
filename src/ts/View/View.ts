import $ from 'jquery';

import Observer from '../Observer/Observer';
import { HANDLE_RADIUS } from '../const';

import State from '../Interfaces/State';
import SliderView from '../Interfaces/SliderView';
import SliderViewObservable from '../Interfaces/SliderViewObservable';
import Observable from '../Interfaces/Observable';

class View implements SliderView, SliderViewObservable {
  announcer: Observable;

  // DOM elements
  private $target: JQuery;

  private $slider: JQuery;

  private $input: JQuery;

  private $handleFrom: JQuery;

  private $handleTo: JQuery;

  private $selection: JQuery;

  private $draggingHandle: JQuery;

  private $configView: JQuery;

  // Classes
  private static block = 'range-slider';

  private static blockVert = `${View.block}--vertical`;

  private static blockWithBubble = `${View.block}--with-bubble`;

  private static conf = `${View.block}__conf`;

  private static confLabel = `${View.block}__conf-label`;

  private static confInput = `${View.block}__conf-input`;

  private static confInputG = `${View.block}__conf-input-group`;

  private static input = `${View.block}__input`;

  private static rail = `${View.block}__rail`;

  private static visibleRail = `${View.block}__rail--visible`;

  private static selection = `${View.block}__selection`;

  private static handle = `${View.block}__handle`;

  private static bubble = `${View.block}__bubble`;

  private static handleFrom = `${View.handle}--from`;

  private static handleTo = `${View.handle}--to`;

  // Mouse listeners to bind/unbind with class context
  private funcOnDragStart = (e): void => this.dragStart(e);

  private funcOnDrag = (e): void => this.drag(e);

  private funcOnDragEnd = (e): void => this.dragEnd(e);

  private funcOnJump = (e): void => this.jump(e);

  private funcOnChangeConfig = (e): void => this.changeConfig(e);

  constructor($target: JQuery) {
    this.announcer = new Observer();
    this.$target = $target;
  }

  update(state: State): void {
    this
      .renderMainView(state)
      .renderConfigView(state);
  }

  updateValues(state: State): void {
    const {
      value, value2, range, showBubble, showConfig,
    } = state;

    if (showBubble) {
      this.$handleFrom.find(`.${View.bubble}`).text(value);
      if (range) {
        this.$handleTo.find(`.${View.bubble}`).text(value2);
      }
    }

    if (showConfig) {
      this.$configView.find('input[name="value"]').val(value);
      this.$configView.find('input[name="value2"]').val(value2);
    }
  }

  moveHandle(state: State): void {
    const { min, max, range } = state;

    const value = this.$draggingHandle.hasClass(View.handleTo)
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

  onDrag(callback): void {
    this.announcer.on('drag', callback);
  }

  onJump(callback): void {
    this.announcer.on('jump', callback);
  }

  onChangeConfig(callback): void {
    this.announcer.on('change.config', callback);
  }

  private changeConfig(e): void {
    const $input = $(e.currentTarget);
    const checkboxes = ['vertical', 'range', 'showConfig', 'showBubble'];

    const key = $input.attr('name');
    const value = checkboxes.includes(key)
      ? $input.is(':checked')
      : $input.val();

    this.announcer.trigger('change.config', key, value);
  }

  private jump(e): void {
    const cursorPositionPercent = this.getCursorPositionPercent(e);
    let key = 'value';

    this.$draggingHandle = this.$handleFrom;

    // If second handle exists,
    // determine handle that closest to cursor to move it
    if (this.$handleTo) {
      const fromHandlePercent = this.getHandlePositionPercent(this.$handleFrom);
      const toHandlePercent = this.getHandlePositionPercent(this.$handleTo);

      const distFrom = Math.abs(cursorPositionPercent - fromHandlePercent);
      const distTo = Math.abs(cursorPositionPercent - toHandlePercent);

      if (distFrom > distTo) {
        this.$draggingHandle = this.$handleTo;
        key = 'value2';
      }
    }

    this.announcer.trigger('jump', key, null, { percent: cursorPositionPercent });
  }

  private drag(e): void {
    if (this.$draggingHandle) {
      e.preventDefault();
      const key = this.$draggingHandle.hasClass(View.handleTo)
        ? 'value2'
        : 'value';
      this.announcer.trigger('drag', key, null, {
        percent: this.getCursorPositionPercent(e),
      });
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

  private renderMainView(state: State): this {
    if (!this.$slider) {
      this.$slider = View.createSlider();
      this.$target.after(this.$slider).hide();
    }

    View.updateSlider(this.$slider, state);

    if (this.$input) {
      this.destroyInput();
    }

    this.$input = View.createInput()
      .on('mousedown', this.funcOnJump)
      .appendTo(this.$slider);

    const $visibleRail = View.createRail([View.visibleRail, View.rail])
      .appendTo(this.$input);

    const $rail = View.createRail()
      .appendTo(this.$input);

    if (state.range) {
      this.$selection = View.createSelection()
        .appendTo($visibleRail);
    }

    this.$handleFrom = View.createHandle('from', state)
      .on('mousedown', this.funcOnDragStart)
      .appendTo($rail);

    if (state.range) {
      this.$handleTo = View.createHandle('to', state)
        .on('mousedown', this.funcOnDragStart)
        .appendTo($rail);
    }

    this.bindDocumentEvents();
    this.updateHandles(state);

    return this;
  }

  private renderConfigView(state: State): this {
    if (this.$configView) {
      if (state.showConfig) {
        this.updateConfigView(state);
      } else {
        this.$configView.remove();
      }
    } else if (state.showConfig) {
      this.$configView = this.createConfigView(state);
      this.$slider.append(this.$configView);
    }

    return this;
  }

  private createConfigView(state: State): JQuery {
    const $configView = $('<code/>').addClass(View.conf);

    $configView
      .append(
        $('<p/>').html('<b>const</b> options = {'),
      );

    const $inputGroups: Array<JQuery> = Object.keys(state).map(
      (key) => this.createConfigInputGroup(key, state[key]),
    );

    $configView
      .append($inputGroups)
      .append($('<p/>').html('}'));

    return $configView;
  }

  private updateConfigView(state: State): void {
    Object.keys(state).map((key) => this.updateConfigInputGroup(key, state[key]));
  }

  private updateConfigInputGroup(key: string, value: boolean|number|null): void {
    const $input = this.$configView.find(`input[name="${key}"]`);
    if ($input) {
      if (typeof value === 'boolean') {
        $input.prop('checked', value);
      } else {
        $input.val(value);
      }
    }
  }

  private createConfigInputGroup(key: string, value: boolean|number|null): JQuery {
    const $inputGroup = $('<div/>').addClass(View.confInputG);

    $('<label/>')
      .addClass(View.confLabel)
      .html(`${key}:`)
      .attr('for', key)
      .appendTo($inputGroup);
    const $input = $('<input>')
      .addClass(View.confInput)
      .attr('name', key);

    switch (typeof value) {
      case 'boolean':
        $input.attr('type', 'checkbox');
        if (value === true) {
          $input.prop('checked', true);
        }
        $input.on('change', this.funcOnChangeConfig);
        break;
      case 'number':
        $input.attr('type', 'text')
          .val(value)
          .on('blur', this.funcOnChangeConfig);
        break;
      default:
        $input.attr({
          type: 'text',
          placeholder: 'null',
        }).on('blur', this.funcOnChangeConfig);
    }

    $input.appendTo($inputGroup);

    return $inputGroup;
  }

  private destroyInput(): this {
    if (this.$input) {
      this.$handleFrom.off('mousedown', this.funcOnDragStart);
      if (this.$handleTo) {
        this.$handleTo.off('mousedown', this.funcOnDragStart);
      }
      this.$input.off('mousedown', this.funcOnJump).remove();
    }

    return this;
  }

  private static createSlider(): JQuery {
    return $('<div/>').addClass(View.block);
  }

  private static updateSlider($slider: JQuery, state: State): void {
    if (state.vertical) {
      $slider.addClass(View.blockVert);
    } else {
      $slider.removeClass(View.blockVert);
    }
    if (state.showBubble) {
      $slider.addClass(View.blockWithBubble);
    } else {
      $slider.removeClass(View.blockWithBubble);
    }
  }

  private static createInput(): JQuery {
    return $('<div/>').addClass(View.input);
  }

  private static createSelection(): JQuery {
    return $('<div/>').addClass(View.selection);
  }

  private updateSelection(position): void {
    const $handle = this.$draggingHandle;
    let updatedPosition = position;
    let prop;
    if ($handle.hasClass(View.handleFrom)) {
      prop = this.isVertical() ? 'top' : 'left';
    } else {
      prop = this.isVertical() ? 'bottom' : 'right';
      updatedPosition = 100 - position;
    }
    this.$selection.css({
      [prop]: `${updatedPosition}%`,
    });
  }

  private static createRail(classes: Array<string> = [View.rail]): JQuery {
    return $('<div/>').addClass(classes);
  }

  private static createHandle(type: string, state: State): JQuery {
    const $handle = $('<a/>').addClass(View.handle);
    let handleClass = View.handleFrom;
    if (type === 'to') {
      handleClass = View.handleTo;
    }
    $handle.addClass(handleClass);

    if (state.showBubble) {
      const $bubble = $('<div/>').addClass(View.bubble).text(
        type === 'to' ? state.value2 : state.value,
      );

      $handle.append($bubble);
    }

    return $handle;
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

  private bindDocumentEvents(): void {
    $(document)
      .off('mouseup', this.funcOnDragEnd)
      .on('mouseup', this.funcOnDragEnd)
      .off('mousemove', this.funcOnDrag)
      .on('mousemove', this.funcOnDrag);
  }

  private isVertical(): boolean {
    return this.$slider.hasClass(View.blockVert);
  }

  private getCursorPositionPercent(e: MouseEvent): number {
    let position; // cursor position in px relative to slider
    let percent; // cursor position in percent relative to slider
    const $rail = this.$slider.find(`.${View.rail}`);
    if (this.isVertical()) {
      position = e.pageY - $rail.offset().top - HANDLE_RADIUS;
      percent = position / ($rail.height() / 100);

      return percent;
    }
    position = e.pageX - $rail.offset().left - HANDLE_RADIUS;
    percent = position / ($rail.width() / 100);

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
