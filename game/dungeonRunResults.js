export default function calculateResults(dungeonRunInstance){
  const finalEvent = dungeonRunInstance.events.at(-1).data
  return {
    xp: dungeonRunInstance.rewards.xp,
    chests: dungeonRunInstance.rewards.chests?.length ?? 0,
    time: finalEvent.time,
    startingFloor: dungeonRunInstance.doc.dungeonOptions.startingFloor,
    endingFloor: finalEvent.floor,
    finalEvent
  }
}