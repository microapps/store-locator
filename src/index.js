import {render} from 'preact';
import StoreLocator from 'components/StoreLocator';

module.exports = function({container, stores, apiKey, zoom, defaultCenter, markerIcon}) {
  render(
    <StoreLocator
      stores={stores}
      apiKey={apiKey}
      zoom={zoom}
      defaultCenter={defaultCenter}
      markerIcon={markerIcon}
    />,
    document.getElementById(container)
  );
};
