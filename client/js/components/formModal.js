import Modal from './modal.js'

export default class FormModal extends Modal {
  constructor(form){
    super()
    this.innerPane.appendChild(form)
    form.on('success', () => this.hide())
  }
}