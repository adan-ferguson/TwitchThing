import { wrappedPct } from '../../growthFunctions.js'

const RING_1 = {
  stats: {
    goldFind: wrappedPct(77),
    chestFind: wrappedPct(77),
    critChance: 0.07,
    dodgeChance: '7%',
  }
}

const RING_2 = {
  stats: {
    goldFind: wrappedPct(7777),
    chestFind: wrappedPct(777),
    critChance: 0.77,
    dodgeChance: '7%',
  }
}

export default function(level){
  return {
    effect: level === 1 ? RING_1 : RING_2,
    orbs: level === 1 ? 7 : 77,
    scrapValue: level === 1 ? 77 : 777,
    maxLevel: 2
  }
}