export default function(level){
  return {
    effect: {
      transStats: [{
        from: 'combatXP',
        to: 'magicPower'
      }]
    },
    maxLevel: 1,
  }
}