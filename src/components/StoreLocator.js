import {Component} from 'preact';
import {loadScript} from 'lib/utils';
import classNames from './StoreLocator.css';
import markerIcon from './pin.svg';

class StoreLocator extends Component {
  static defaultProps = {
    stores: [],
    zoom: 6,
    center: {lat: 39.6433995, lng: -6.4396778},
    markerIcon: markerIcon
  };

  loadGoogleMaps() {
    if (window.google && window.google.maps) return Promise.resolve();
    return loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${this.props.apiKey}&libraries=geometry,places`
    );
  }

  centerOnUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        p => {
          this.map.setCenter(new google.maps.LatLng(p.coords.latitude, p.coords.longitude));
        },
        () => {
          throw new Error('user denied request for position');
        }
      );
    } else {
      throw new Error('no geolocation support');
    }
  }

  addStoreMarker = store => {
    const infoWindow = new google.maps.InfoWindow({
      content: `<div class="${classNames.infoWindow}">
          <h4>${store.name}</h4>
          ${store.address}
        </div>`
    });
    const marker = new google.maps.Marker({
      position: store.position,
      title: store.name,
      map: this.map,
      icon: this.props.markerIcon
    });
    marker.addListener('click', () => {
      if (this.infoWindow) {
        this.infoWindow.close();
      }
      infoWindow.open(this.map, marker);
      this.infoWindow = infoWindow;
    });
  };

  constructMap = () => {
    const {center, zoom} = this.props;
    this.map = new window.google.maps.Map(this.mapFrame, {
      center,
      zoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });
    this.centerOnUserLocation();
    this.props.stores.forEach(this.addStoreMarker);
  };

  componentDidMount() {
    this.loadGoogleMaps().then(this.constructMap);
  }

  render({stores}) {
    return (
      <div className={classNames.container}>
        <div className={classNames.searchBox}>
          <ul className={classNames.shopsList}>
            {stores.map((store, i) => (
              <li key={i}>
                <h4>{store.name}</h4>
                <address>{store.address}</address>
              </li>
            ))}
          </ul>
        </div>
        <div className={classNames.map} ref={mapFrame => (this.mapFrame = mapFrame)} />
      </div>
    );
  }
}

export default StoreLocator;
