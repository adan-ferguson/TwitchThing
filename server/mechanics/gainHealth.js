export function gainHealth(actor, amount){
  const hpBefore = actor.hp
  actor.hp += amount
  return {
    subject: actor.uniqueID,
    healthGained: actor.hp - hpBefore
  }
}