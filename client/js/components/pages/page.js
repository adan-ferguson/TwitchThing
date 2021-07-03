import React from 'react'
import PropTypes from 'prop-types'

export default class Page extends React.Component {

  static get propTypes(){
    return {
      user: PropTypes.object.isRequired,
      ready: PropTypes.func.isRequired,
      changePage: PropTypes.func.isRequired
    }
  }

  componentDidMount() {
    this.props.ready()
  }

}