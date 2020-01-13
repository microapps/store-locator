const {render} = require('preact');
const {StoreLocator} = require('components/StoreLocator');

module.exports = function({container = 'store-locator', ...config}) {
  render(<StoreLocator {...config} />, document.getElementById(container));
};
