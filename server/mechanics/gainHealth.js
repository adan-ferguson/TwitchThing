export function gainHealth(combat, actor, amount){
  const hpBefore = actor.hp
  actor.hp += amount
  return {
    healthGained: actor.hp - hpBefore
  }
}