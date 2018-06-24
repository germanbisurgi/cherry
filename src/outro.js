var naive = {
  Debug: Debug,
  Game: Game,
  Loader: Loader,
  Loop: Loop,
  Pool: Pool,
  Signal: Signal,
  State: State,
  StateManager: StateManager
};

if (typeof module !== 'undefined') {
  module.exports = naive;
}
