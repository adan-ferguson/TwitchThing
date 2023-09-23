import { magicAttackItem } from '../../commonMechanics/magicAttackItem.js'
import { counterspellAbility } from '../../commonMechanics/counterspellAbility.js'
import { flutteringAbility } from '../../commonMechanics/flutteringMonsterItem.js'

export default function(tier){

  const hex = function(def){
    return {
      applyStatusEffect: {
        targets: 'enemy',
        statusEffect: {
          duration: 60000,
          stackingId: 'hex',
          stacking: 'replace',
          polarity: 'debuff',
          persisting: true,
          ...def
        }
      }
    }
  }

  const frog = hex({
    name: 'Hex: Frog',
    stats: {
      physPower: '-50%',
      magicPower: '-50%',
    }
  })

  const slug = hex({
    name: 'Hex: Slug',
    stats: {
      speed: -200,
    }
  })

  const turtle = hex({
    name: 'Hex: Turtle',
    stats: {
      physDef: '+50%',
      physPower: '-25%',
      magicPower: '-25%',
      speed: -100
    }
  })

  const cat = hex({
    name: 'Hex: Cat',
    stats: {
      physPower: '-50%',
      magicPower: '-50%',
      speed: 50
    }
  })

  const crow = hex({
    name: 'Hex: Crow',
    stats: {
      physPower: '-50%',
      magicPower: '-50%',
      speed: 50
    },
    abilities: [flutteringAbility()]
  })

  const dragon = hex({
    name: 'Hex: ...Dragon?',
    stats: {
      physPower: '+200%',
      magicPower: '+200%',
      speed: 100
    },
    abilities: [{
      trigger: 'instant',
      initialCooldown: 10000,
      actions: [{
        attack: {
          scaling: {
            magicPower: 2.5
          },
          damageType: 'magic'
        }
      }]
    }],
    polarity: 'buff'
  })

  const options = [
    { weight: 20, value: frog },
    { weight: 15, value: cat },
    { weight: 10, value: turtle },
    { weight: 5, value: crow },
    { weight: 0.5, value: dragon },
  ]

  if(tier){
    options.push({
      weight: 40, value: slug,
    })
  }

  const items = [
    magicAttackItem(),
    {
      name: 'Hex',
      effect: {
        abilities: [{
          abilityId: 'hex',
          trigger: 'active',
          initialCooldown: 6000,
          uses: 1,
          actions: [{
            random: {
              options
            }
          }]
        }]
      }
    },
    {
      name: 'Counterspell',
      effect: {
        abilities: [counterspellAbility(15000)]
      }
    },
  ]

  if(tier){
    items.push(
      {
        name: 'Counterspell',
        effect: {
          abilities: [counterspellAbility(15000)]
        }
      }
    )
  }

  return {
    baseStats: {
      hpMax: '-30%',
      speed: -20 + tier * 40,
      magicPower: '+40%',
      magicDef: '+50%'
    },
    items
  }
}