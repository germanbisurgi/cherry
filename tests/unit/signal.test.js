var cherry = require('../../dist/cherry');
var signal = new cherry.Signal();
var valueA = '';
var valueB = '';

var listenerA = function (a, b) {
  valueA = a;
};
var listenerB = function (a, b) {
  valueB = b;
};


describe('Signal', function () {

  it('should have correct inital values', function () {
    expect(signal.listeners.used).toBe(0);
  });

  it('should add listener', function () {
    signal.add(listenerA);
    expect(signal.listeners.used).toBe(1);
  });

  it('should remove a listener', function () {
    signal.remove(listenerA);
    expect(signal.listeners.used).toBe(0);
  });

  it('should dispatch multiple signal with parameters', function () {
    signal.add(listenerA);
    signal.add(listenerB);
    expect(signal.listeners.used).toBe(2);
    signal.dispatch('aaa', 'bbb');
    expect(valueA).toBe('aaa');
    expect(valueB).toBe('bbb');
  });

  it('should remove all listeners', function () {
    signal.listeners.clear();
    expect(signal.listeners.used).toBe(0);
  });

// it('should add one time listener', function () {
// expect(signal.getTest()).toBe(null);
// });

// it('should disable', function () {
// expect(signal.getTest()).toBe(null);
// });

// it('should enable', function () {
// expect(signal.getTest()).toBe(null);
// });

// it('should prevent next listeners on the queue from being executed', function () {
// expect(signal.getTest()).toBe(null);
// });

// it('should execute by priority', function () {
// expect(signal.getTest()).toBe(null);
// });

// it('should disable signal binding', function () {
// expect(signal.getTest()).toBe(null);
// });

// it('should enable signal binding', function () {
// expect(signal.getTest()).toBe(null);
// });
});
