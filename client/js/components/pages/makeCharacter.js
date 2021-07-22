import React from 'react'
import Page from '../page.js'
import { showLoader, hideLoader } from '../../misc/loaderOverlay.js'
import { post } from '../../fizzetch.js'
import Character from '/client/js/character.js'

export default class Main extends Page {

  constructor(props){
    super(props)
    this.name = React.createRef()
    this.state = {
      loading: false,
      errors: {}
    }
  }

  render(){
    return (
      <div className='input-form'>
        <div ref={this.name} className={this.state.errors.name ? 'has-error' : ''}>
          <label>
            Enter New Character Name:
            <input readOnly={this.state.loading} type='text' onKeyDown={e => {
              if(e.key === 'Enter'){
                this.submit()
              }
            }}/>
          </label>
          <div className='error-message'>{this.state.errors.name}</div>
        </div>
        <br/>
        <button className='create' onClick={this.submit}>Create</button>
        <div className='error-message'>{this.state.errors.request || ''}</div>
      </div>
    )
  }

  submit = async () => {

    if(this.state.loading){
      return
    }

    this.setState({ errors: {} })
    const name = this.name.current.querySelector('input').value.trim()

    if(!name.length){
      this.setState(({ errors: { name: 'Name can not be empty' } }))
      return
    }

    showLoader()

    const result = await post('/user/makecharacter', {
      name
    })

    if(result.errors){
      this.setState({ errors: result.errors })
      hideLoader()
    }else{
      const newCharacter = new Character(result)
      this.props.user.addCharacter(newCharacter)
      this.props.changePage()
    }
  }
}