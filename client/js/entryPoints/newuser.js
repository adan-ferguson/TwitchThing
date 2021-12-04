import DIForm from '../components/form.js'

const diform = new DIForm()
diform.addInput({
  type: 'text',
  name: 'displayname',
  minLength: 2,
  maxLength: 15,
  required: 'required',
  placeholder: 'Choose a username'
})
diform.addSubmitButton('Save')
document.querySelector('.new-user-form').appendChild(diform)

if(window.ERROR){
  diform.addError(window.ERROR)
}

