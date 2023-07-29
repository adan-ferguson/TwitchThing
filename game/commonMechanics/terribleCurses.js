function terribleCurse(def){
  return {
    applyStatusEffect: {
      targets: 'enemy',
      statusEffect: {
        tags: ['terribleCurse'],
        polarity: 'debuff',
        persisting: true,
        stackingId: 'terribleCurse',
        ...def
      }
    }
  }
}

const agony = terribleCurse({
  name: 'TERRIBLE Curse: Feebleness',
  stats: {
    hpMax: '0.5x'
  }
})

const suffering = terribleCurse({
  name: 'TERRIBLE Curse: Suffering',
  stats: {
    healing: '0.5x',
    barrierPower: '0.5x'
  }
})

const debilitation = terribleCurse({
  name: 'TERRIBLE Curse: Weakness',
  stats: {
    magicPower: '0.5x',
    physPower: '0.5x'
  }
})

const vulnerability = terribleCurse({
  name: 'TERRIBLE Curse: Frailty',
  stats: {
    magicDef: '0.5x',
    physDef: '0.5x'
  }
})

const simplicity = terribleCurse({
  name: 'TERRIBLE Curse: Stupidity',
  stats: {
    cooldownMultiplier: '2x'
  }
})

const lethargy = terribleCurse({
  name: 'TERRIBLE Curse: Lethargy',
  statsModifiers: {
    speed: {
      maxValue: 0
    }
  }
})

export function terribleCurses(){
  return [vulnerability] //[agony, suffering, debilitation, vulnerability, simplicity, lethargy]
}