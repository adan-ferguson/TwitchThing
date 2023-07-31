import elementalBreath from './chimera/elementalBreath.js'
import furiousStrikes from './chimera/furiousStrikes.js'
import maybe from './common/maybe.js'
import random from './common/random.js'
import returnDamage from './common/returnDamage.js'
import targetScaledAttack from './common/targetScaledAttack.js'
import balancedSmite from './paladin/balancedSmite.js'
import penance from './paladin/penance.js'
import shieldBash from './paladin/shieldBash.js'
import shieldsUp from './paladin/shieldsUp.js'
import spikedShield from './paladin/spikedShield.js'
import theBountyCollectorKill from './rogue/theBountyCollectorKill.js'
import breakItem from './monster/breakItem.js'
import explode from './monster/explode.js'
import fireSpiritExplode from './monster/fireSpiritExplode.js'
import mushroomSpores from './monster/mushroomSpores.js'
import painTrain from './monster/painTrain.js'
import terribleCurse from './monster/terribleCurse.js'
import terribleSituation from './monster/terribleSituation.js'
export default { elementalBreath: { def: elementalBreath, id: 'elementalBreath', group: 'chimera' },furiousStrikes: { def: furiousStrikes, id: 'furiousStrikes', group: 'chimera' },maybe: { def: maybe, id: 'maybe', group: 'common' },random: { def: random, id: 'random', group: 'common' },returnDamage: { def: returnDamage, id: 'returnDamage', group: 'common' },targetScaledAttack: { def: targetScaledAttack, id: 'targetScaledAttack', group: 'common' },balancedSmite: { def: balancedSmite, id: 'balancedSmite', group: 'paladin' },penance: { def: penance, id: 'penance', group: 'paladin' },shieldBash: { def: shieldBash, id: 'shieldBash', group: 'paladin' },shieldsUp: { def: shieldsUp, id: 'shieldsUp', group: 'paladin' },spikedShield: { def: spikedShield, id: 'spikedShield', group: 'paladin' },theBountyCollectorKill: { def: theBountyCollectorKill, id: 'theBountyCollectorKill', group: 'rogue' },breakItem: { def: breakItem, id: 'breakItem', group: 'monster' },explode: { def: explode, id: 'explode', group: 'monster' },fireSpiritExplode: { def: fireSpiritExplode, id: 'fireSpiritExplode', group: 'monster' },mushroomSpores: { def: mushroomSpores, id: 'mushroomSpores', group: 'monster' },painTrain: { def: painTrain, id: 'painTrain', group: 'monster' },terribleCurse: { def: terribleCurse, id: 'terribleCurse', group: 'monster' },terribleSituation: { def: terribleSituation, id: 'terribleSituation', group: 'monster' } }
export const chimera = { elementalBreath: { def: elementalBreath, id: 'elementalBreath', group: 'chimera' },furiousStrikes: { def: furiousStrikes, id: 'furiousStrikes', group: 'chimera' } }
export const common = { maybe: { def: maybe, id: 'maybe', group: 'common' },random: { def: random, id: 'random', group: 'common' },returnDamage: { def: returnDamage, id: 'returnDamage', group: 'common' },targetScaledAttack: { def: targetScaledAttack, id: 'targetScaledAttack', group: 'common' } }
export const paladin = { balancedSmite: { def: balancedSmite, id: 'balancedSmite', group: 'paladin' },penance: { def: penance, id: 'penance', group: 'paladin' },shieldBash: { def: shieldBash, id: 'shieldBash', group: 'paladin' },shieldsUp: { def: shieldsUp, id: 'shieldsUp', group: 'paladin' },spikedShield: { def: spikedShield, id: 'spikedShield', group: 'paladin' } }
export const rogue = { theBountyCollectorKill: { def: theBountyCollectorKill, id: 'theBountyCollectorKill', group: 'rogue' } }
export const monster = { breakItem: { def: breakItem, id: 'breakItem', group: 'monster' },explode: { def: explode, id: 'explode', group: 'monster' },fireSpiritExplode: { def: fireSpiritExplode, id: 'fireSpiritExplode', group: 'monster' },mushroomSpores: { def: mushroomSpores, id: 'mushroomSpores', group: 'monster' },painTrain: { def: painTrain, id: 'painTrain', group: 'monster' },terribleCurse: { def: terribleCurse, id: 'terribleCurse', group: 'monster' },terribleSituation: { def: terribleSituation, id: 'terribleSituation', group: 'monster' } }
