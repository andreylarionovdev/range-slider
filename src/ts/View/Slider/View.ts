import Options from '../../Interfaces/Options';
import $ from 'jquery';
import observable from '../../../../node_modules/@riotjs/observable/dist/observable';

export default class View {
  private options: Options;
  private $target: JQuery;
  private $input: JQuery;
  private $handle: JQuery;
  private dragging: boolean;
  private announcer: any = observable(this);

  constructor($target: JQuery, options?: Options) {
    this.initDOM($target, options);
    this.attachListeners();
  }

  onDrag(callback): void {
    this.announcer.on('drag', callback);
  }
  echo(msg: string): string {
    return msg;
  }

  private attachListeners() {
    this.$input.mousedown(this.jumpHandle);

    this.$handle.mousedown(e => this.dragStart(this, e));

    $(document)
      .mouseup(e => this.dragEnd(this, e))
      .mousemove(e => this.drag(this, e));

    console.log('__listeners attached to DOM elements__');
  }

  private initDOM($target: JQuery, options?: Options) {
    this.$target = $target;
    this.options = options;

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

  private jumpHandle(e) {
    console.log('__jump handle__');
  }
  private dragStart(that, e) {
    e.stopPropagation();
    e.preventDefault();

    that.dragging = true;

    console.log('__drag start__', that.dragging);
  }
  private drag(that, e) {
    if (that.dragging) {
      e.preventDefault();
      // console.log('__dragging__', that.dragging);
      that.announcer.trigger('drag');
    }
  }
  private dragEnd(that, e) {
    e.preventDefault();
    if (that.dragging) {
      that.dragging = false;
      console.log('__drag end__', that.dragging);
    }
  }
}