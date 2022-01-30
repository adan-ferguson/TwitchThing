export default class CustomAnimation {

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
      // eslint-disable-next-line no-unused-vars
      tick: pct => {}
    }, options)

    this._go()
  }

  /**
   * Stops the animation, the "tick" and "finished" functions will no longer be executed.
   */
  cancel(){
    this.cancelled = true
  }

  async _go(){

    await frame()

    let starttime = new Date()
    let now = starttime

    // Run the onstart function.
    this.options.start()

    // Keep waiting one frame at a time until the duration has passed.
    // Call the tick function after each frame.
    while(now - starttime < this.options.duration){

      if(this.cancelled){
        this.options.finish()
        return
      }

      await frame()
      now = new Date()
      this.options.tick(Math.min(1, (now - starttime) / this.options.duration))
    }

    this.options.finish()
  }
}

/**
 * Create a basic animation.
 *
 * @param options
 * @return {Animation}
 */
Animation.basic = function(options){
  return new Animation(options)
}

// Wait one frame
function frame(){
  return new Promise(done => {
    requestAnimationFrame(done)
  })
}