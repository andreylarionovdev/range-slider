import Model from '../Model/Model';
import View from '../View/Slider/View';
import State from '../Interfaces/State';
import Presenter from "../Presenter/Presenter";

export default class App {
  constructor(target: JQuery, options: State) {
    new Presenter(
      new View(target),
      new Model(options)
    );
    console.log('__app instance created__');
  }
}