import SimpleModal from './simpleModal.js'

export function showPopup({ message }){
  new SimpleModal(message, {
    text: 'Alright!'
  }).show()
}