export class SimulatedStorage {

  private store:Object;

  constructor(){
    this.store = new Object()
  }
  
  /**
   * getItem 模仿localstorage的getItem接口
   */
  public getItem = (key: string): string => {
    let result = null;
    if (this.store.hasOwnProperty(key)) {
      result = this.store[key];
    }
    return result;
  }

  /**
   * setItem 模仿localstorage的setItem接口
   */
  public setItem = (key: string, value: string): void => {
    this.store[key] = value;
  }

  /**
   * removeItem
   */
  public removeItem = (key: string): void => {
    if (this.store.hasOwnProperty(key)) {
      delete this.store[key]
    }
  }
}