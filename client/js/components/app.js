import React from 'react'
import Game from './game'
import { loadUser, createLoginLink } from '../twitch'

export default class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      loading: true,
      user: null,
      shouldLogIn: false
    }
    this._loadUser()
  }

  render(){
    if(this.state.user){
      return React.createElement(Game, { user: this.state.user })
    }else if(this.state.shouldLogIn){
      return createLoginLink()
    }else{
      return <p className='loading'>Loading...</p>
    }
  }

  async _loadUser() {
    const user = await loadUser()
    this.setState({ loading: false })
    setTimeout(() => {
      this.setState({ user: user, shouldLogIn: user ? false : true })
    }, 300)
  }
}