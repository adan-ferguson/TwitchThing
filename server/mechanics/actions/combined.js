import applyStatusEffect from './common/applyStatusEffect.js'
import attack from './common/attack.js'
import dealDamage from './common/dealDamage.js'
import gainHealth from './common/gainHealth.js'
import modifyAbility from './common/modifyAbility.js'
import pass from './common/pass.js'
import removeStatusEffect from './common/removeStatusEffect.js'
import takeDamage from './common/takeDamage.js'
import useAbility from './common/useAbility.js'
import balancedSmite from './paladin/balancedSmite.js'
import shieldsUp from './paladin/shieldsUp.js'
export default { applyStatusEffect: { def: applyStatusEffect, id: 'applyStatusEffect', group: 'common' },attack: { def: attack, id: 'attack', group: 'common' },dealDamage: { def: dealDamage, id: 'dealDamage', group: 'common' },gainHealth: { def: gainHealth, id: 'gainHealth', group: 'common' },modifyAbility: { def: modifyAbility, id: 'modifyAbility', group: 'common' },pass: { def: pass, id: 'pass', group: 'common' },removeStatusEffect: { def: removeStatusEffect, id: 'removeStatusEffect', group: 'common' },takeDamage: { def: takeDamage, id: 'takeDamage', group: 'common' },useAbility: { def: useAbility, id: 'useAbility', group: 'common' },balancedSmite: { def: balancedSmite, id: 'balancedSmite', group: 'paladin' },shieldsUp: { def: shieldsUp, id: 'shieldsUp', group: 'paladin' } }
export const common = { applyStatusEffect: { def: applyStatusEffect, id: 'applyStatusEffect', group: 'common' },attack: { def: attack, id: 'attack', group: 'common' },dealDamage: { def: dealDamage, id: 'dealDamage', group: 'common' },gainHealth: { def: gainHealth, id: 'gainHealth', group: 'common' },modifyAbility: { def: modifyAbility, id: 'modifyAbility', group: 'common' },pass: { def: pass, id: 'pass', group: 'common' },removeStatusEffect: { def: removeStatusEffect, id: 'removeStatusEffect', group: 'common' },takeDamage: { def: takeDamage, id: 'takeDamage', group: 'common' },useAbility: { def: useAbility, id: 'useAbility', group: 'common' } }
export const paladin = { balancedSmite: { def: balancedSmite, id: 'balancedSmite', group: 'paladin' },shieldsUp: { def: shieldsUp, id: 'shieldsUp', group: 'paladin' } }
