import {render} from 'preact';
import StoreLocator from 'components/StoreLocator';

module.exports = function({container = 'store-locator', ...config}) {
  render(<StoreLocator {...config} />, document.getElementById(container));
};
