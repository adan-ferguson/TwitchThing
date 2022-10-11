export default function(def){
  return {
    affects: 'self', // 'self' | 'enemy'
    count: 1, // integer, 'all'
    isBuff: false, // boolean
    order: 'newest', // 'newest' | 'oldest' | function
    ...def,
    type: 'removeStatusEffect'
  }
}