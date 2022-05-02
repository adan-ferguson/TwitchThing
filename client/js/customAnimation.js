export default class CustomAnimation{

  /**
   * Options:
   * duration - Length of animation
   * start    - Function to call immediately after the first animation frame, before the first tick
   * finish   - Function to call after the duration is finished, after the last tick.
   * tick     - Function to call after each animation frame. Provides a "pct" argument: The percentage of the animation progress.
   *
   * @param options
   */
  constructor(options){

    this.options = Object.assign({
      duration: 300,
      start: () => {},
      finish: () => {},
      cancel: () => {},
      // eslint-disable-next-line no-unused-vars
      tick: pct => {},
      easing: 'linear'
    }, options)

    this._go()
  }

  /**
   * Stops the animation, the "tick" and "finished" functions will no longer be executed.
   */
  cancel(){
    this.cancelled = true
    this.options.cancel()
  }

  finish(){
    this._finishForced = true
  }

  async _go(){

    // Wait for one frame but, don't be blocked by being tabbed out
    await new Promise(res => setTimeout(res))

    let starttime = new Date()
    let now = starttime

    // Run the onstart function.
    this.options.start()

    // Keep waiting one frame at a time until the duration has passed.
    // Call the tick function after each frame.
    while(now - starttime < this.options.duration){

      if(this.cancelled){
        return
      }

      if(this._finishForced){
        return this.options.finish()
      }

      await frame()
      now = new Date()
      const pct = Math.min(1, (now - starttime) / this.options.duration)
      this.options.tick(EASING_FNS[this.options.easing](pct))
    }

    this.options.finish()
  }
}

const EASING_FNS = {
  linear: x => x,
  easeOut: x => 1 - (1 - x) * (1 - x)
}

// Wait one frame
function frame(){
  return new Promise(done => {
    requestAnimationFrame(done)
  })
}