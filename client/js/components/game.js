// import { showLoader, hideLoader } from '../misc/loaderOverlay.js'
//
// import User from '../game.js'
// import Header from './header.js'
// import Footer from './footer.js'
//
// import Bonuses from './pages/bonuses.js'
// import DevNotes from './pages/devnotes.js'
// import Main from './pages/main.js'
// import Admin from './pages/admin.js'
// import Settings from './pages/settings.js'
// const pageList = { Bonuses, DevNotes, Main, Settings, Admin }
//
// const T_SPEED = 300
//
// export default class Game extends React.Component {
//
//   static get propTypes(){
//     return {
//       user: PropTypes.instanceOf(User).isRequired
//     }
//   }
//
//   constructor(props){
//     super(props)
//     this.state = {
//       page: this.changePage(getInitialPage(), {}, false),
//       pageReady: false
//     }
//   }
//
//   render(){
//     return (
//       <CSSTransition appear in={true} classNames='fade' timeout={T_SPEED}>
//         <div className='game'>
//           <Header currentPage={this.state.page} changePage={this.changePage} user={this.props.user}/>
//           <CSSTransition in={this.state.pageReady} classNames='fade' timeout={T_SPEED}>
//             <div className='page'>
//               {this.state.page}
//             </div>
//           </CSSTransition>
//           <Footer changePage={this.changePage} user={this.props.user}/>
//         </div>
//       </CSSTransition>
//     )
//   }
//
//   changePage = (type = Main, props = {}, changeState = true) => {
//
//     const page = React.createElement(type, Object.assign({
//       user: this.props.user,
//       ready: () => {
//         if(this.state.page === page){
//           hideLoader()
//           this.setState({ pageReady: true })
//         }
//       },
//       changePage: this.changePage
//     }, props))
//
//     if(changeState){
//       this.setState({ pageReady: false })
//       showLoader()
//       setTimeout(() => {
//         this.setState({ page })
//       }, T_SPEED)
//     }
//
//     return page
//   }
// }
//
// function getInitialPage(){
//   let initialPage = (new URLSearchParams(window.location.search)).get('page') || 'Main'
//   initialPage = initialPage.toLowerCase()
//   initialPage = initialPage.slice(0, 1).toUpperCase() + initialPage.slice(1)
//   return pageList[initialPage] || Main
// }

const HTML = `
<div class='header'></div>
<div class='page'></div>
<div class='footer'></div>
`

export default class Game extends HTMLElement {

  constructor(user){
    super()
    this.user = user
    this.innerHTML = HTML
  }

  async setPage(page){
    if(this.currentPage){
      await this.currentPage.navigateFrom()
      this.currentPage.remove()
    }
    await page.navigateTo()
    this.querySelector(':scope > .content').appendChild(page)
    this.currentPage = page
  }
}

customElements.define('di-game', Game)