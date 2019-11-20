import View from "../View/Slider/View";
import Model from "../Model/Model";

export default class Presenter {
  private view: View;
  private model: Model;

  constructor(view: View, model: Model) {
    this.view = view;
    this.model = model;

    view.onDrag(() => this.updateState());
    model.onChange(() => this.updateView());
  }

  updateState() {
    console.log('__echo__', this.model.echo('updateState'));
  }
  updateView() {
    console.log('__echo__', this.view.echo('updateView'));
  }
}