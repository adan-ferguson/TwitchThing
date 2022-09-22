import { dodgeEffect } from './effects.js'
import { effectAction } from './actions.js'

/**
 * An ability that lets you automatically dodge the enemy's next ability.
 * @param cooldown
 * @returns {*&{cooldown: number, name: string, trigger: string, type: string, actions: {effect: *, affects: string, type: string}[]}}
 */
export function dodgeAbility(cooldown){
  return {
    type: 'triggered',
    trigger: 'beforeAttacked',
    cooldown,
    name: 'dodge',
    actions: [
      effectAction({
        type: 'dodge'
      })
    ]
  }
}