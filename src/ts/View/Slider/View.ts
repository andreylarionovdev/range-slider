import State from '../../Interfaces/State';
import $ from 'jquery';
import observable from '../../../../node_modules/@riotjs/observable/dist/observable';

export default class View {
  private $target: JQuery;
  private $input: JQuery;
  private $handle: JQuery;
  private $draggingHandle: JQuery;
  private announcer: any = observable(this);

  // To bind/unbind with class context
  private funcOnDragStart = e => this.dragStart(e);
  private funcOnDrag      = e => this.drag(e);
  private funcOnDragEnd   = e => this.dragEnd(e);

  constructor($target: JQuery) {
    this.$target = $target;
  }

  onDrag(callback): void {
    this.announcer.on('drag', callback);
  }

  render(state: State): void {
    let blockName = 'range-slider';

    this.$input = $('<div/>', {class: `${blockName}__input`});
    $('<div/>', {class: `${blockName}__rail`}).appendTo (this.$input);

    this.$handle = $('<a/>', {class: `${blockName}__handle`});
    this.$handle.appendTo(this.$input);

    this.$target
      .after(this.$input)
      .hide();

    this.bindListeners();
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

  private jumpHandle(e): void {
    console.log('__jump handle__');
  }

  private bindListeners(): void {
    this.$input.bind('mousedown', this.jumpHandle);
    this.$handle.bind('mousedown', this.funcOnDragStart);

    $(document)
      .bind('mouseup',    this.funcOnDragEnd)
      .bind('mousemove',  this.funcOnDrag);
  }

  private dragStart(e): void {
    e.stopPropagation();
    e.preventDefault();

    this.$draggingHandle = $(e.currentTarget);
  }
  private drag(e): void {
    if (this.$draggingHandle) {
      e.preventDefault();
      let position = e.pageX - this.$input.offset().left;
      this.moveHandle(position);
    }
  }
  private dragEnd(e): void {
    e.preventDefault();
    if (this.$draggingHandle) {
      this.$draggingHandle = null;
    }
  }
  private moveHandle(position: number): void {
    let boundLeft   = 0;
    let boundRight  = this.$input.width() - this.$draggingHandle.width();

    if (position > boundRight) {
      position = boundRight;
    }
    if (position < boundLeft) {
      position = boundLeft;
    }

    this.$draggingHandle.css({
      position: 'absolute',
      left    : position
    });

    this.announcer.trigger('drag'
      , this.$input.width()
      , this.$draggingHandle.width()
      , position
    );
  }
}