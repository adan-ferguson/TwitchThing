import React from 'react'
import PropTypes from 'prop-types'
import User from '../user'

export default class Game extends React.Component {

  static get propTypes(){
    return {
      user: PropTypes.object
    }
  }

  constructor(props){
    super(props)
    this.user = new User(props.user)
  }

  render(){
    return (
      <div>
        <p>Name: {this.user.name}</p>
        <p>Exp: {this.user.exp}</p>
        <p>Money: {this.user.money}</p>
      </div>
    )
  }
}