/**
 *
 * @param combat
 * @param subject
 * @param sourceInstance
 * @param statusEffect
 */
export function gainStatusEffect(combat, subject, sourceInstance, statusEffect){
  // const existing = subject.statusEffectInstances.find(sei => {
  //     if(effectData.stackingId && effectData.stackingId === statusEffectInstance.effectData.stackingId){
  //       return true
  //     }
  //     return effectData.sourceEffectId === statusEffectInstance.data.sourceEffectId
  //   return matches(sei)
  // })
  // if(existing){
  //   if(existing.stacking === 'replace'){
  //     const instance = new StatusEffectInstance(statusEffectData, this._fighterInstance)
  //     this._instances[index] = instance
  //     return instance
  //   }else if(existing.stacking === 'extend'){
  //     return existing.extend(new StatusEffectInstance(statusEffectData, this._fighterInstance).duration)
  //   }else if(existing.stacking === true){
  //     return existing.addStack().refresh()
  //   }
  // }
  subject.addStatusEffect(statusEffect)
}

//   add(statusEffectData){
//     const { existing, index } = this._getExisting(statusEffectData)
//     const instance = new StatusEffectInstance(statusEffectData, this._fighterInstance)
//     this._instances.push(instance)
//     return instance
//   }
//
//   remove(toRemove){
//     toRemove = toArray(toRemove)
//     this._instances = this._instances.filter(instance => {
//       if(toRemove.indexOf(instance) > -1){
//         return false
//       }
//       return true
//     })
//   }
//
//   /**
//    * @param id
//    * @returns {[object]}
//    */
//   getById(id){
//     if(!id){
//       return []
//     }
//     return this._instances.find(effect => effect.id === id)
//   }
//
//   getByType(effectType){
//     return this._instances.filter(effect => effect.type === effectType)
//   }
//
//   hasType(effectType){
//     return this._instances.find(effect => effect.type === effectType) ? true : false
//   }
//
//   /**
//    * @private
//    */
//   _getExisting(effectData){
//     const index = this._instances.findIndex(statusEffectInstance => {
//       if(effectData.stackingId && effectData.stackingId === statusEffectInstance.effectData.stackingId){
//         return true
//       }
//       return effectData.sourceEffectId === statusEffectInstance.data.sourceEffectId
//     })
//     return {
//       index,
//       existing: this._instances[index]
//     }
//   }
// }