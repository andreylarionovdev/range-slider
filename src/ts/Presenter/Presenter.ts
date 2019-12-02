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
    this.model.onEmitState(state => this.renderView(state));
    this.model.onChangeValue(state => this.renderHandle(state));

    this.model.emitState();
  }

  updateState(key: string, value: string, data?: Object) {
    this.model.set(key, value, data);
  }
  renderView(state: State) {
    this.view.render(state);
  }
  renderHandle(state: State) {
    this.view.renderHandle(state);
  }
}