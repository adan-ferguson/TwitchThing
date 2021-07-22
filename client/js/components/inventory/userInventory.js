import React from 'react'
import PropTypes from 'prop-types'

import User from '../../user.js'

export default class UserInventory extends React.Component {

  static get propTypes() {
    return {
      user: PropTypes.instanceOf(User).isRequired,
      loaded: PropTypes.func.isRequired
    }
  }

  constructor(props){
    super(props)
    this.state = {
      inventory: null
    }
    this.props.user.loadInventory().then(inventory => {
      this.setState({ inventory: inventory })
      this.props.loaded()
    })
  }

  render(){
    if(!this.state.inventory){
      return null
    }
    return (
      <div className='user-inventory'>
        {this.state.inventory}
      </div>
    )
  }
}