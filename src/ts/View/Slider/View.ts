import State from '../../Interfaces/State';
import $ from 'jquery';
import observable from '../../../../node_modules/@riotjs/observable/dist/observable';

export default class View {
  private $target: JQuery;
  private $input: JQuery;
  private $handle: JQuery;
  private $draggingHandle: JQuery;
  private announcer: any = observable(this);

  constructor($target: JQuery) {
    this.render($target);
    this.attachListeners();
  }

  onDrag(callback): void {
    this.announcer.on('drag', callback);
  }
  update(state: State) {
    console.log('__state transferred to view__', state);
  }
  echo(msg: string): string {
    return msg;
  }

  private attachListeners(): void {
    this.$input.mousedown(this.jumpHandle);
    this.$handle.mousedown(e => this.dragStart(e));

    $(document)
      .mouseup(e => this.dragEnd(e))
      .mousemove(e => this.drag(e));

    console.log('__listeners attached to DOM elements__');
  }

  private render($target: JQuery): void {
    this.$target = $target;

    let blockName = 'range-slider';

    this.$input = $('<div/>', {class: `${blockName}__input`});
    $('<div/>', {class: `${blockName}__rail`}).appendTo (this.$input);

    this.$handle = $('<a/>', {class: `${blockName}__handle`});
    this.$handle.appendTo(this.$input);

    this.$target
      .after(this.$input)
      .hide();

    console.log('__slider view DOM initialized__');
  }

  private jumpHandle(e): void {
    console.log('__jump handle__');
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