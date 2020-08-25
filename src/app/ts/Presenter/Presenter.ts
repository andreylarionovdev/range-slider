import SliderView from '../View/MainView/MainView';
import Model from '../Model/Model';
import State from '../Interfaces/State';
import SliderViewExtraData from '../Interfaces/SliderViewExtraData';
import SliderModelExtraData from '../Interfaces/SliderModelExtraData';

class Presenter {
  private view: SliderView;

  private model: Model;

  constructor(view: SliderView, model: Model) {
    this.view = view;
    this.model = model;

    this.view.onChange((state, extra) => this.updateState(state, extra));
    this.model.onChange((state, extra) => this.updateView(state, extra));

    this.model.emitChangeState();
  }

  update(state: State): void {
    this.model.setState(state);
  }

  private updateState(state: State, extra?: SliderViewExtraData): void {
    this.model.update(state, extra);
  }

  private updateView(state: State, extra?: SliderModelExtraData): void {
    this.view.update(state, extra);
  }
}

export default Presenter;
