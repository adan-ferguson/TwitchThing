import React from 'react'
import PropTypes from 'prop-types'
import Bonuses from './bonuses'

export default class Main extends React.Component {

  static get propTypes(){
    return {
      setPage: PropTypes.func,
      user: PropTypes.object
    }
  }

  render(){
    return (
      <div>
        <p>No gameplay LOL!</p>
        <button onClick={() => this.props.setPage(Bonuses)}>View Bonuses</button>
      </div>
    )
  }
}