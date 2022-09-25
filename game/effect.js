export default class Effect{

  constructor(effectDef){
    this._effectDef = effectDef

    const baseEffectDef = Effects[effectDef.id]

    this._options = {
      id: null, // required
      displayName: null,
      stacking: false, // false | true | 'replace'
      duration: null, // null | integer
      buff: false, // boolean
      mods: [],
      stats: {},
      ...baseEffectDef,
      ...effectDef
    }
  }

  get stateVal(){
    return {

    }
  }

  get initialDuration(){
    return this._effectDef.duration
  }

  get timeleft(){

  }
}