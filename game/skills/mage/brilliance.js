export default function(level){
  return {
    effect: {
      transStats: [{
        from: 'combatXP',
        to: 'magicPower',
        ratio: 0.5 + level * 0.5
      }]
    }
  }
}