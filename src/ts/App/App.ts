import Model from '../Model/Model';
import View from '../View/Slider/View';
import Presenter from "../Presenter/Presenter";
import State from '../Interfaces/State';

export default class App {
  constructor(target: JQuery, options: State) {
    new Presenter(
      new View(target),
      new Model(options)
    );
  }
}