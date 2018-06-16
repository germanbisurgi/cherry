var naive = require('../../dist/naive');
var signal = new naive.Signal();
var valueA = '';
var valueB = '';
var valueC = 0;
var valueD = false;
var valueE = '';

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

var listener0 = function () {
  valueE += '0';
};
var listener1 = function () {
  valueE += '1';
};
var listener2 = function () {
  valueE += '2';
};
var listener3 = function () {
  valueE += '3';
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

  it('should execute by priority', function () {
    signal.removeAll();
    signal.add(listener3, 3);
    signal.add(listener1, 1);
    signal.add(listener2, 2);
    signal.add(listener0);
    signal.dispatch();
    expect(valueE).toBe('3210');
    valueE = '';
    signal.removeAll();
    signal.addOnce(listener3, 3);
    signal.addOnce(listener1, 1);
    signal.addOnce(listener2, 2);
    signal.addOnce(listener0);
    signal.dispatch();
    expect(valueE).toBe('3210');
  });

});
