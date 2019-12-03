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
      this.bindConfigViewListeners()
    }
  }

  renderHandle(state: State): void {
    const {min, max, step} = state;

    const boundLeft   = 0;
    const boundRight  = this.$input.width() - this.$draggingHandle.width();

    let value = state.value;

    if (this.$draggingHandle === this.$handleTo) {
      value = state.value2;
    }

    let position = this.valueToPx(min, max, value);

    if (step) {
      const stepPx = this.valueToPx(min, max, step);
      position = Math.round(position / stepPx) * stepPx;
    }

    position = position > boundRight  ? boundRight  : position;
    position = position < boundLeft   ? boundLeft   : position;

    this.$draggingHandle.css({
      position: 'absolute',
      left    : position
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

    this.$target.after($slider).hide();
    this.$input.bind('mousedown', this.funcOnJump);

    this.$handleFrom = $('<a/>', {class: `${this.blockName}__handle`}).attr('name', 'from')
      .appendTo(this.$input)
      .bind('mousedown', this.funcOnDragStart);

    this.$draggingHandle = this.$handleFrom;
    this.renderHandle(state);

    if (state.range) {
      this.$handleTo = this.$handleFrom.clone().attr('name', 'to')
        .appendTo(this.$input).bind('mousedown', this.funcOnDragStart);

      this.$draggingHandle = this.$handleTo;
      this.renderHandle(state);
    }
    this.$draggingHandle = null;

    $(document)
      .bind('mouseup',    this.funcOnDragEnd)
      .bind('mousemove',  this.funcOnDrag);
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
    }

    this.$input.after(this.$configView);
  }

  private bindConfigViewListeners(): void {
    this.$configView.find('input').each((_, input) => {
      const eventName = $(input).attr('type') === 'checkbox'
        ? 'change'
        : 'blur';
      $(input).bind(eventName, this.funcOnChangeConfig);
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
    const $input = $(e.currentTarget);
    const checkboxes = ['vertical', 'range', 'showConfig'];

    const key   = $input.attr('name');
    const value = checkboxes.includes(key) ? $input.is(':checked') : $input.val();

    this.announcer.trigger('change.config', key, value);
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