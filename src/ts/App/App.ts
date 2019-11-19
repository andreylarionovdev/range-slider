import Model from '../Model/Model';
import View from '../View/Slider/View';
import Options from '../Interfaces/Options';

export default class App {
  private model: Model;
  private view: View;

  constructor(target: JQuery, options: Options) {
    this.model = new Model(options);
    this.view = new View(target, options);
    console.log('__app instance created__');
  }
}