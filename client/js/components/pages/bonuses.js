import React from 'react'
import Page from './page'
import { post } from '../../fizzetch'
import PropTypes from 'prop-types'

export default class Bonuses extends Page {

  constructor(props){
    super(props)
    this.state = {
      bonuses: []
    }
  }

  render(){
    return (
      <div className='bonus-list'>
        {this.state.bonuses.map(bonus => <BonusRow key={bonus._id} bonus={bonus}/>)}
      </div>
    )
  }

  async componentDidMount(){
    debugger
    const bonuses = await post('/bonuses')
    this.setState({ bonuses })
    this.props.ready()
  }
}

class BonusRow extends React.Component {

  static get propTypes(){
    return {
      bonus: PropTypes.object.isRequired
    }
  }

  render(){
    return <div>Some Bonus LOL</div>
  }

}