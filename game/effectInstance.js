export default class EffectInstance{

  /**
   * Something to identify this effect so that when we parse an action, we can find
   * the source of the action.
   *
   * @returns {string}
   */
  get id(){
    throw 'id not defined'
  }

  /**
   *
   */
  used(){

  }
}