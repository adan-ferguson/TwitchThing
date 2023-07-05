export default function(level){
  const magicPower = 2 + level
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 20000 + level * 10000,
        actions: [{
          elementalBreath: {
            magicPower,
            burn: magicPower / 10,
            slow: 10 + level * 10,
            weaken: Math.pow(0.9, level + 1)
          }
        }]
      }],
      displayName: 'Dragon Breath'
    }
  }
}