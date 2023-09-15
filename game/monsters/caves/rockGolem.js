export default function(tier){
  return {
    baseStats: {
      hpMax: '+30%',
      physPower: '+110%',
      speed: -110,
      physDef: tier ? '99%' : '50%'
    }
  }
}