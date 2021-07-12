import React from 'react'
import Page from '../page'
import TwitchLoginLink from '../twitchLoginLink'
import { post } from '../../fizzetch'
import ChannelSettings from '../channelSettings'
import Channel from '../../channel'

export default class Main extends Page {

  constructor(props){
    super(props)
    this.state = {
      settings: false
    }
  }

  render(){
    return <div className='settings'>{this._renderSettings()}</div>
  }

  _renderSettings() {

    if (!this.state.settings) {
      return
    }

    if (!this.props.user.isAdmin) {
      return <div>No settings LOL</div>
    }

    return React.createElement(ChannelSettings, {
      channel: new Channel(this.state.settings.channel)
    })
  }

  async componentDidMount(){
    const settings = await post('/user/settings')
    this.setState({ settings })
    this.props.ready()
  }
}