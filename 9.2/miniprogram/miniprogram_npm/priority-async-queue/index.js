module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1654603802730, function(require, module, exports) {
const AsyncQueue = require('./AsyncQueue');

module.exports = AsyncQueue;

}, function(modId) {var map = {"./AsyncQueue":1654603802731}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1654603802731, function(require, module, exports) {
const Event = require('./Event');
const PriorityQueue = require('./PriorityQueue');
const Task = require('./Task');

class AsyncQueue extends Event {
  /**
   * constructor
   * @param {number} executeLimit Number of concurrent，Default: 1.
   */
  constructor (executeLimit = 1) {
    super();
    this._pause = false;
    this.executeLimit = executeLimit;
    this.executingQueue = [];
    this.waitingQueue = new PriorityQueue();
    this.eventHandlerMap = {};
  }

  addTask (...args) {
    const task = new Task(...args);
    task.options.createTime = this.getNowTimestamp();
    if (this.executingQueue.length >= this.executeLimit || this.isPause) {
      this.waitingQueue.enqueue(task);
    } else {
      this.executeTask(task);
    }
    this.emit('addTask', task.options);
    return this;
  }

  async executeTask (task) {
    this.executingQueue.push(task);
    const { options, callback } = task;
    const { context, delay, start, completed, failed } = options;
    if (delay) {
      await this.sleep(delay);
    }
    try {
      start && start.call(context, this, options);
      this.emit('startTask', options);
      options.startTime = this.getNowTimestamp();
      const result = await Promise.resolve(callback.call(context, this, options));
      options.endTime = this.getNowTimestamp();
      completed && completed.call(context, this, result);
      this.emit('completed', options, result);
    } catch (err) {
      options.endTime = this.getNowTimestamp();
      failed && failed.call(context, this, err);
      this.emit('failed', options, err);
    } finally {
      this.changeTask(task);
    }
  }

  nextTask () {
    return this.waitingQueue.dequeue();
  }

  changeTask (task) {
    if (task) {
      const index = this.executingQueue.findIndex((item) => item === task);
      this.executingQueue.splice(index, 1);
    }
    if (!this.isPause) {
      const task = this.nextTask();
      if (task) {
        this.emit('changeTask', task.options);
        this.executeTask(task);
      }
    }
  }

  clearTask () {
    this.waitingQueue.clear();
  }

  removeTask (taskId) {
    const { waitingQueue } = this;
    for (let i = 0; i < waitingQueue.length(); i++) {
      const { options } = waitingQueue.getTaskByIndex(i);
      const { remove, context } = options;
      if (options.id && options.id === taskId) {
        remove && remove.call(context, this, options);
        const isRemoved = waitingQueue.removeTaskByIndex(i);
        this.emit('removeTask', options, isRemoved);
        return isRemoved;
      }
    }
    return false;
  }

  pause () {
    this._pause = true;
  }

  get isPause () {
    return this._pause;
  }

  resume () {
    this._pause = false;
    if (this.executingQueue.length < this.executeLimit) {
      this.changeTask();
    }
  }

  sleep (timestamp) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, timestamp);
    });
  }

  setExcutingLimit (executeLimit) {
    this.executeLimit = executeLimit;
  }

  getNowTimestamp () {
    return new Date().getTime();
  }
}

module.exports = AsyncQueue;

}, function(modId) { var map = {"./Event":1654603802732,"./PriorityQueue":1654603802733,"./Task":1654603802734}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1654603802732, function(require, module, exports) {
class Event {
  constructor () {
    this.eventHandlerMap = {};
  }

  on (eventName, eventHandler) {
    if (typeof(eventHandler) !== 'function') {
      throw new Error('eventHandler must be a function!');
    }
    if (!this.eventHandlerMap[eventName]) {
      this.eventHandlerMap[eventName] = [];
    }
    const found = this.eventHandlerMap[eventName].find(handler => handler === eventHandler);
    if (found) {
      return;
    }
    this.eventHandlerMap[eventName].push(eventHandler);
  }

  emit (eventName, ...params) {
    if (this.eventHandlerMap[eventName]) {
      for (const eventHandler of this.eventHandlerMap[eventName]) {
        eventHandler.call(this, ...params);
      }
    }
  }

  off (eventName, eventHandler) {
    if (this.eventHandlerMap[eventName]) {
      const index = this.eventHandlerMap[eventName].findIndex(handler => handler === eventHandler);
      if (index >= 0) {
        this.eventHandlerMap[eventName].splice(index, 1);
      }
    }
  }
}

module.exports = Event;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1654603802733, function(require, module, exports) {
class PriorityQueue {
  constructor () {
    this.taskList = [];
  }

  enqueue (task) {
    const curWeight = task.options.weight || 0;
    let insertIndex = this.length();
    for (let i = insertIndex; i > 0; i--) {
      const tmpWeight = this.getTaskByIndex(i - 1).weight || 0;
      if (curWeight < tmpWeight) {
        insertIndex = i - 1;
        continue;
      }
      break;
    }
    this.addTaskByIndex(insertIndex, task);
  }

  dequeue () {
    return this.taskList.shift();
  }

  addTaskByIndex (index, task) {
    this.taskList.splice(index, 0, task);
  }

  getTaskByIndex (index) {
    return this.taskList[index];
  }

  removeTaskByIndex (index) {
    const removeArr = this.taskList.splice(index, 1);
    return removeArr.length > 0;
  }

  clear () {
    delete this.taskList;
    this.taskList = [];
  }

  length () {
    return this.taskList.length;
  }
}

module.exports = PriorityQueue;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1654603802734, function(require, module, exports) {
class Task {
  constructor (...args) {
    // default setting
    this.options = {
      id: undefined,
      priority: 'normal',
      weight: 0,
      context: null,
      createTime: 0,
      startTime: 0,
      endTime: 0,
      start: () => {},
      completed: () => {},
      failed: () => {},
      remove: () => {}
    };
    this.callback = () => {};
    // initArgs
    this.initArgs(...args);
  }

  initArgs (...args) {
    const len = args.length;
    if (len === 0) {
      return;
    }
    if (len === 1) {
      if (typeof args[0] === 'function') {
        this.callback = args[0];
      } else {
        throw new Error('Invalid Argument For PAQ, Expected A Function!');
      }
    } else {
      if (typeof args[0] === 'object') {
        this.options = Object.assign(this.options, args[0]);
        this.options.weight = this.setWeightByPriority();
        this.validateArgs(this.options);
      } else {
        throw new Error('Invalid First Argument For PAQ, Expected A Object!');
      }
      if (typeof args[1] === 'function') {
        this.callback = args[1];
      } else {
        throw new Error('Invalid Second Argument For PAQ, Expected A Function!');
      }
    }
  }

  setWeightByPriority () {
    switch (this.options.priority) {
    case 'low':
      return 1;
    case 'normal':
      return 0;
    case 'mid':
      return -1;
    case 'high':
      return -2;
    case 'urgent':
      return -3;
    default:
      throw new Error('Please Choose A Correct Priority!');
    }
  }

  validateArgs (options) {
    if (typeof options.start !== 'function') {
      throw new Error('Start callback must be a valid function!');
    }
    if (typeof options.completed !== 'function') {
      throw new Error('Completed callback must be a valid function!');
    }
    if (typeof options.failed !== 'function') {
      throw new Error('Failed callback must be a valid function!');
    }
    if (typeof options.remove !== 'function') {
      throw new Error('Remove callback must be a valid function!');
    }
  }
}

module.exports = Task;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1654603802730);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map