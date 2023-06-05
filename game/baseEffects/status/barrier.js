export default function({ hp } = {}){
  return {
    name: 'barrier',
    polarity: 'buff',
    stacking: 'refresh',
    barrier: {
      hp
    },
  }
}