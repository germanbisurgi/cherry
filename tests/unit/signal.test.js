var cherry = require('../../dist/cherry');
var signal = new cherry.Signal();
var valueA = '';
var valueB = '';
var valueC = 0;
var valueD = false;

var listenerA = function (a, b) {
  valueA = a;
};

var listenerB = function (a, b) {
  valueB = b;
};

var listenerC = function () {
  valueC++;
};

var listenerD = function () {
  valueD = true;
};

describe('Signal', function () {
  it('should have correct inital values', function () {
    expect(signal.enabled).toBe(true);
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
    signal.removeAll();
    expect(signal.listeners.used).toBe(0);
  });
  it('should add one time listener', function () {
    signal.addOnce(listenerC);
    signal.dispatch();
    expect(valueC).toBe(1);
    signal.dispatch();
    expect(valueC).toBe(1);
  });

  it('should disable and enable', function () {
    signal.removeAll();
    signal.add(listenerD);
    signal.enabled = false;
    signal.dispatch();
    expect(valueD).toBe(false);
    signal.enabled = true;
    signal.dispatch();
    expect(valueD).toBe(true);
  });

  it('should not add existing listeners', function () {
    signal.removeAll();
    signal.add(listenerD);
    expect(signal.has(listenerD)).toBe(true);
    expect(signal.listeners.used).toBe(1);
    signal.add(listenerD);
    expect(signal.listeners.used).toBe(1);
    signal.addOnce(listenerD);
    expect(signal.listeners.used).toBe(1);
  });

  // it('should prevent next listeners on the queue from being executed', function () {
  // expect(signal.getTest()).toBe(null);
  // });

  // it('should execute by priority', function () {
  // expect(signal.getTest()).toBe(null);
  // });

});
