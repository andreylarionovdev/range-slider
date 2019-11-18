import Model from '../Model/Model';
import View from '../View/Slider/View';
import Options from '../Interfaces/Options';

export default class App {
  private model: Model;
  private view: View;

  constructor(target: JQuery, options: Options) {
    this.model = new Model();
    this.view = new View();
    target.text(options.orientation);
    console.log('__app instance__');
  }
}