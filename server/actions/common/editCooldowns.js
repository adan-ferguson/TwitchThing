
export function performRefreshCooldownsAction(combat, owner, effect, actionDef){
  owner.itemInstances.forEach(ii => {
    if(actionDef.excludeSelf && ii === effect){
      return
    }
    ii?.refreshCooldown(actionDef)
  })
}