import warriorOrbIcon from '/client/assets/icons/orbs/warrior.svg'

export default function(className){

  // Adventurer Classes
  if(className === 'warrior'){
    return {
      description: 'Some description',
      orbIcon: warriorOrbIcon
    }
  }

  return {}
}