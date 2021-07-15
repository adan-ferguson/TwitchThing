import React from 'react'
import Page from '../page'
import MakeCharacter from './makeCharacter'

export default class Main extends Page {

  constructor(props){
    super(props)
    if(!props.user.activeCharacter){
      props.changePage(MakeCharacter)
    }
  }

  render(){
    return (
      <div>
        <p>No gameplay LOL!</p>
      </div>
    )
  }
}