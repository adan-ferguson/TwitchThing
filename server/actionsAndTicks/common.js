import { randomRound } from '../../game/rando.js'

export function gainHealth(actor, amount){
  const hpBefore = actor.hp
  actor.hp += amount
  const finalAmount = actor.hp - hpBefore
  if(finalAmount > 0){
    return {
      subject: actor.fighterId,
      resultType: 'gainHealth',
      amount: actor.hp - hpBefore
    }
  }
}

export function regen(fighterInstance){
  return gainHealth(randomRound(fighterInstance.hpMax * regen))
}
