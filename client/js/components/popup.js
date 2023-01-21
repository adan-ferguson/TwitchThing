import SimpleModal from './simpleModal.js'

export function showPopup({ message }){
  new SimpleModal(message.replace(/\n/g, '<br/>'), {
    text: 'Alright!'
  }).show()
}