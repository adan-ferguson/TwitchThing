export default function({ hp } = {}){
  return {
    name: 'barrier',
    polarity: 'buff',
    stacking: 'replace',
    barrier: {
      hp
    },
  }
}