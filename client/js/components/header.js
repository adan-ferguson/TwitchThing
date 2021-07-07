import React from 'react'
import PropTypes from 'prop-types'

import Main from './pages/main'
import Bonuses from './pages/bonuses'
import DevNotes from './pages/devnotes'

import TwitchMenuButton from './twitchMenuButton'
import User from '../user'

const TABS = [
  { tabName: 'Game', PageType: Main },
  { tabName: 'Bonuses', PageType: Bonuses },
  { tabName: 'Dev Notes', PageType: DevNotes }
]

export default class Header extends React.Component {

  static get propTypes(){
    return {
      currentPage: PropTypes.object.isRequired,
      changePage: PropTypes.func.isRequired,
      user: PropTypes.instanceOf(User).isRequired
    }
  }

  get currentPageTabName(){
    const tabInfo = TABS.find(({ PageType }) => {
      return this.props.currentPage.type === PageType
    })
    return tabInfo ? tabInfo.tabName : ''
  }

  constructor(props){
    super(props)
    this.state = {
      tabName: this.currentPageTabName
    }
  }

  componentDidUpdate(prevProps){
    if(this.props.currentPage !== prevProps.currentPage){
      if(this.currentPageTabName !== this.state.tabName){
        this.setState({ tabName: this.currentPageTabName })
      }
    }
  }

  render(){
    return (
      <div className='header'>
        <div className='tabs'>
          {
            TABS.map(({ tabName, PageType })  => (
              <button
                className={this.state.tabName === tabName ? 'active' : ''}
                key={tabName}
                onClick={() => {
                  if(this.state.tabName !== tabName){
                    this.setState({ tabName: tabName })
                    this.props.changePage(PageType)
                  }
                }}
              >
                {tabName}
              </button>
            ))
          }
        </div>
        {React.createElement(TwitchMenuButton, { user: this.props.user })}
      </div>
    )
  }
}