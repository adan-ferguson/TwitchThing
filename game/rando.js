/**
 * Randomly round up or down in a statistical way.
 * Eg. 0.3 gets rounded to 0 70% of the time and 1 30% of the time.
 * @param val
 */
export function randomRound(val){
  return (val % 1) < Math.random() ? Math.floor(val) : Math.ceil(val)
}

export function chooseOne(choices){
  return chooseMulti(choices, 1)[0]
}

/**
 *
 * @param choices {object|array} {a: 10, b: 20} or [{weight: 10, value: a}, {weight: 20, value: b}]
 * @param amount
 * @returns {string[]|*[]}
 */
export function chooseMulti(choices, amount){

  if(!Array.isArray(choices)){
    choices = toArray(choices)
  }
  
  if(amount >= choices.length){
    return choices.map(choice => choice.value)
  }
  
  const totalWeight = choices.reduce((val, option) => val + option.weight, 0)
  const chosenIndexes = {}

  for(let i = 0; i < amount; i++){
    const chosen = choose(Math.random() * totalWeight, choices)
    if(chosenIndexes[chosen]){
      i--
    }else{
      chosenIndexes[chosen] = 1
    }
  }

  return Object.keys(chosenIndexes).map(index => choices[index].value)
}

function choose(targetWeight, choices){
  let currentWeight = 0
  for(let i = 0; i < choices.length; i++){
    let o = choices[i]
    if(currentWeight + o.weight > targetWeight){
      return i
    }
    currentWeight += o.weight
  }
}

function toArray(choicesObj){
  return Object.keys(choicesObj).map(key => {
    return {
      weight: choicesObj[key],
      value: key
    }
  })
}