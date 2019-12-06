import View from '../View/Slider/View';
import Model from '../Model/Model';
import State from '../Interfaces/State';

export default class Presenter {
  private view: View;
  private model: Model;

  constructor(view: View, model: Model) {
    this.view = view;
    this.model = model;

    this.view.onDrag((k, v, d) => this.updateState(k, v, d));
    this.view.onJump((k ,v, d) => this.updateState(k ,v, d));

    this.view.onChangeConfig((k, v) => this.updateState(k, v));

    this.model.onEmitState(state => this.updateView(state));

    this.model.onChangeValue(state => this.updateHandle(state));
    this.model.onChangeValue(state => this.updateViewValues(state));

    this.model.emitState();
  }

  updateState(key: string, value: any, data?: Object) {
    this.model.set(key, value, data);
  }
  updateHandle(state: State) {
    this.view.moveHandle(state);
  }
  updateView(state: State) {
    this.view.update(state);
  }
  updateViewValues(state: State) {
    this.view.updateValues(state);
  }
}