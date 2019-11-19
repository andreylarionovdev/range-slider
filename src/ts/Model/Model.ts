import Options from "../Interfaces/Options";

export default class Model {
  private options: Options;

  constructor(options?: Options) {
    this.init(options);
  }

  private init(options? : Options) {
    this.options = options;
  }

  echo(msg): any {
    return msg;
  }
}