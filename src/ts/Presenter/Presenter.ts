import View from '../View/Slider/View';
import Model from '../Model/Model';
import State from '../Interfaces/State';

export default class Presenter {
  private view: View;
  private model: Model;

  constructor(view: View, model: Model) {
    this.view = view;
    this.model = model;

    this.view.onDrag(state => this.updateState(state));
    this.model.onChange(state => this.updateView(state));
  }

  updateState(state: State) {
    this.model.update(state);
  }
  updateView(state: State) {
    this.view.update(state);
  }
}