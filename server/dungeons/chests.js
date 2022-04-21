import { generateRandomItemDef } from '../items/generator.js'

export function generateRandomChest(dungeonRun, options = {}){

  const features = dungeonRun.user.features
  const level = options.level || dungeonRun.floor
  const contents = {}

  // TODO: something that doesn't suck here
  const val = Math.ceil(Math.random() * level)
  if(features['items']){
    contents.items = [generateRandomItemDef(val)]
  }

  return generateChest(contents, { ...options, level })
}

export function generateChest(contents, options = {}){
  return {
    contents,
    name: 'Chest',
    level: 1,
    tier: 1,
    ...options
  }
}