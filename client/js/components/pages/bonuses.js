import React from 'react'
import Page from './page'
import { post } from '../../fizzetch'

export default class Bonuses extends Page {

  render(){
    return <div>Loading...</div>
  }

  async componentDidMount(){
    this.setState({
      bonuses: await post('/bonuses')
    })
  }
}