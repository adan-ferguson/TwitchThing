export default function({ speed } = {}){
  return {
    polarity: 'debuff',
    stacking: 'stack',
    name: 'slowed',
    stats: {
      speed
    }
  }
}