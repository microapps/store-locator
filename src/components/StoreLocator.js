import {Component} from 'preact';
import {loadScript} from 'lib/utils';
import classNames from './StoreLocator.css';
import markerIcon from './pin.svg';
import searchIcon from './search.svg';

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

  setupMap = () => {
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
    this.setUpAutocomplete();
  };

  setUpAutocomplete = () => {
    this.autocomplete = new google.maps.places.Autocomplete(this.input);
    this.autocomplete.bindTo('bounds', this.map);
  };

  componentDidMount() {
    this.loadGoogleMaps().then(this.setupMap);
  }

  render({stores, searchHint}) {
    return (
      <div className={classNames.container}>
        <div className={classNames.searchBox}>
          <div className={classNames.searchInput}>
            <input type="text" ref={input => (this.input = input)} />
            <img className={classNames.searchIcon} src={searchIcon} />
          </div>
          {searchHint && <div className={classNames.searchHint}>{searchHint}</div>}
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
