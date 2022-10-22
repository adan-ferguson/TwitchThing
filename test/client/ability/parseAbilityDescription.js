import { parseAbilityDescriptionString } from '../../../client/js/abilityDescription.js'


console.log(parseAbilityDescriptionString('Normal'))
console.log(parseAbilityDescriptionString('[P1.2]'))
console.log(parseAbilityDescriptionString('[M1.2]'))
console.log(parseAbilityDescriptionString('Blah blah [P0.7] and [M12]'))