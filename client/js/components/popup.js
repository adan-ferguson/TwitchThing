import SimpleModal from './simpleModal.js'
import { toArray } from 'lodash'
import { wrapContent } from '../../../game/utilFunctions.js'

const popupQueue = []

export function showPopup(data){
  popupQueue.push(...toArray(data))
  if(popupQueue.length === 1){
    showNext()
  }
}

function showNext(){
  const data = popupQueue[0]
  new SimpleModal(makeContent(data), { text: 'Okay' }, data.title)
    .show()
    .on('hide', () => {
      popupQueue.splice(0, 1)
      if(popupQueue.length){
        showNext()
      }
    })
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
  return content
}

function itemHtml(key, val){
  if(key === 'class'){
    return `Class Unlocked: Rogue ${}`
  }
}