import { chooseMulti, chooseOne, randomRound } from '../../game/rando.js'
import scaledValue from '../../game/scaledValue.js'
import { StatBonusCategory, StatDefinitions, StatType } from '../../game/stats/statDefinitions.js'

const BONUS_BASE_WEIGHT = 20
const BONUS_WEIGHT_GROWTH = 0.1

const RARITY_TO_BONUS_CHANCE = {
  1: 60,
  2: 30,
  3: 10
}

const NUM_BONUS_CHOICES_CHANCE = {
  1: 60,
  2: 30,
  3: 10
}

const NUM_BONUS_CHOICES_WEIGHT = {
  1: 1,
  2: 1.1,
  3: 1.2
}

export function calculateBonusOptions(stats, level){

  const allBonusOptions = {
    [StatBonusCategory.OFFENSIVE]: {},
    [StatBonusCategory.DEFENSIVE]: {},
    [StatBonusCategory.ADVENTURING]: {}
  }

  // TODO: just use relevant stats to the adventurer
  for(let type in StatDefinitions){
    const stat = StatDefinitions[type]
    if(allBonusOptions[stat.category]){
      allBonusOptions[stat.category][type] = stat
    }
  }

  const randomlySelectedBonusOptions = {}

  for(let type in allBonusOptions){
    randomlySelectedBonusOptions[type] = pickSome(allBonusOptions[type])
  }

  return randomlySelectedBonusOptions

  function pickSome(choices){

    let numChoices = chooseOne(NUM_BONUS_CHOICES_CHANCE)
    numChoices = Math.min(Object.keys(choices).length, numChoices)

    const weightedChoices = Object.keys(choices).map(type => {
      return {
        weight: RARITY_TO_BONUS_CHANCE[choices[type].rarity] || 0, value: type
      }
    })

    const picked = chooseMulti(weightedChoices, numChoices)
    const bonusScaling = scaledValue(BONUS_WEIGHT_GROWTH, level)
    const bonusWeight = BONUS_BASE_WEIGHT * NUM_BONUS_CHOICES_WEIGHT[numChoices] / numChoices

    const randomOptions = {}
    picked.forEach(type => {
      const statDef = choices[type]
      const weightedVal = bonusWeight * (statDef.scaling ? bonusScaling : 1) / statDef.weight
      if(statDef.type === StatType.COMPOSITE){
        randomOptions[type] = Math.max(1, randomRound(weightedVal))
      }else if(statDef.type === StatType.PERCENTAGE){
        randomOptions[type] = weightedVal.toFixed(2)
      }else{
        randomOptions[type] = (1 + weightedVal).toFixed(2)
      }
    })

    return randomOptions
  }
}