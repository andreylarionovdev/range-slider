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

  constructor($target: JQuery) {
    this.$target = $target;
  }

  onDrag(callback): void {
    this.announcer.on('drag', callback);
  }

  onJump(callback): void {
    this.announcer.on('jump', callback);
  }

  render(state: State): void {
    let showConfig = state.showConfig;

    this.initDOM(state);
    if (showConfig) {
      this.initConfigView(state);
    }
    this.bindListeners();
  }

  renderHandle(state: State): void {
    let min   = state.min;
    let max   = state.max;
    let step  = state.step;

    let position = this.valueToPx(min, max, state.values[0]);
    if (step) {
      let stepPx = this.valueToPx(min, max, step);
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
    $('<p/>').html('State').appendTo(this.$configView);

    this.$input.after(this.$configView);
  }

  private bindListeners(): void {
    this.$input.bind('mousedown', this.funcOnJump);
    this.$handleFrom.bind('mousedown', this.funcOnDragStart);

    $(document)
      .bind('mouseup',    this.funcOnDragEnd)
      .bind('mousemove',  this.funcOnDrag);
  }

  private jump(e): void {
    let cursorPosition = e.pageX - this.$input.offset().left;

    if (! this.$handleTo) {
      this.$draggingHandle = this.$handleFrom;
      // this.moveHandle(cursorPosition);
      this.announcer.trigger('jump'
        , this.$input.width()
        , this.$draggingHandle.width()
        , cursorPosition
        , true
      );
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
      let cursorPosition = e.pageX - this.$input.offset().left;

      // this.moveHandle(cursorPosition);
      this.announcer.trigger('drag'
        , this.$input.width()
        , this.$draggingHandle.width()
        , cursorPosition
        , true
      );
    }
  }

  private dragEnd(e): void {
    e.preventDefault();
    if (this.$draggingHandle) {
      this.$draggingHandle = null;
    }
  }

  private moveHandle(position: number): void {
    let boundLeft   = this.$draggingHandle.width() / 2;
    let boundRight  = this.$input.width() - this.$draggingHandle.width() / 2;

    if (position > boundRight) {
      position = boundRight;
    }
    if (position < boundLeft) {
      position = boundLeft;
    }

    position -= this.$draggingHandle.width() / 2;

    this.$draggingHandle.css({
      position: 'absolute',
      left    : position
    });
  }

  private valueToPx(min: number, max: number, value: number): number {
    let width     = this.$input.width();
    let range     = max - min;

    return value * (width / range) - min;
  }
}