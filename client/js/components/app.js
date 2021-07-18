import React from 'react'
import Game from './game.js'
import { loadUser, createLoginLink } from '../twitch.js'

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
    }
    return null
  }

  async _loadUser() {
    const user = await loadUser()
    this.setState({ loading: false })
    setTimeout(() => {
      this.setState({ user: user, shouldLogIn: user ? false : true })
    }, 300)
  }
}