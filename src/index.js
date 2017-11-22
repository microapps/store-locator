import {render} from 'preact';
import StoreLocator from 'components/StoreLocator';

module.exports = function({container = 'store-locator', stores = [], apiKey}) {
  render(<StoreLocator stores={stores} apiKey={apiKey} />, document.getElementById(container));
};
