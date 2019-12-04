import State from '../Interfaces/State';
import observable from '../../../node_modules/@riotjs/observable/dist/observable';

export default class Model {
  private state: State;
  private announcer: any = observable(this);

  constructor (state: State) {
    const {max, value2, range} = state;

    this.state = state;
    if (range && ! value2) {
      this.state.value2 = max;
    }
  }

  onEmitState(callback) {
    this.announcer.on('emit.state', callback);
  }

  onChangeValue(callback) {
    this.announcer.on('change.value', callback);
    this.announcer.on('change.value2', callback);
  }

  emitState() {
    this.announcer.trigger(
      'emit.state',
      Object.assign({}, this.state)
    );
  }

  set(key: string, value: any, data?: any) {
    switch (key) {
      case 'value':
      case 'value2':
        const {axLength, position} = data;
        this.state[key] = this.positionToValue(axLength, position);
        this.announcer.trigger(
          `change.${key}`,
          Object.assign({}, this.state)
        );
        break;
      case 'min':
      case 'max':
      case 'step':
        this.state[key] = Number(value);
        this.emitState();
        break;
      default:
        this.state[key] = value;
        this.emitState();
    }
  }

  private positionToValue(axLength: number, position: number) {
    const {min, max, step} = this.state;
    const range = max - min;

    let value = position / (axLength / range) + min;

    value = value > max ? max : value;
    value = value < min ? min : value;

    if (step) {
      return Math.floor(value / step) * step;
     }

    return Math.round(value);
  }
}