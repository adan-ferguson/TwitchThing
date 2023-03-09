import all from './combined.js'

// Convert a skills obj to an array of AdventurerSkills
export default function(obj){
  const arr = []
  for(let cls in obj){
    for(let id in obj[cls]){
      arr.push(all[id])
    }
  }
  return arr
}