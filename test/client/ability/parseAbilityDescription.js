import { parseDescriptionString } from '../../../client/js/descriptionString.js'


console.log(parseDescriptionString('Normal'))
console.log(parseDescriptionString('[P1.2]'))
console.log(parseDescriptionString('[M1.2]'))
console.log(parseDescriptionString('Blah blah [P0.7] and [M12]'))