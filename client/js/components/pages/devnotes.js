import React from 'react'
import Page from '../page'

export default class DevNotes extends Page {
  render(){
    return (
      <div className='dev-notes'>
        <h3>2021-07-11</h3>
        <p>A bunch of whatnot</p>
        <h3>2021-07-06</h3>
        <p>Set up a bunch of stuff</p>
        <ul>
          <li>Login with Twitch</li>
          <li>Keep track of money</li>
          <li>Gain points by chatting or using channel points</li>
        </ul>
        <h3>TODO</h3>
        <ul>
          <li>Code an actual game? (LOL)</li>
          <li>Gain points for giving bits</li>
          <li>Gain points for subbing/donating sub</li>
          <li>Add more things to TODO list</li>
        </ul>
      </div>
    )
  }
}