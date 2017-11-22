import {render} from 'preact';
import StoreLocator from 'components/StoreLocator';

module.exports = function({container = 'store-locator', stores, ...config}) {
  const storesWithIds = stores.map((store, i) => {
    store.id = i;
    return store;
  });
  render(<StoreLocator {...config} stores={storesWithIds} />, document.getElementById(container));
};
