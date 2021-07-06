import React from 'react'
import PropTypes from 'prop-types'
import Footer from './footer'
import { CSSTransition } from 'react-transition-group'
import Main from './pages/main'

const T_SPEED = 300

export default class Game extends React.Component {

  static get propTypes(){
    return {
      user: PropTypes.object.isRequired
    }
  }

  constructor(props){
    super(props)
    this.state = {
      page: this.setPage(Main, {}, false),
      pageReady: false
    }
  }

  render(){
    return (
      <CSSTransition appear in={true} classNames='fade' timeout={T_SPEED}>
        <div className='game'>
          <CSSTransition in={this.state.pageReady} classNames='fade' timeout={T_SPEED}>
            <div className='page'>
              {this.state.page}
            </div>
          </CSSTransition>
          <Footer user={this.props.user}/>
        </div>
      </CSSTransition>
    )
  }

  setPage = (type, props = {}, changeState = true) => {

    if(changeState && !this.state.pageReady){
      return
    }

    const page = React.createElement(type, Object.assign({
      user: this.props.user,
      ready: () => this.setState({ pageReady: true }),
      changePage: this.setPage
    }, props))

    if(changeState){
      this.setState({ pageReady: false })
      setTimeout(() => {
        this.setState({ page })
      }, T_SPEED)
    }

    return page
  }
}