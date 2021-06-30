import React from 'react'
import ReactDOM from 'react-dom'
import { loadUser, TwitchLoginLink } from './twitch'
import { Game } from './game'

class App extends React.Component {

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
      return <TwitchLoginLink/>
    }
  }

  async componentDidMount() {
    this.setState({ user: await loadUser(), loading: false })
  }
}

ReactDOM.render(<App />, document.querySelector('#root'))
