export default class ScaledValue{

  constructor(scalePct){
    this.scalePct = scalePct
  }

  getVal(iterations){
    return Math.pow(this.scalePct, iterations)
  }

  getIterations(val){
    return baseLog(this.scalePct, val)
  }
}

function baseLog(x, y){
  return Math.log(y) / Math.log(x)
}