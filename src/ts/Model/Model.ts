import State from "../Interfaces/State";
import observable from '../../../node_modules/@riotjs/observable/dist/observable';

export default class Model {
  private state: State;
  private announcer: any = observable(this);

  constructor(state?: State) {
    this.init(state);
  }

  onChange(callback) {
    this.announcer.on('change.state', callback);
  }

  update(state: State) {
    this.state = Object.assign({}, this.state, state);
    this.announcer.trigger(
      'change.state',
      Object.assign({}, this.state)
    );
    console.log('__model.state__', this.state);
  }

  private init(state? : State) {
    this.update(state);
  }

  echo(msg): any {
    return msg;
  }
}