import SimpleModal from './simpleModal.js'

export function showPopup({ message }){
  debugger
  new SimpleModal(message, {
    text: 'Alright!'
  }).show()
}