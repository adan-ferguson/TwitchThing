export default class UpgradeData{

  constructor(arr){
    this._arr = arr
  }

  get repeatVal(){
    return this._arr.at(-1) === '...' ? this._arr.at(-2) : null
  }

  get maxLevel(){
    if(!this.repeatVal){
      return this._arr.length
    }
    return null
  }

  get(index){
    if(index >= this._arr.length || this._arr[index] === '...'){
      return this.repeatVal
    }
    return this._arr[index]
  }

  total(index){
    let sum = 0
    for(let i = 0; i < index; i++){
      sum += this.get(i)
    }
    return sum
  }
}