import { dodgeAbility } from '../../abilities.js'

export default {
  baseStats: {
    speed: '+5%',
    hpMax: '-30%'
  },
  description: 'It\'s a giant bat. Look, just assume that all of the animals are giant, okay?',
  items: [
    {
      name: 'Fluttering',
      ability: dodgeAbility(10000)
    }
  ]
}