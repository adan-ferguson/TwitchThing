import React from 'react'
import PropTypes from 'prop-types'

import User from '../../user.js'

export default class UserInventory extends React.Component {

  static get propTypes() {
    return {
      user: PropTypes.instanceOf(User).isRequired
    }
  }

  constructor(props){
    super(props)
    this.state = {
      inventory: this.props.user.inventory.slice()
    }
  }

  render(){
    return (
      <div className='user-inventory'>
        {this.state.inventory}
      </div>
    )
  }
}