import React from 'react'
import Page from '../page.js'
import { showLoader, hideLoader } from '../../misc/loaderOverlay.js'

export default class Main extends Page {

  constructor(props){
    super(props)
    this.state = {
      loading: false
    }
  }

  render(){
    return (
      <div className='input-form'>
        <p>
          <label>
            Enter New Character Name:
            <input readOnly={this.state.loading} type='text' className='username' onKeyDown={e => {
              if(e.key === 'Enter'){
                this.submit()
              }
            }}/>
          </label>
        </p>
        <br/>
        <button className='create' onClick={this.submit}>Create</button>
      </div>
    )
  }

  submit = () => {

    if(this.state.loading){
      return
    }

    this.setState({
      loading: true
    })

    showLoader()
  }
}