import SimpleModal from './simpleModal.js'
import classDisplayInfo from '../displayInfo/classDisplayInfo.js'
import { ICON_SVGS } from '../assetLoader.js'
import { arrayize } from '../../../game/utilFunctions.js'
import prettyMilliseconds from 'pretty-ms'

const popupQueue = []

let running = false

export function showPopup(data){
  popupQueue.push(...arrayize(data))
  if(!popupQueue.length){
    return
  }
  if(!running){
    running = true
    showNext()
  }
}

async function showNext(){
  const data = popupQueue[0]
  const modal = new SimpleModal(makeContent(data), { text: 'Okay' }, data.title).show()
  await modal.awaitResult()
  popupQueue.splice(0, 1)
  if(popupQueue.length){
    showNext()
  }else{
    running = false
  }
}

function makeContent(data){
  let content = ''
  if(data.message){
    content += `<div class="message">${data.message.replace(/\n/g, '<br/>')}</div>`
  }
  if(data.items){
    const listItems = Object.keys(data.items).map(key => {
      return `<li>${itemHtml(key, data.items[key])}</li>`
    })
    content += `<ul>${listItems.join('')}</ul>`
  }
  if(data.time){
    content += `<hr/><div class="subtitle">Account Age: ${prettyMilliseconds(data.time, { verbose: true })}</div>`
  }
  return `<div class="popup-content">${content}</div>`
}

function itemHtml(key, val){
  if(key === 'class'){
    const classInfo = classDisplayInfo(val)
    return `Class Unlocked: ${classInfo.icon} ${classInfo.displayName}`
  }else if(key === 'gold'){
    return `${ICON_SVGS.gold}<span> +${val}</span>`
  }else if(key === 'scrap'){
    return `<i class="fa-solid fa-recycle"></i><span> +${val}</span>`
  }else if(key === 'zone'){
    return `Zone Unlocked: ${val}`
  }
  return '??? ERROR ERROR ???'
}