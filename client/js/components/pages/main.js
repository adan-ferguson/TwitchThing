import React from 'react'
import Page from './page'
import Bonuses from './bonuses'

export default class Main extends Page {

  render(){
    return (
      <div>
        <p>No gameplay LOL!</p>
        <button onClick={() => this.props.changePage(Bonuses)}>View Bonuses</button>
      </div>
    )
  }
}