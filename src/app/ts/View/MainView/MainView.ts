import $ from 'jquery';

import Observer from '../../Observer/Observer';

import State from '../../Interfaces/State';
import SliderView from '../../Interfaces/SliderView';
import SliderViewObservable from '../../Interfaces/SliderViewObservable';
import Observable from '../../Interfaces/Observable';
import SliderViewExtraData from '../../Interfaces/SliderViewExtraData';
import SliderModelExtraData from '../../Interfaces/SliderModelExtraData';
import HandleView from '../HandleView/HandleView';
import SelectionView from '../SelectionView/SelectionView';
import GridView from '../GridView/GridView';

const template = require('./MainView.pug');

class MainView implements SliderView, SliderViewObservable {
  announcer: Observable;

  private $target: JQuery;

  private $element: JQuery;

  private $track: JQuery;

  private $handleFrom: JQuery;

  private $handleTo: JQuery;

  private $selection: JQuery;

  private $draggingHandle: JQuery;

  private handleFromView: HandleView;

  private handleToView: HandleView;

  private selectionView: SelectionView;

  private gridView: GridView;

  private handleDragStart = (e): void => this.announceJump(e);

  private handleDrag = (e): void => this.announceDrag(e);

  private handleDragEnd = (e): void => this.dragEnd(e);

  constructor($target: JQuery, state: State) {
    this.announcer = new Observer();
    this.$target = $target;
    this.init(state);
  }

  update(state: State, extra: SliderModelExtraData): this {
    const { redraw } = extra;

    if (redraw === true) {
      this.init(state);
    }

    const {
      min, max, value, value2,
    } = state;

    const fromPosition = MainView.valueToPercent(min, max, value);
    const toPosition = MainView.valueToPercent(min, max, value2);

    this.handleFromView.update(state, fromPosition);
    if (typeof this.handleToView !== 'undefined') {
      this.handleToView.update(state, toPosition);
    }

    if (typeof this.selectionView !== 'undefined') {
      this.selectionView.update(fromPosition, toPosition);
    }

    return this;
  }

  onChange(callback): void {
    this.announcer.on('change.view', callback);
  }

  private init(state: State): void {
    if (this.$element) {
      this.$element.remove();
    }
    this.$element = $(template({ state }));
    this.$target.after(this.$element).hide();

    this.handleFromView = new HandleView(this.$element, state);

    const { range, showGrid } = state;

    if (range) {
      this.handleToView = new HandleView(this.$element, state);
      this.selectionView = new SelectionView(this.$element);
    }
    if (showGrid) {
      this.gridView = new GridView(this.$element, state);
      this.gridView.onClickTick((value) => this.announceClickTick(value));
    }

    this.$track = this.$element.find('.js-range-slider__track');
    this.$handleFrom = this.$element.find('.js-range-slider__handle_type_from');
    this.$handleTo = this.$element.find('.js-range-slider__handle_type_to');
    this.$selection = this.$element.find('.js-range-slider__selection');

    this.bindDocumentEvents();
  }

  private announceJump(e: MouseEvent): void {
    const cursorPosition = this.getCursorPosition(e);

    let statePropName = 'value';

    if (typeof this.handleToView !== 'undefined') {
      statePropName = MainView.getClosestValuePropName(
        cursorPosition,
        this.handleFromView.getCurrentPosition(),
        this.handleToView.getCurrentPosition(),
      );
    }
    this.$draggingHandle = statePropName === 'value' ? this.$handleFrom : this.$handleTo;

    const state: State = { [statePropName]: null };
    const extra: SliderViewExtraData = { percent: cursorPosition };

    this.announcer.trigger('change.view', state, extra);
  }

  private announceDrag(e: MouseEvent): void {
    e.preventDefault();
    if (this.$draggingHandle) {
      const statePropName = this.$draggingHandle.hasClass('js-range-slider__handle_type_to')
        ? 'value2'
        : 'value';

      const state: State = { [statePropName]: null };
      const extra: SliderViewExtraData = { percent: this.getCursorPosition(e) };

      this.announcer.trigger('change.view', state, extra);
    }
  }

  private announceClickTick(value: number): void {
    const statePropName = typeof this.handleToView !== 'undefined'
      ? MainView.getClosestValuePropName(value,
        this.handleFromView.getCurrentValue(),
        this.handleToView.getCurrentValue())
      : 'value';
    const state: State = { [statePropName]: value };
    this.announcer.trigger('change.view', state);
  }

  private dragEnd(e: MouseEvent): void {
    e.preventDefault();
    if (this.$draggingHandle) {
      this.$draggingHandle = null;
    }
  }

  private getCursorPosition(e: MouseEvent): number {
    const $track = this.$element.find('.range-slider__track');

    const cursorPositionPx = this.isVertical() ? e.pageY : e.pageX;
    const trackOffsetPx = this.isVertical() ? $track.offset().top : $track.offset().left;
    const percentUnitPx = this.isVertical() ? $track.height() / 100 : $track.width() / 100;

    return (cursorPositionPx - trackOffsetPx) / percentUnitPx;
  }

  private isVertical(): boolean {
    return this.$element.hasClass('js-range-slider_orientation_vertical');
  }

  private bindDocumentEvents(): void {
    this.$track.on('mousedown', this.handleDragStart);

    $(document)
      .off('mouseup', this.handleDragEnd)
      .on('mouseup', this.handleDragEnd)
      .off('mousemove', this.handleDrag)
      .on('mousemove', this.handleDrag);
  }

  static checkBoundaries(position: number): number {
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

  static valueToPercent(min: number, max: number, value: number): number {
    const range = max - min;

    return MainView.checkBoundaries(((value - min) * 100) / range);
  }

  static getClosestValuePropName(target: number, fromValue: number, toValue: number): string {
    const distFrom = Math.abs(target - fromValue);
    const distTo = Math.abs(target - toValue);

    if (distFrom > distTo) {
      return 'value2';
    }

    return 'value';
  }
}

export default MainView;
