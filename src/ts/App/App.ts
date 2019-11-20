import Model from '../Model/Model';
import View from '../View/Slider/View';
import Options from '../Interfaces/Options';
import Presenter from "../Presenter/Presenter";

export default class App {
  constructor(target: JQuery, options: Options) {
    new Presenter(
      new View(target, options),
      new Model(options)
    );
    console.log('__app instance created__');
  }
}