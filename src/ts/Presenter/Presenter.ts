import View from '../View/View';
import Model from '../Model/Model';
import State from '../Interfaces/State';
import SliderViewExtraData from '../Interfaces/SliderViewExtraData';

class Presenter {
  private view: View;

  private model: Model;

  constructor(view: View, model: Model) {
    this.view = view;
    this.model = model;

    this.view.onDrag((k, v, d) => this.updateState(k, v, d));
    this.view.onJump((k, v, d) => this.updateState(k, v, d));

    this.view.onChangeConfig((k, v) => this.updateState(k, v));

    this.model.onChangeState((state) => this.updateView(state));

    this.model.onChangeValue((state) => this.updateHandle(state));
    this.model.onChangeValue((state) => this.updateViewValues(state));

    this.model.emitChangeState();
  }

  updateState(key: string, value: null|number|boolean, extra?: SliderViewExtraData): void {
    this.model.updateState(key, value, extra);
  }

  updateHandle(state: State): void {
    this.view.moveHandle(state);
  }

  updateView(state: State): void {
    this.view.update(state);
  }

  updateViewValues(state: State): void {
    this.view.updateValues(state);
  }
}

export default Presenter;
