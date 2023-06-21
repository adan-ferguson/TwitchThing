import balancedSmite from './paladin/balancedSmite.js'
import penance from './paladin/penance.js'
import shieldsUp from './paladin/shieldsUp.js'
import spikedShield from './paladin/spikedShield.js'
import applyStatusEffect from './common/applyStatusEffect.js'
import attack from './common/attack.js'
import breakItem from './common/breakItem.js'
import dealDamage from './common/dealDamage.js'
import gainHealth from './common/gainHealth.js'
import modifyAbility from './common/modifyAbility.js'
import modifyStatusEffect from './common/modifyStatusEffect.js'
import pass from './common/pass.js'
import removeStatusEffect from './common/removeStatusEffect.js'
import takeDamage from './common/takeDamage.js'
import useAbility from './common/useAbility.js'
export default { balancedSmite: { def: balancedSmite, id: 'balancedSmite', group: 'paladin' },penance: { def: penance, id: 'penance', group: 'paladin' },shieldsUp: { def: shieldsUp, id: 'shieldsUp', group: 'paladin' },spikedShield: { def: spikedShield, id: 'spikedShield', group: 'paladin' },applyStatusEffect: { def: applyStatusEffect, id: 'applyStatusEffect', group: 'common' },attack: { def: attack, id: 'attack', group: 'common' },breakItem: { def: breakItem, id: 'breakItem', group: 'common' },dealDamage: { def: dealDamage, id: 'dealDamage', group: 'common' },gainHealth: { def: gainHealth, id: 'gainHealth', group: 'common' },modifyAbility: { def: modifyAbility, id: 'modifyAbility', group: 'common' },modifyStatusEffect: { def: modifyStatusEffect, id: 'modifyStatusEffect', group: 'common' },pass: { def: pass, id: 'pass', group: 'common' },removeStatusEffect: { def: removeStatusEffect, id: 'removeStatusEffect', group: 'common' },takeDamage: { def: takeDamage, id: 'takeDamage', group: 'common' },useAbility: { def: useAbility, id: 'useAbility', group: 'common' } }
export const paladin = { balancedSmite: { def: balancedSmite, id: 'balancedSmite', group: 'paladin' },penance: { def: penance, id: 'penance', group: 'paladin' },shieldsUp: { def: shieldsUp, id: 'shieldsUp', group: 'paladin' },spikedShield: { def: spikedShield, id: 'spikedShield', group: 'paladin' } }
export const common = { applyStatusEffect: { def: applyStatusEffect, id: 'applyStatusEffect', group: 'common' },attack: { def: attack, id: 'attack', group: 'common' },breakItem: { def: breakItem, id: 'breakItem', group: 'common' },dealDamage: { def: dealDamage, id: 'dealDamage', group: 'common' },gainHealth: { def: gainHealth, id: 'gainHealth', group: 'common' },modifyAbility: { def: modifyAbility, id: 'modifyAbility', group: 'common' },modifyStatusEffect: { def: modifyStatusEffect, id: 'modifyStatusEffect', group: 'common' },pass: { def: pass, id: 'pass', group: 'common' },removeStatusEffect: { def: removeStatusEffect, id: 'removeStatusEffect', group: 'common' },takeDamage: { def: takeDamage, id: 'takeDamage', group: 'common' },useAbility: { def: useAbility, id: 'useAbility', group: 'common' } }
