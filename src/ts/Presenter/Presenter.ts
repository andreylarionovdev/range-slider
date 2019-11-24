import View from '../View/Slider/View';
import Model from '../Model/Model';
import State from '../Interfaces/State';

export default class Presenter {
  private view: View;
  private model: Model;

  constructor(view: View, model: Model) {
    this.view = view;
    this.model = model;

    this.view.onDrag((iw, hw, pos) => this.updateValues(iw, hw, pos));
    this.model.onInit(state => this.renderView(state));

    this.model.init();
  }

  updateValues(inputWidth: number, handleWidth: number, position: number) {
    this.model.updateValues(inputWidth, handleWidth, position);
  }
  renderView(state: State) {
    this.view.destroy().render(state);
  }
}