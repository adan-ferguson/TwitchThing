export default function(combat, actor, abilityInstance, actionDef, triggerData){
  if(actionDef.chance < Math.random()){
    return null
  }else{
    return actionDef.action
  }
}