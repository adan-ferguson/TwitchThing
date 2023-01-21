import Modal from './modal.js'

export default class FormModal extends Modal{
  constructor(form){
    super()
    this.innerContent.appendChild(form)
    form.addEventListener('success', () => this.hide())
  }
}
customElements.define('di-form-modal', FormModal)