export default function(level){
  const per = Math.ceil(75 * Math.pow(0.85, level - 1))
  const damagePer = 0.5
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 15000,
        actions: [{
          furiousStrikes: {
            base: 2,
            per,
            damagePer,
          }
        }]
      }]
    }
  }
}