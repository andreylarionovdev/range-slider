export default interface Observable {
  on(event: string, callback: Function);
  trigger(event: string, ...any);
}
