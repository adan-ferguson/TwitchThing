import React from 'react'
import PropTypes from 'prop-types'
import Character from '/client/js/character.js'

export default class CharacterStats extends React.Component {

  static get propTypes() {
    return {
      character: PropTypes.instanceOf(Character).isRequired
    }
  }

  constructor(props){
    super(props)
  }

  render() {
    const stats = this.props.character.stats
    return (
      <div className='character-stats'>
        <div>{this.props.character.name}</div>
        <div>Health: {stats.maxHealth}</div>
        <div>Damage: {stats.minDamage} - {stats.maxDamage}</div>
        <div>And whatever</div>
      </div>
    )
  }
}