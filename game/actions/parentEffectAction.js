export default function(def){
  return {
    refreshCooldown: false,
    ...def,
    type: 'parentEffectAction'
  }
}
