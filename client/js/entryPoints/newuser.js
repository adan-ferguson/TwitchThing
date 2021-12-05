import DIForm from '../components/form.js'

const diform = new DIForm({
  submitButton: 'Save'
})
diform.addInput({
  type: 'text',
  name: 'displayname',
  minLength: 2,
  maxLength: 15,
  required: 'required',
  placeholder: 'Choose a username'
})
document.querySelector('.new-user-form').appendChild(diform)

if(window.ERROR){
  diform.addError(window.ERROR)
}

