import React from 'react'
import Game from './game'
import { loadUser, createLoginLink } from '../twitch'

export default class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      loading: true,
      user: null
    }
  }

  render(){
    if(this.state.user){
      return React.createElement(Game, { user: this.state.user })
    }else if(this.state.loading){
      return <p>Loading...</p>
    }else {
      return createLoginLink()
    }
  }

  async componentDidMount() {
    this.setState({ user: await loadUser(), loading: false })
  }
}