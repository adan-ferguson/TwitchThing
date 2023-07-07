export default function(level){
  const magicPower = 2 + level
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 30000 + level * 30000,
        actions: [{
          elementalBreath: {
            magicPower,
            burn: magicPower / 10,
            slow: 20 + level * 20,
            weaken: 0.8 * Math.pow(0.85, level - 1)
          }
        }]
      }],
    },
    displayName: 'Dragon Breath',
  }
}