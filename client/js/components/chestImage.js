import classDisplayInfo from '../displayInfo/classDisplayInfo.js'
import { ICON_SVGS, modifySvgString } from '../assetLoader.js'

export default function(className){
  const classInfo = classDisplayInfo(className)
  const chestSvg = ICON_SVGS.chest
  return modifySvgString(chestSvg, { fill: classInfo.color })
}