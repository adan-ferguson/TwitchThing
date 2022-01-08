/**
 * @param adventurer
 * @param dungeonRun
 * @returns {Event|null} If it's a new event, return it, otherwise return null.
 */
export async function generateEvent(adventurer, dungeonRun){
  if(dungeonRun.events.length >= 10){
    return {
      finished: true,
      message: 'You leave because it\'s really boring.'
    }
  }
  return {
    rewards: {
      xp: 20 + Math.floor(11 * Math.random())
    },
    message: `${adventurer.name} finds an ancient tablet and learns various things.`
  }
}