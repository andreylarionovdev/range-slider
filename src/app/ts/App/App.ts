import Model from '../Model/Model';
import View from '../View/View';
import Presenter from '../Presenter/Presenter';
import State from '../Interfaces/State';

class App {
  private presenter: Presenter;

  constructor(target: JQuery, options: State) {
    this.presenter = new Presenter(
      new View(target, options),
      new Model(options),
    );
  }
}

export default App;
