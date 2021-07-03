import React from 'react'
import PropTypes from 'prop-types'
import User from '../user'
import TwitchMenuButton from './twitchMenuButton'
import { CSSTransition } from 'react-transition-group'
import Main from './pages/main'

export default class Game extends React.Component {

  static get propTypes(){
    return {
      user: PropTypes.object
    }
  }

  constructor(props){
    super(props)
    const page = React.createElement(Main, Object.assign({
      user: this.user,
      setPage: this.setPage
    }, props))
    this.state = { page }
  }

  render(){
    return (
      <CSSTransition appear in={true} classNames='fade' timeout={500}>
        <div className='game'>
          <div className='page'>
            {this.state.page}
          </div>
          <div className='footer'>
            <p>Exp: {this.props.user.exp}</p>
            <p>Money: {this.props.user.money}</p>
            {React.createElement(TwitchMenuButton, { user: this.props.user })}
          </div>
        </div>
      </CSSTransition>
    )
  }

  setPage = (type, props = {}) => {
    const page = React.createElement(type, Object.assign({
      user: this.user,
      setPage: this.setPage
    }, props))
    this.setState({ page })
  }
}