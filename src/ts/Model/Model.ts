import State from "../Interfaces/State";
import observable from '../../../node_modules/@riotjs/observable/dist/observable';

export default class Model {
  private state: State;
  private announcer: any = observable(this);

  constructor (state: State) {
    this.state = state;
  }

  onInit(callback) {
    this.announcer.on('create.state', callback);
  }

  onChangeValues(callback) {
    this.announcer.on('change.values', callback);
  }

  init() {
    this.announcer.trigger(
      'create.state',
      Object.assign({}, this.state)
    );
  }

  private update(state: State, callback: null | Function) {
    this.state = Object.assign({}, this.state, state);

    if (typeof callback === 'function') {
      callback();
    }
    console.log('__state__', this.state);
  }

  updateValues(inputWidth: number, handleWidth: number, position, emitState: boolean) {
    let value
      , values
      , trigger
    ;
    value   = this.positionToValue(inputWidth, handleWidth, position);
    values  = [];

    values.push(value);

    if (emitState) {
      trigger = () => {
        this.announcer.trigger(
          'change.values',
          Object.assign({}, this.state)
        );
      }
    }

    this.update({values}, trigger);
  }

  private positionToValue(axisWidth: number, handleWidth: number, position: number) {
    let width = axisWidth - handleWidth;
    let range = this.state.max - this.state.min;

    return Math.round(position/(width/range) + this.state.min);
  }

  echo(msg): any {
    return msg;
  }
}