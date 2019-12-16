import $ from 'jquery';
import State from '../../Interfaces/State';
import observable from '../../../../node_modules/@riotjs/observable/dist/observable';

export default class View {

  // DOM elements
  private $target         : JQuery;
  private $slider         : JQuery;
  private $input          : JQuery;
  private $handleFrom     : JQuery;
  private $handleTo       : JQuery;
  private $selection      : JQuery;
  private $draggingHandle : JQuery;

  private $configView     : JQuery;

  // Classes
  private static block            : string = 'range-slider';
  private static blockVert        : string = `${View.block}--vertical`;
  private static blockWithBubble  : string = `${View.block}--with-bubble`;

  private static conf       : string = `${View.block}__conf`;
  private static confLabel  : string = `${View.block}__conf-label`;
  private static confInput  : string = `${View.block}__conf-input`;
  private static confInputG : string = `${View.block}__conf-input-group`;

  private static input      : string = `${View.block}__input`;
  private static hiddenRail : string = `${View.block}__rail`;
  private static visibleRail: string = `${View.block}__rail--visible`;
  private static selection  : string = `${View.block}__selection`;

  private static handle     : string = `${View.block}__handle`;
  private static bubble     : string = `${View.block}__bubble`;
  private static handleFrom : string = `${View.handle}--from`;
  private static handleTo   : string = `${View.handle}--to`;

  // Thing that dealing with events between MPV layers
  private announcer: any = observable(this);

  // Mouse listeners to bind/unbind with class context
  private funcOnDragStart     = e => this.dragStart(e);
  private funcOnDrag          = e => this.drag(e);
  private funcOnDragEnd       = e => this.dragEnd(e);
  private funcOnJump          = e => this.jump(e);
  private funcOnChangeConfig  = e => this.changeConfig(e);

  constructor($target: JQuery) {
    this.$target = $target;
  }

  update(state: State): void {
    this
      .renderMainView(state)
      .renderConfigView(state);
  }

  updateValues(state: State): void {
    const {value, value2, range, showBubble, showConfig} = state;

    if (showBubble) {
      this.$handleFrom.find(`.${View.bubble}`).text(value);
      if (range) {
        this.$handleTo.find(`.${View.bubble}`).text(value2);
      }
    }

    if (showConfig) {
      this.$configView.find(`input[name="value"]`).val(value);
      this.$configView.find(`input[name="value2"]`).val(value2);
    }
  }

  onDrag(callback): void {
    this.announcer.on('drag', callback);
  }

  private drag(e): void {
    if (this.$draggingHandle) {
      e.preventDefault();
      const key = this.$draggingHandle.hasClass(View.handleTo)
        ? 'value2'
        : 'value';
      this.announcer.trigger('drag', key, null, {
        percent : this.getCursorPositionPercent(e)
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

  onJump(callback): void {
    this.announcer.on('jump', callback);
  }

  private jump(e): void {
    if (! this.$handleTo) {
      this.$draggingHandle  = this.$handleFrom;
      this.announcer.trigger('jump', 'value', null, {
        percent : this.getCursorPositionPercent(e)
      });
    }
  }

  onChangeConfig(callback): void {
    this.announcer.on('change.config', callback);
  }

  private changeConfig(e): void {
    const $input = $(e.currentTarget);
    const checkboxes = ['vertical', 'range', 'showConfig', 'showBubble'];

    const key   = $input.attr('name');
    const value = checkboxes.includes(key)
      ? $input.is(':checked')
      : $input.val();

    this.announcer.trigger('change.config', key, value);
  }

  moveHandle(state: State): void {
    const {min, max, range} = state;

    const value = this.$draggingHandle.hasClass(View.handleTo)
      ? state.value2
      : state.value;

    const position = View.validatePosition(View.valueToPosition(min, max, value));

    this.$draggingHandle.css({
      [this.isVertical() ? 'top' : 'left']: `${position}%`
    });
    if (range) {
      this.updateSelection(position);
    }
  }

  private renderMainView(state: State): this {
    if (! this.$slider) {
      this.$slider = View.createSlider();
      this.$target.after(this.$slider).hide();
    }

    View.updateSlider(this.$slider, state);

    if (this.$input) {
      this.destroyInput();
    }

    this.$input = View.createInput()
      .bind('mousedown', this.funcOnJump)
      .appendTo(this.$slider);

    let $visibleRail = View.createVisibleRail()
      .appendTo(this.$input);

    let $hiddenRail = View.createHiddenRail()
      .appendTo(this.$input);

    if (state.range) {
      this.$selection = View.createSelection()
        .appendTo($visibleRail);
    }

    this.$handleFrom = View.createHandle('from', state)
      .bind('mousedown', this.funcOnDragStart)
      .appendTo($hiddenRail);

    if (state.range) {
      this.$handleTo = View.createHandle('to', state)
        .bind('mousedown', this.funcOnDragStart)
        .appendTo($hiddenRail);
    }

    this.bindDocumentEvents();
    this.updateHandles(state);

    return this;
  }

  private renderConfigView(state: State): this {
    if (this.$configView) {
      this.updateConfigView(state);
    } else {
      this.createConfigView(state);
    }

    return this;
  }

  private createConfigView(state: State): this {
    this.$configView = $('<code/>').addClass(View.conf);
    this.$configView.appendTo(this.$slider);

    $('<p/>')
      .html('<b>const</b> options = {')
      .appendTo(this.$configView);

    for (let [key, value] of Object.entries(state)) {
      this.createConfigInputGroup(key, value)
        .appendTo(this.$configView);
    }

    $('<p/>').html('}').appendTo(this.$configView);

    return this;
  }

  private updateConfigView(state: State): this {
    if (! state.showConfig) {
      this.$configView.remove();

      return this;
    }
    for (let [key, value] of Object.entries(state)) {
      this.updateConfigInputGroup(key ,value);
    }

    return this;
  }

  private updateConfigInputGroup(key: string, value: boolean|number|null): void {
    let $input = this.$configView.find(`input[name="${key}"]`);
    if ($input) {
      if (typeof value === 'boolean') {
        $input.prop('checked', value);
      } else {
        $input.val(value);
      }
    }
  }

  private createConfigInputGroup(key: string, value: boolean|number|null): JQuery {
    let $inputGroup = $('<div/>').addClass(View.confInputG);

    $('<label/>')
      .addClass(View.confLabel)
      .html(`${key}:`)
      .attr('for', key)
      .appendTo($inputGroup);
    let $input = $('<input>')
      .addClass(View.confInput)
      .attr('name', key);

    switch (typeof value) {
      case 'boolean':
        $input.attr('type', 'checkbox');
        if (value === true) {
          $input.prop('checked', true);
        }
        $input.bind('change', this.funcOnChangeConfig);
        break;
      case 'number':
        $input.attr('type', 'text')
          .val(value)
          .bind('blur', this.funcOnChangeConfig);
        break;
      default:
        $input.attr({
          type: 'text',
          placeholder: 'null'
        }).bind('blur', this.funcOnChangeConfig);
    }

    $input.appendTo($inputGroup);

    return $inputGroup;
  }

  private destroyInput(): this {
    if (this.$input) {
      this.$handleFrom
        .unbind('mousedown', this.funcOnDragStart);
      if (this.$handleTo) {
        this.$handleTo
          .unbind('mousedown', this.funcOnDragStart)
      }
      this.$input
        .unbind('mousedown', this.funcOnJump)
        .remove();
      $(document)
        .unbind('mouseup', this.funcOnDragEnd)
        .unbind('mousedown', this.funcOnDrag);
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
    let prop;
    if ($handle.hasClass(View.handleFrom)) {
      prop = this.isVertical() ? 'top' : 'left';
    } else {
      prop = this.isVertical() ? 'bottom' : 'right';
      position = 100 - position;
    }
    this.$selection.css({
      [prop]: `${position}%`
    });
  }

  private static createVisibleRail(): JQuery {
    return $('<div/>').addClass(View.visibleRail)
  }
  private static createHiddenRail(): JQuery {
    return $('<div/>').addClass(View.hiddenRail);
  }

  private static createHandle(type: string, state: State): JQuery {
    let $handle = $('<a/>').addClass(View.handle);

    switch (type) {
      case 'from':
        $handle.addClass(View.handleFrom);
        break;
      case 'to':
        $handle.addClass(View.handleTo);
    }

    if (state.showBubble) {
      const $bubble = $('<div/>').addClass(View.bubble).text(
        type === 'to' ? state.value2 : state.value
      );

      $handle.append($bubble);
    }

    return $handle;
  }

  private updateHandles(state: State) {
    this.$draggingHandle = this.$handleFrom;
    this.moveHandle(state);

    if (state.range) {
      this.$draggingHandle = this.$handleTo;
      this.moveHandle(state);
    }

    this.$draggingHandle = null;
  }

  private bindDocumentEvents() {
    $(document)
      .bind('mouseup', this.funcOnDragEnd)
      .bind('mousemove', this.funcOnDrag);
  }

  private isVertical(): boolean {
    return this.$slider.hasClass(View.blockVert);
  }

  private getCursorPositionPercent(e: JQueryMouseEventObject): number {
    let position  // cursor position in px relative to slider
      , percent   // cursor position in percent relative to slider
    ;
    const $rail = this.$slider.find(`.${View.hiddenRail}`);
    if (this.isVertical()) {
      position  = e.pageY - $rail.offset().top - this.$draggingHandle.height() / 2;
      percent   = position / ($rail.height() / 100);

      return percent;
    }
    position  = e.pageX - $rail.offset().left - this.$draggingHandle.width() / 2;
    percent   = position / ($rail.width() / 100);

    return percent;
  }

  private static valueToPosition(min: number, max: number, value: number): number {
    const range = max - min;
    const position = (value - min) * 100 / range;

    return position;
  }

  private static validatePosition(position: number): number {
    const boundStart = 0;
    const boundEnd = 100;

    position = position > boundEnd    ? boundEnd    : position;
    position = position < boundStart  ? boundStart  : position;

    return position;
  }
}