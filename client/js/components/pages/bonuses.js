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
      <div>
        <h1>Bonuses</h1>
        <div>
          You can gain bonus money by chatting on khananaphone&apos;s channel during a stream
          <ul>
            <li>100 money for the first chat of a stream</li>
            <li>10 money afterwards (5 minute cooldown)</li>
          </ul>
        </div>
        <table className='bonus-list'>
          <thead>
            <tr>
              <th>Channel</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {this.state.bonuses.map(bonus => <BonusRow key={bonus._id} bonus={bonus}/>)}
          </tbody>
        </table>
      </div>
    )
  }

  async componentDidMount(){
    const bonuses = await post('/user/bonuses')
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
    return (
      <tr className='bonus-row'>
        <td>{this.props.bonus.channelname}</td>
        <td>{this.props.bonus.type}</td>
        <td>{this.props.bonus.amount}</td>
        <td>{new Date(this.props.bonus.date).toLocaleString()}</td>
      </tr>
    )
  }

}