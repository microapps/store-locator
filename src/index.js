const {render} = require('preact');
const {StoreLocator} = require('components/StoreLocator');

module.exports = function({container = 'store-locator', stores, ...config}) {
  render(<StoreLocator {...config} />, document.getElementById(container));
};
