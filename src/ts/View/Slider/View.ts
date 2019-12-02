import State from '../../Interfaces/State';
import $ from 'jquery';
import observable from '../../../../node_modules/@riotjs/observable/dist/observable';

export default class View {
  private $target: JQuery;
  private $input: JQuery;
  private $handleFrom: JQuery;
  private $handleTo: JQuery;
  private $draggingHandle: JQuery;
  private $configView: JQuery;
  private announcer: any = observable(this);

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
      this.bindConfigViewListeners()
    }

    this.bindListeners();
  }

  renderHandle(state: State): void {
    const min   = state.min;
    const max   = state.max;
    const step  = state.step;

    let value = state.value;

    if (this.$draggingHandle === this.$handleTo) {
      value = state.value2;
    }

    let position = this.valueToPx(min, max, value);

    if (step) {
      const stepPx = this.valueToPx(min, max, step);
      position = Math.round(position / stepPx) * stepPx;
    }

    this.moveHandle(position);
  }

  destroy(): this {
    if (this.$input && this.$target) {
      this.$input.remove();
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
    const blockName = 'range-slider';

    this.$input = $('<div/>', {class: `${blockName}__input`});
    $('<div/>', {class: `${blockName}__rail`}).appendTo (this.$input);

    this.$handleFrom = $('<a/>', {class: `${blockName}__handle`});
    this.$handleFrom.appendTo(this.$input);

    this.$target.after(this.$input).hide();
  }

  // TODO: Create separate View
  private initConfigView(state: State) {
    const blockName = 'range-slider-config';

    this.$configView = $('<div/>', {class: blockName});

    $('<p/>').html('Options').appendTo(this.$configView);
    for (let option of Object.entries(state)) {
      let key   = option[0];
      let value = option[1];

      let $inputGroup = $('<div/>', {class: `${blockName}__input-group`});
      $('<label/>').text(`${key}: `).attr('for', key).appendTo($inputGroup);
      $('<input type="text">').val(value).attr('data-name', key).appendTo($inputGroup);
      $inputGroup.appendTo(this.$configView);
    }

    this.$input.after(this.$configView);
  }

  private bindListeners(): void {
    this.$input.bind('mousedown', this.funcOnJump);
    this.$handleFrom.bind('mousedown', this.funcOnDragStart);

    $(document)
      .bind('mouseup',    this.funcOnDragEnd)
      .bind('mousemove',  this.funcOnDrag);
  }

  private bindConfigViewListeners(): void {
    this.$configView.find('input').each((_, input) => {
      $(input).bind('blur', this.funcOnChangeConfig);
    });
  }

  private jump(e): void {
    if (! this.$handleTo) {
      this.$draggingHandle  = this.$handleFrom;
      const data = {
        inputWidth  : this.$input.width() - this.$draggingHandle.width(),
        position    : this.getCursorPositionWithOffset(e)
      };

      this.announcer.trigger('jump', 'value', null, data);
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
      const key   = (this.$draggingHandle === this.$handleTo) ? 'value2' : 'value';
      const data  = {
        inputWidth  : this.$input.width() - this.$draggingHandle.width(),
        position    : this.getCursorPositionWithOffset(e)
      };

      this.announcer.trigger('drag', key, null, data);
    }
  }

  private dragEnd(e): void {
    e.preventDefault();
    if (this.$draggingHandle) {
      this.$draggingHandle = null;
    }
  }

  private changeConfig(e): void {
    const key   = $(e.currentTarget).data('name');
    const value = $(e.currentTarget).val();

    this.announcer.trigger('change.config', key, value);
  }

  private moveHandle(position: number): void {
    const boundLeft   = 0;
    const boundRight  = this.$input.width() - this.$draggingHandle.width();

    position = position > boundRight  ? boundRight  : position;
    position = position < boundLeft   ? boundLeft   : position;

    this.$draggingHandle.css({
      position: 'absolute',
      left    : position
    });
  }

  private getCursorPositionWithOffset(e: JQueryMouseEventObject): number {
    return e.pageX - this.$input.offset().left - this.$draggingHandle.width() / 2;
  }

  private valueToPx(min: number, max: number, value: number): number {
    const width = this.$input.width() - this.$draggingHandle.width();
    const range = max - min;

    return value * (width / range) - min;
  }
}