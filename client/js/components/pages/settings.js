import React from 'react'
import Page from '../page.js'
import { post } from '../../fizzetch.js'
import ChannelSettings from '../channelSettings.js'

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
      channelSettings: this.state.settings.channelSettings
    })
  }

  async componentDidMount(){
    const settings = await post('/user/settings')
    this.setState({ settings })
    this.props.ready()
  }
}