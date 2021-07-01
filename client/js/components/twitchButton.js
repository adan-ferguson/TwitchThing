import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

const purpleButton = styled.button`
  background-color: #6441A4;
  color: white;
`

const purpleAnchor = styled.a`
  background-color: #6441A4;
  color: white;
`

export default class TwitchButton extends React.Component {

  static get propTypes(){
    return {
      isAnchor: PropTypes.bool
    }
  }

  static get defaultProps(){
    return {
      isAnchor: false
    }
  }

  constructor(props){
    super(props)
  }

  render(){
    if(this.props.isAnchor){
      return (
        <purpleAnchor>
          <FontAwesomeIcon icon={['fab', 'twitch']}/>
        </purpleAnchor>
      )
    }else{
      return (
        <purpleButton>
          <FontAwesomeIcon icon={['fab', 'twitch']}/>
        </purpleButton>
      )
    }
  }
}