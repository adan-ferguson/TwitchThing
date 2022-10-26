export function chooseOne(choices){
  return chooseMulti(choices, 1)[0]
}

export function randomOrder(...fns){
  shuffle(fns).forEach(fn => fn())
}

export function shuffle(arr){
  return arr.sort(() => 0.5 - Math.random())
}

/**
 * Choices formats:
 * 1. Shorthand for choosing strings
 * {a: 10, b: 20}
 *
 * 2. Shorterhand for choosing anything except objects with weight/value defined
 * ['a', 2, { someobject: true }]
 *
 * 3. Objects must have "weight" and "value" defined or else it will act like above
 * [{weight: 10, value: a}, {weight: 20, value: b}]
 *
 * @param choices {object|array}
 * @param amount
 * @returns {string[]|*[]}
 */
export function chooseMulti(choices, amount){

  choices = normalize(choices)
  
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

/**
 * Convert other formats to format #3
 * @param choicesObj
 * @returns {{weight: *, value: *}[]}
 */
function normalize(choicesObj){

  if(!Array.isArray(choicesObj)){
    return Object.keys(choicesObj).map(key => {
      return {
        weight: choicesObj[key],
        value: key
      }
    })
  }

  const first = choicesObj[0]
  if(typeof first === 'object' && 'value' in first && 'weight' in first){
    // Format 3
    return choicesObj
  }

  // Format 2
  return choicesObj.map(choice => {
    return { weight: 1, value: choice }
  })
}