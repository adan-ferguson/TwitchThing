export default function(options, argsArray){
  const totalWeight = options.reduce((val, option) => val + option.weight, 0)
  const fn = getFn(Math.random() * totalWeight)
  return fn(...argsArray)

  function getFn(targetWeight){
    let currentWeight = 0
    for(let i = 0; i < options.length; i++){
      let o = options[i]
      if(currentWeight + o.weight > targetWeight){
        return o.fn
      }
    }
  }
}