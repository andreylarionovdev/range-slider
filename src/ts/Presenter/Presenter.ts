import View from '../View/Slider/View';
import Model from '../Model/Model';
import State from '../Interfaces/State';

export default class Presenter {
  private view: View;
  private model: Model;

  constructor(view: View, model: Model) {
    this.view = view;
    this.model = model;

    this.view.onDrag((iw, hw, pos, es) => this.updateValues(iw, hw, pos, es));
    this.view.onJump((iw, hw, pos, es) => this.updateValues(iw, hw, pos, es));
    this.model.onInit(state => this.renderView(state));
    this.model.onChangeValues(state => this.renderHandle(state));

    this.model.init();
  }

  updateValues(inputWidth: number, handleWidth: number, position: number, emitState?: boolean) {
    this.model.updateValues(inputWidth, handleWidth, position, emitState);
  }
  renderView(state: State) {
    this.view.destroy().render(state);
  }
  renderHandle(state: State) {
    this.view.renderHandle(state);
  }
}