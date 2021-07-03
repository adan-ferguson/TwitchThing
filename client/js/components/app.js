import React from 'react'
import Game from './game'
import { loadUser, createLoginLink } from '../twitch'
import { CSSTransition } from 'react-transition-group'

export default class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      loading: true,
      user: null,
      shouldLogIn: false
    }
  }

  render(){
    if(this.state.user){
      return React.createElement(Game, { user: this.state.user })
    }else if(this.state.shouldLogIn){
      return createLoginLink()
    }else{
      return (
        <CSSTransition in={this.state.loading} classNames='fade' timeout={300}>
          <p className='loading'>Loading...</p>
        </CSSTransition>
      )
    }
  }

  async componentDidMount() {

    const user = await loadUser()

    setTimeout(() => {
      this.setState({ loading: false })
      setTimeout(() => {
        this.setState({ user: user, shouldLogIn: user ? false : true })
      }, 300)
    }, 600)

  }
}