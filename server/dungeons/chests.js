import { generateRandomItemDef } from '../items/generator.js'

export function generateChest(options = {}){
  options = {
    name: 'Chest',
    level: null,
    tier: 1,
    contents: null,
    userFeatures: null,
    adventurerStats: null,
    ...options
  }
  if(!options.contents){
    if(options.level === null || options.userFeatures === null || options.adventurerStats === null){
      throw 'Can not auto-generate chests without providing a level, a features array, and an adventurer stats object.'
    }
    options.contents = generateContents(options.level, options.tier, options.userFeatures, options.adventurerStats)
  }
  return {
    name: options.name,
    level: options.level,
    tier: options.tier,
    contents: options.contents
  }
}

function generateContents(level, tier, enabledFeatures, stats){
  if(!enabledFeatures['items']){
    return []
  }
  // TODO: something that doesn't suck here
  const val = Math.ceil(Math.random() * level)
  return {
    items: [generateRandomItemDef(val)]
  }
}