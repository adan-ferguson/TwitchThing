import classDisplayInfo from '../classDisplayInfo.js'
import { makeEl } from '../../../game/utilFunctions.js'

const CHEST_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
<g stroke-width="0">
<path d="M2,50 L0,27 L17,27 L18,32 L32,32 L33,27 L50,27 L48,50"/>
<path d="M0,25 L2,6 L8,3 L42,3 L48,6 L50,25 L33,25 L32,17 L18,17 L17,25"/>
<rect x="23" y="21" width="4" height="8"/>
</g>
</svg>
`

const CHEST = orbSvg => `
<div class="chest-el">
  ${CHEST_SVG}
  <div class="absolute-center-both">${orbSvg}</div>
</div>
`

export default function(className){
  const classInfo = classDisplayInfo(className)
  const el = makeEl({
    content: CHEST(classInfo.icon),
    class: 'chest-image'
  })
  el.style.color = classInfo.color
  return el
}