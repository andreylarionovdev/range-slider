import $ from 'jquery';

import Observer from '../../Observer/Observer';

import State from '../../Interfaces/State';
import SliderView from '../../Interfaces/SliderView';
import LayerObservable from '../../Interfaces/LayerObservable';
import Observable from '../../Interfaces/Observable';
import SliderViewExtraData from '../../Interfaces/SliderViewExtraData';
import SliderModelExtraData from '../../Interfaces/SliderModelExtraData';
import HandleView from '../HandleView/HandleView';
import BarView from '../BarView/BarView';
import GridView from '../GridView/GridView';

const template = require('./MainView.pug');

class MainView implements SliderView, LayerObservable {
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

  private barView: BarView;

  private gridView: GridView;

  private handleCenterOffset = 0;

  private handleDragStart = (e): void => this.announceJump(e);

  private handleDrag = (e): void => this.announceDrag(e);

  private handleDragEnd = (e): void => this.dragEnd(e);

  constructor($target: JQuery, state: State) {
    this.announcer = new Observer();
    this.$target = $target;
    this.init(state);
  }

  update(state: State, extra: SliderModelExtraData): this {
    const { redraw, fromPosition, toPosition } = extra;

    if (redraw === true) {
      this.init(state);
    }

    this.handleFromView.update(state, fromPosition);
    if (this.handleToView) {
      this.handleToView.update(state, toPosition);
    }

    if (this.barView) {
      this.barView.update(
        this.handleToView ? fromPosition : 0,
        this.handleToView ? toPosition : fromPosition,
      );
    }

    return this;
  }

  onChange(callback: (state: State, extra?: SliderViewExtraData) => void): void {
    this.announcer.on('change.view', callback);
  }

  private init(state: State): void {
    if (this.$element) {
      this.$element.remove();
    }
    this.$element = $(template({ state }));
    this.$target.after(this.$element).hide();

    this.handleFromView = new HandleView(this.$element, state);

    const { isRange, showGrid, showBar } = state;

    this.handleToView = isRange === true ? new HandleView(this.$element, state) : null;
    this.barView = showBar === true ? new BarView(this.$element) : null;

    if (showGrid) {
      this.gridView = new GridView(this.$element, state);
      this.gridView.onClickTick((value) => this.announceClickTick(value));
    } else {
      this.gridView = null;
    }

    this.$track = this.$element.find('.js-range-slider__track');
    this.$handleFrom = this.$element.find('.js-range-slider__handle_type_from');
    this.$handleTo = this.$element.find('.js-range-slider__handle_type_to');
    this.$selection = this.$element.find('.js-range-slider__bar');

    this.bindDocumentEvents();
  }

  private announceJump(e: MouseEvent): void {
    this.setHandleCenterOffset(e);
    const cursorPosition = this.getCursorPosition(e);

    let statePropName = 'value';

    if (this.handleToView) {
      statePropName = MainView.getClosestValuePropName(
        cursorPosition,
        this.handleFromView.getCurrentPosition(),
        this.handleToView.getCurrentPosition(),
      );
    }
    this.$draggingHandle = statePropName === 'value' ? this.$handleFrom : this.$handleTo;

    this.$handleFrom.removeClass('range-slider__handle_active js-range-slider__handle_active');
    this.$handleTo.removeClass('range-slider__handle_active js-range-slider__handle_active');
    this.$draggingHandle.addClass('range-slider__handle_active js-range-slider__handle_active');

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
    const statePropName = this.handleToView
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
      this.handleCenterOffset = 0;
    }
  }

  private getCursorPosition(e: MouseEvent): number {
    const $track = this.$element.find('.range-slider__track');

    const cursorPositionPx = this.isVertical()
      ? e.pageY
      : e.pageX;
    const trackOffsetPx = this.isVertical()
      ? $track.offset().top
      : $track.offset().left;
    const percentUnitPx = this.isVertical()
      ? $track.outerHeight() / 100
      : $track.outerWidth() / 100;

    return (cursorPositionPx - trackOffsetPx + this.handleCenterOffset) / percentUnitPx;
  }

  private setHandleCenterOffset(e: MouseEvent): void {
    const $handle = $(e.target).closest('.js-range-slider__handle');
    if ($handle.length === 1) {
      const cursorPositionPx = this.isVertical() ? e.pageY : e.pageX;
      const handleOffsetPx = this.isVertical() ? $handle.offset().top : $handle.offset().left;
      const handleDimensionPx = this.isVertical() ? $handle.outerHeight() : $handle.outerWidth();

      this.handleCenterOffset = handleOffsetPx - cursorPositionPx + handleDimensionPx / 2;
    }
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

  private static getClosestValuePropName(target: number, from: number, to: number): string {
    const distFrom = Math.abs(target - from);
    const distTo = Math.abs(target - to);

    if (distFrom === distTo) {
      return from === to && target > from ? 'value2' : 'value';
    }

    return distFrom > distTo ? 'value2' : 'value';
  }
}

export default MainView;
