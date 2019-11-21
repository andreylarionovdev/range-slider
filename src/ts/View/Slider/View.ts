import State from '../../Interfaces/State';
import $ from 'jquery';
import observable from '../../../../node_modules/@riotjs/observable/dist/observable';

export default class View {
  private $target: JQuery;
  private $input: JQuery;
  private $handle: JQuery;
  private dragging: boolean;
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
    this.$input.mousedown(View.jumpHandle);
    this.$handle.mousedown(e => View.dragStart(this, e));

    $(document)
      .mouseup(e => View.dragEnd(this, e))
      .mousemove(e => View.drag(this, e));

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

  private static jumpHandle(e): void {
    console.log('__jump handle__');
  }
  private static dragStart(that, e): void {
    e.stopPropagation();
    e.preventDefault();

    that.dragging = true;

    console.log('__drag start__', that.dragging);
  }
  private static drag(that, e): void {
    if (that.dragging) {
      e.preventDefault();
      // console.log('__dragging__', that.dragging);
      that.announcer.trigger('drag', {values: [0, 101]});
    }
  }
  private static dragEnd(that, e): void {
    e.preventDefault();
    if (that.dragging) {
      that.dragging = false;
      console.log('__drag end__', that.dragging);
    }
  }
}