# deep-proxy
Deep recursive proxy object

## Install:
```$ npm install @danisl99/deep-proxy```

## Example:
```javascript
const DeepProxy = require("@danisl99/deep-proxy");

const handler = {
  set: async function (obj, prop, value) {
    console.log(`Setting ${prop} to ${value}`);
    obj[prop] = value;
  },
  deleteProperty: function (obj, prop) {
    console.log(`Deleted ${prop}`);
    delete obj[prop];
  },
};
const proxyObject = new DeepProxy(data, handler);
```
