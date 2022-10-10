export default function(def){
  return {
    affects: 'self', // 'self' | 'enemy'
    count: 1, // integer, 'all'
    buff: false, // boolean
    ...def,
    type: 'removeStatusEffect'
  }
}