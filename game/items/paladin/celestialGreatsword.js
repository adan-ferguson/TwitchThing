export default function(level){
  return {
    orbs: level * 10 + 5,
    effect: {
      stats: {
        physPower: (level + 1) + 'x',
        magicPower: (level + 1) + 'x'
      }
    }
  }
}