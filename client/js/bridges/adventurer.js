import fizzetch from '../fizzetch.js'
import Adventurer from '/game/adventurer.js'

export async function loadMyAdventurers(){
  const { adventurers, error } = await fizzetch('get', '/game/adventurers')
  if(error){
    throw error
  }
  return adventurers.map(adventurerDoc => new Adventurer(adventurerDoc))
}