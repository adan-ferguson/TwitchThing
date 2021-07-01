import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TwitchButton from './twitchButton'

export default class TwitchMenuButton extends React.Component {

  static get propTypes(){
    return {
      user: PropTypes.object
    }
  }

  render(){
    return (
      <TwitchButton>
        {this.props.user.name}
        <FontAwesomeIcon icon={['fas', 'fa-caret-up']}/>
      </TwitchButton>
    )
  }
}