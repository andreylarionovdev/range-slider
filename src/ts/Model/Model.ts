import Options from "../Interfaces/Options";
import observable from '../../../node_modules/@riotjs/observable/dist/observable';

export default class Model {
  private options: Options;
  private announcer: any = observable(this);

  constructor(options?: Options) {
    this.init(options);
  }

  onChange(callback) {
    this.announcer.on('change', callback);
  }

  private init(options? : Options) {
    this.options = options;
  }

  echo(msg): any {
    return msg;
  }
}