import State from '../../Interfaces/State';
import $ from 'jquery';
import observable from '../../../../node_modules/@riotjs/observable/dist/observable';

export default class View {
  private $target: JQuery;
  private $input: JQuery;
  private $handleFrom: JQuery;
  private $handleTo: JQuery;
  private $selection: JQuery;
  private $draggingHandle: JQuery;
  private $configView: JQuery;

  private announcer: any = observable(this);
  private blockName: string = 'range-slider';

  // To bind/unbind with class context
  private funcOnDragStart = e => this.dragStart(e);
  private funcOnDrag      = e => this.drag(e);
  private funcOnDragEnd   = e => this.dragEnd(e);
  private funcOnJump      = e => this.jump(e);
  private funcOnChangeConfig = e => this.changeConfig(e);

  constructor($target: JQuery) {
    this.$target = $target;
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

  render(state: State): void {
    this.destroy().initDOM(state);

    if (state.showConfig) {
      this.initConfigView(state);
    }
  }

  moveHandle(state: State): void {
    const {min, max, step, range} = state;

    const boundStart  = 0;
    const boundEnd    = this.getAxLength();

    const value = (this.$draggingHandle.attr('name') === 'to')
      ? state.value2
      : state.value;

    let position = this.valueToPosition(this.getAxLength(), min, max, value);

    if (step) {
      const stepPx = this.valueToPosition(this.getAxLength(), min, max, step);
      position = Math.round(position / stepPx) * stepPx;
    }

    position = position > boundEnd    ? boundEnd    : position;
    position = position < boundStart  ? boundStart  : position;

    this.$draggingHandle.css({
      [this.isVertical() ? 'top' : 'left']: position
    });
    if (range) {
      this.updateSelection(position);
    }
  }

  private updateSelection(position): void {
    let prop;
    switch (this.$draggingHandle.attr('name')) {
      case 'from':
        prop = this.isVertical() ? 'top' : 'left';
        break;
      case 'to':
        if (this.isVertical()) {
          prop = 'bottom';
          position = this.$input.height() - this.$draggingHandle.height() - position;
        } else {
          prop = 'right';
          position = this.$input.width()  - this.$draggingHandle.width() - position;
        }
        break;
    }
    this.$selection.css({
      [prop]: position
    });
  }

  destroy(): this {
    if (this.$input && this.$target) {
      this.$input.closest(`.${this.blockName}`).remove();
      this.$target.show().data('range', null);

      $(document)
        .unbind('mouseup',    this.funcOnDragEnd)
        .unbind('mousedown',  this.funcOnDrag);
    }
    if (this.$configView) {
      this.$configView.find('input').each((_, input) => {
        $(input).unbind('blur', this.funcOnChangeConfig);
      });
      this.$configView.remove();
    }

    return this;
  }

  private initDOM(state: State) {
    let blockClasses = [this.blockName];

    if (state.vertical) {
      blockClasses.push(this.blockName + '--vertical');
    }

    let $slider = $('<div/>').addClass(blockClasses);

    // create and add $input to $slider
    this.$input = $('<div/>', {class: `${this.blockName}__input`});
    this.$input.appendTo($slider);

    // add axis rail to $input
    let $axis = $('<div/>').addClass(`${this.blockName}__rail`);
    $axis.appendTo(this.$input);

    // create and add selection if range
    if (state.range) {
      this.$selection = $('<div/>', {class: `${this.blockName}__selection`})
        .appendTo(this.$input);
    }

    this.$target.after($slider).hide();
    this.$input.bind('mousedown', this.funcOnJump);

    // create first handler, fill attributes, append to $input and bind mousedown
    this.$handleFrom = $('<a/>', {class: `${this.blockName}__handle`}).attr('name', 'from')
      .appendTo(this.$input)
      .bind('mousedown', this.funcOnDragStart);

    if (state.range) {
      // create second handler using `clone`
      this.$handleTo = this.$handleFrom.clone().attr('name', 'to')
        .appendTo(this.$input).bind('mousedown', this.funcOnDragStart);
    }

    $(document)
      .bind('mouseup',    this.funcOnDragEnd)
      .bind('mousemove',  this.funcOnDrag);

    this.updateHandles(state);
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

  // TODO: Create separate View using templating
  private initConfigView(state: State) {
    const blockName = 'range-slider-config';

    this.$configView = $('<div/>', {class: blockName});

    $('<p/>').html('Options').appendTo(this.$configView);
    for (let option of Object.entries(state)) {
      const key   = option[0];
      const value = option[1];

      let $inputGroup = $('<div/>', {class: `${blockName}__input-group`});

      $('<label/>').text(`${key}: `).attr('for', key).appendTo($inputGroup);
      let $input = $('<input>').attr('name', key);

      switch (typeof value) {
        case 'boolean':
          $input.attr('type', 'checkbox');
          if (value === true) {
            $input.prop('checked', true);
          }
          break;
        default:
          $input.attr('type', 'text').val(value);
      }

      $input.appendTo($inputGroup);
      $inputGroup.appendTo(this.$configView);

      this.$configView.find('input').each((_, input) => {
        const eventName = $(input).attr('type') === 'checkbox'
          ? 'change'
          : 'blur';
        $(input).bind(eventName, this.funcOnChangeConfig);
      });
    }

    this.$input.after(this.$configView);
  }

  private jump(e): void {
    if (! this.$handleTo) {
      this.$draggingHandle  = this.$handleFrom;
      this.announcer.trigger('jump', 'value', null, {
        axLength  : this.getAxLength(),
        position  : this.getCursorPositionWithOffset(e)
      });
    }
  }

  private dragStart(e): void {
    e.stopPropagation();
    e.preventDefault();

    this.$draggingHandle = $(e.currentTarget);
  }

  private drag(e): void {
    if (this.$draggingHandle) {
      e.preventDefault();
      const key = (this.$draggingHandle.attr('name') === 'to')
        ? 'value2'
        : 'value';
      this.announcer.trigger('drag', key, null, {
        axLength  : this.getAxLength(),
        position  : this.getCursorPositionWithOffset(e)
      });
    }
  }

  private dragEnd(e): void {
    e.preventDefault();
    if (this.$draggingHandle) {
      this.$draggingHandle = null;
    }
  }

  private changeConfig(e): void {
    const $input = $(e.currentTarget);
    const checkboxes = ['vertical', 'range', 'showConfig'];

    const key   = $input.attr('name');
    const value = checkboxes.includes(key)
      ? $input.is(':checked')
      : $input.val();

    this.announcer.trigger('change.config', key, value);
  }

  private isVertical(): boolean {
    return this.$input
      .closest(`.${this.blockName}`)
      .hasClass(`${this.blockName}--vertical`);
  }

  private getAxLength(): number {
    if (this.isVertical()) {
      return this.$input.height() - this.$draggingHandle.height();
    }
    return this.$input.width() - this.$draggingHandle.width();
  }

  private getCursorPositionWithOffset(e: JQueryMouseEventObject): number {
    if (this.isVertical()) {
      return e.pageY - this.$input.offset().top - this.$draggingHandle.height() / 2;
    }
    return e.pageX - this.$input.offset().left - this.$draggingHandle.width() / 2;
  }

  private valueToPosition(axLength: number, min: number, max: number, value: number): number {
    const range = max - min;

    return value * (axLength / range) - min;
  }
}