var naive = {
  Debug: Debug,
  Game: Game,
  Loop: Loop,
  Pool: Pool,
  Signal: Signal,
  State: State,
  StateManager: StateManager
}

if (typeof module !== 'undefined') {
  module.exports = naive;
}
