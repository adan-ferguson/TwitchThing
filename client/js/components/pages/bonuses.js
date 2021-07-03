import React from 'react'
import PropTypes from 'prop-types'

export default class Bonuses extends React.Component {

  static get propTypes(){
    return {
      setPage: PropTypes.func,
      user: PropTypes.object
    }
  }

  render(){
    return <div>Loading...</div>
  }
}