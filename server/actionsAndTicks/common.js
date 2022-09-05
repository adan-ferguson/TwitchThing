export function gainHealth(actor, amount){
  if(amount <= 0){
    return
  }
  const hpBefore = actor.hp
  actor.changeHpWithDecimals(amount)
  const finalAmount = actor.hp - hpBefore
  if(finalAmount > 0){
    return {
      subject: actor.uniqueID,
      resultType: 'gainHealth',
      amount: actor.hp - hpBefore
    }
  }
}

export function regen(fighterInstance){
  return gainHealth(fighterInstance, fighterInstance.baseHp * fighterInstance.stats.get('regen').value)
}
