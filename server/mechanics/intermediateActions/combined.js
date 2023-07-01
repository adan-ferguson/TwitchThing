import balancedSmite from './paladin/balancedSmite.js'
import penance from './paladin/penance.js'
import shieldsUp from './paladin/shieldsUp.js'
import spikedShield from './paladin/spikedShield.js'
import maybe from './common/maybe.js'
import random from './common/random.js'
import breakItem from './monster/breakItem.js'
import fireSpiritExplode from './monster/fireSpiritExplode.js'
import painTrain from './monster/painTrain.js'
import terribleCurse from './monster/terribleCurse.js'
import terribleSituation from './monster/terribleSituation.js'
import theBountyCollectorKill from './rogue/theBountyCollectorKill.js'
export default { balancedSmite: { def: balancedSmite, id: 'balancedSmite', group: 'paladin' },penance: { def: penance, id: 'penance', group: 'paladin' },shieldsUp: { def: shieldsUp, id: 'shieldsUp', group: 'paladin' },spikedShield: { def: spikedShield, id: 'spikedShield', group: 'paladin' },maybe: { def: maybe, id: 'maybe', group: 'common' },random: { def: random, id: 'random', group: 'common' },breakItem: { def: breakItem, id: 'breakItem', group: 'monster' },fireSpiritExplode: { def: fireSpiritExplode, id: 'fireSpiritExplode', group: 'monster' },painTrain: { def: painTrain, id: 'painTrain', group: 'monster' },terribleCurse: { def: terribleCurse, id: 'terribleCurse', group: 'monster' },terribleSituation: { def: terribleSituation, id: 'terribleSituation', group: 'monster' },theBountyCollectorKill: { def: theBountyCollectorKill, id: 'theBountyCollectorKill', group: 'rogue' } }
export const paladin = { balancedSmite: { def: balancedSmite, id: 'balancedSmite', group: 'paladin' },penance: { def: penance, id: 'penance', group: 'paladin' },shieldsUp: { def: shieldsUp, id: 'shieldsUp', group: 'paladin' },spikedShield: { def: spikedShield, id: 'spikedShield', group: 'paladin' } }
export const common = { maybe: { def: maybe, id: 'maybe', group: 'common' },random: { def: random, id: 'random', group: 'common' } }
export const monster = { breakItem: { def: breakItem, id: 'breakItem', group: 'monster' },fireSpiritExplode: { def: fireSpiritExplode, id: 'fireSpiritExplode', group: 'monster' },painTrain: { def: painTrain, id: 'painTrain', group: 'monster' },terribleCurse: { def: terribleCurse, id: 'terribleCurse', group: 'monster' },terribleSituation: { def: terribleSituation, id: 'terribleSituation', group: 'monster' } }
export const rogue = { theBountyCollectorKill: { def: theBountyCollectorKill, id: 'theBountyCollectorKill', group: 'rogue' } }
