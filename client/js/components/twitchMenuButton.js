import React from 'react'
import PropTypes from 'prop-types'
import User from '../user'

export default class TwitchMenuButton extends React.Component {

  static get propTypes(){
    return {
      user: PropTypes.instanceOf(User),
      changePage: PropTypes.func.isRequired
    }
  }

  constructor(props){
    super(props)
    this.state = {
      showMenu: false
    }
  }

  render(){
    return (
      <div className='twitch-menu-button'>
        <button className='twitch-button' onClick={this._showMenu}>
          <i className='fab fa-twitch'/>
          {this.props.user.data.displayname}
          <i className='fas fa-caret-down'/>
        </button>
        { this.state.showMenu ? this._makeMenu() : null }
      </div>
    )
  }

  _makeMenu(){

    const menuItems = []
    menuItems.push(<button key='settings' onClick={this.props.changePage()}>Settings</button>)
    menuItems.push(<button key='logout' onClick={this._logout}>Logout</button>)

    return (
      <div className='menu'>
        { menuItems }
      </div>
    )
  }

  _settings = () => {

  }

  _logout = () => {
    localStorage.clear()
    window.location = '/logout'
  }

  _showMenu = e => {
    e.stopPropagation()

    if(this.state.showMenu){
      return this._closeMenu()
    }

    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this._closeMenu)
    })
  }

  _closeMenu = () => {
    this.setState({ showMenu: false }, () => {
      document.removeEventListener('click', this._closeMenu)
    })
  }
}