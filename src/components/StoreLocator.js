import {Component} from 'preact';
import {loadScript} from 'lib/utils';
import classNames from './StoreLocator.css';

class StoreLocator extends Component {
  static defaultProps = {
    stores: [],
    zoom: 6,
    center: {lat: 39.6433995, lng: -6.4396778}
  };

  loadGoogleMaps() {
    if (window.google && window.google.maps) return Promise.resolve();
    return loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${this.props.apiKey}&libraries=geometry`
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
    const infowindow = new google.maps.InfoWindow({
      content: `<div class="${classNames.infoWindow}">
          <h4>${store.title}</h4>
          ${store.details}
        </div>`
    });
    const marker = new google.maps.Marker({
      position: store.position,
      map: this.map,
      title: store.title
    });
    marker.addListener('click', function() {
      infowindow.open(this.map, marker);
    });
  };

  constructMap = () => {
    const {center, zoom} = this.props;
    this.map = new window.google.maps.Map(this.mapFrame, {
      center,
      zoom
    });
    this.centerOnUserLocation();
    this.props.stores.forEach(this.addStoreMarker);
  };

  componentDidMount() {
    this.loadGoogleMaps().then(this.constructMap);
  }

  render() {
    return (
      <div className={classNames.container}>
        <div className={classNames.map} ref={mapFrame => (this.mapFrame = mapFrame)} />
      </div>
    );
  }
}

export default StoreLocator;
