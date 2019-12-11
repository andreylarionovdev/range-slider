import $ from 'jquery';
import State from '../../Interfaces/State';
import HandleModifiers from '../../Interfaces/HandleModifiers';
import observable from '../../../../node_modules/@riotjs/observable/dist/observable';

export default class View {

  private $target         : JQuery;
  private $slider         : JQuery;
  private $handleFrom     : JQuery;
  private $handleTo       : JQuery;
  private $selection      : JQuery;
  private $draggingHandle : JQuery;

  private $configView     : JQuery;

  // Classes
  private static block      : string = 'range-slider';
  private static blockVert  : string = `${View.block}--vertical`;

  private static conf       : string = `${View.block}__conf`;
  private static confLabel  : string = `${View.block}__conf-label`;
  private static confInput  : string = `${View.block}__conf-input`;
  private static confInputG : string = `${View.block}__conf-input-group`;

  private static input      : string = `${View.block}__input`;
  private static hiddenRail : string = `${View.block}__rail`;
  private static visibleRail: string = `${View.block}__rail--visible`;
  private static selection  : string = `${View.block}__selection`;

  private static handle     : string = `${View.block}__handle`;
  private static handleFrom : string = `${View.handle}--from`;
  private static handleTo   : string = `${View.handle}--to`;

  // thing that dealing with events between MPV layers
  private announcer: any = observable(this);

  // To bind/unbind with class context
  private funcOnDragStart = e => this.dragStart(e);
  private funcOnDrag      = e => this.drag(e);
  private funcOnDragEnd   = e => this.dragEnd(e);
  private funcOnJump      = e => this.jump(e);
  private funcOnChangeConfig = e => this.changeConfig(e);

  constructor($target: JQuery, state: State) {
    this.$target = $target;
    this.update(state);
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

  update(state: State): void {
    this.destroy()
      .renderMainView(state)
      .renderConfigView(state);
  }

  updateValues(state: State): void {
    const {value, value2, range, showConfig} = state;

    if (range) {

    }

    if (showConfig) {
      this.$configView.find(`input[name="value"]`).val(value);
      this.$configView.find(`input[name="value2"]`).val(value2);
    }
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

  destroy(): this {
    if (this.$slider && this.$target) {
      this.$slider.remove();
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

  private renderMainView(state: State): this {
    this.$slider = this.createSlider(state);
    this.$target.after(this.$slider).hide();

    let $input = this.createInput()
      .appendTo(this.$slider);

    let $visibleRail = this.createVisibleRail()
      .appendTo($input);
    
    let $hiddenRail = this.createHiddenRail()
      .appendTo($input);
    
    if (state.range) {
      this.$selection = this.createSelection()
        .appendTo($visibleRail);
    }

    this.$handleFrom = this.createHandle({
      type: 'from'
    }).appendTo($hiddenRail);

    if (state.range) {
      this.$handleTo = this.createHandle({
        type: 'to'
      }).appendTo($hiddenRail);
    }

    this.bindDocumentEvents();
    this.updateHandles(state);

    return this;
  }

  private renderConfigView(state: State): this {
    if (! state.showConfig) {
      return this;
    }

    this.$configView = $('<code/>').addClass(View.conf);
    this.$configView.appendTo(this.$slider);

    $('<p/>')
      .html('<b>const</b> options = {')
      .appendTo(this.$configView);

    for (let [key, value] of Object.entries(state)) {
      this.renderConfigInputGroup(key, value)
        .appendTo(this.$configView);
    }

    $('<p/>').html('}').appendTo(this.$configView);

    return this;
  }

  private createInput(): JQuery {
    return $('<div/>')
      .addClass(View.input)
      .bind('mousedown', this.funcOnJump);
  }

  private createSelection(): JQuery {
    return $('<div/>').addClass(View.selection);
  }

  private createVisibleRail(): JQuery {
    return $('<div/>').addClass(View.visibleRail)
  }
  private createHiddenRail(): JQuery {
    return $('<div/>').addClass(View.hiddenRail);
  }

  private bindDocumentEvents() {
    $(document)
      .bind('mouseup', this.funcOnDragEnd)
      .bind('mousemove', this.funcOnDrag);
  }

  private createSlider(state: State): JQuery {
    let blockClasses = [View.block];

    if (state.vertical) {
      blockClasses.push(View.blockVert);
    }

    return $('<div/>').addClass(blockClasses);
  }

  private createHandle(modifiers: HandleModifiers): JQuery {
    let $handle = $('<a/>')
      .addClass(View.handle)
      .bind('mousedown', this.funcOnDragStart);

    switch (modifiers.type) {
      case 'from':
        $handle.addClass(View.handleFrom);
        break;
      case 'to':
        $handle.addClass(View.handleTo);
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

  private renderConfigInputGroup(key: string, value: boolean | number): JQuery {
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
      default:
        $input.attr('type', 'text')
          .val(value)
          .bind('blur', this.funcOnChangeConfig);
    }

    $input.appendTo($inputGroup);

    return $inputGroup;
  }

  private jump(e): void {
    if (! this.$handleTo) {
      this.$draggingHandle  = this.$handleFrom;
      this.announcer.trigger('jump', 'value', null, {
        percent : this.getCursorPositionPercent(e)
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
      const key = this.$draggingHandle.hasClass(View.handleTo)
        ? 'value2'
        : 'value';
      this.announcer.trigger('drag', key, null, {
        percent : this.getCursorPositionPercent(e)
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