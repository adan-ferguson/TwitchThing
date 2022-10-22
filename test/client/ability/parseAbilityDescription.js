import { parseAbilityDescription } from '../../../client/js/abilityDescription.js'


console.log(parseAbilityDescription('Normal'))
console.log(parseAbilityDescription('[P1.2]'))
console.log(parseAbilityDescription('[M1.2]'))
console.log(parseAbilityDescription('Blah blah [P0.7] and [M12]'))