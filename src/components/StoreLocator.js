import promiseMap from 'p-map';
import cx from 'classnames';
import {getUserLocation, loadScript} from 'lib/utils';
import {Component} from 'preact';
import DirectionIcon from './DirectionIcon';
import SearchIcon from './SearchIcon';
import classNames from './StoreLocator.css';
import WebIcon from './WebIcon';

const travelModes = {
  DRIVING: 'car',
  WALKING: 'walk'
};

const units = {
  METRIC: 0,
  IMPERIAL: 1
};

const toMiles = 1.609;

class StoreLocator extends Component {
  static defaultProps = {
    stores: [],
    zoom: 6,
    limit: 10,
    center: {lat: 39.6433995, lng: -6.4396778},
    travelMode: 'DRIVING',
    homeLocationHint: 'Current location',
    homeMarkerIcon: 'http://maps.google.com/mapfiles/kml/pushpin/grn-pushpin.png',
    storeMarkerIcon: 'http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png',
    unitSystem: 'METRIC',
    farAwayMarkerOpacity: 0.6,
    fullWidthMap: false
  };

  constructor(props) {
    super(props);
    this.state = {
      searchLocation: null,
      activeStoreId: null,
      stores: props.stores
    };
    this.markers = [];
  }

  loadGoogleMaps() {
    if (window.google && window.google.maps) return Promise.resolve();
    return loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${this.props.apiKey}&libraries=geometry,places`
    );
  }

  getMarkerIcon(icon) {
    if (!icon) return null;
    const {markerIconSize} = this.props;
    if (typeof icon === 'string' && markerIconSize) {
      const iconSize = markerIconSize;
      return {
        url: icon,
        scaledSize: new google.maps.Size(iconSize[0], iconSize[1])
      };
    }
    return icon;
  }

  addStoreMarker = store => {
    const infoWindow = new google.maps.InfoWindow({
      content: `<div class="${classNames.infoWindow}">
          <h4>${store.name}</h4>
          ${store.address}
        </div>`
    });

    const marker = new google.maps.Marker({
      position: store.location,
      title: store.name,
      map: this.map,
      icon: this.getMarkerIcon(this.props.storeMarkerIcon)
    });
    marker.addListener('click', () => {
      if (this.infoWindow) {
        this.infoWindow.close();
      }
      infoWindow.open(this.map, marker);
      this.infoWindow = infoWindow;
      this.setState({activeStoreId: store.id});
    });
    this.markers.push(marker);
    return marker;
  };

  getDistance(p1, p2) {
    const origin = new google.maps.LatLng(p1);
    const destination = new google.maps.LatLng(p2);
    const directDistance = this.getDirectDistance(origin, destination);
    return new Promise(resolve => {
      this.distanceService.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: this.props.travelMode,
          unitSystem: units[this.props.unitSystem],
          durationInTraffic: true,
          avoidHighways: false,
          avoidTolls: false
        },
        (response, status) => {
          if (status !== 'OK') return resolve(directDistance);
          const route = response.rows[0].elements[0];
          if (route.status !== 'OK') return resolve(directDistance);
          resolve({
            distance: route.distance.value,
            distanceText: route.distance.text,
            durationText: route.duration.text
          });
        }
      );
    });
  }

  getDirectDistance(origin, destination) {
    const distance =
      google.maps.geometry.spherical.computeDistanceBetween(origin, destination) / 1000;
    if (units[this.props.unitSystem] === 1) {
      return {
        distance: distance / toMiles,
        distanceText: `${(distance / toMiles).toFixed(2)} mi`
      };
    }
    return {
      distance,
      distanceText: `${distance.toFixed(2)} km`
    };
  }

  setHomeMarker(location) {
    if (this.homeMarker) {
      this.homeMarker.setMap(null);
    }
    const infoWindow = new google.maps.InfoWindow({
      content: this.props.homeLocationHint
    });
    this.homeMarker = new google.maps.Marker({
      position: location,
      title: this.props.homeLocationHint,
      map: this.map,
      icon: this.getMarkerIcon(this.props.homeMarkerIcon)
    });
    this.homeMarker.addListener('click', () => {
      if (this.infoWindow) {
        this.infoWindow.close();
      }
      infoWindow.open(this.map, this.homeMarker);
      this.infoWindow = infoWindow;
    });
  }

  setupMap = () => {
    const {center, zoom} = this.props;
    this.map = new window.google.maps.Map(this.mapFrame, {
      center,
      zoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });
    this.distanceService = new google.maps.DistanceMatrixService();
    const geocoder = new google.maps.Geocoder();
    this.setupAutocomplete();
    this.state.stores.map(this.addStoreMarker);
    getUserLocation().then(location => {
      this.setState({searchLocation: location});
      this.calculateDistance(location);
      this.map.setCenter(location);
      this.map.setZoom(11);
      this.setHomeMarker(location);
      geocoder.geocode({location: location}, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.input.value = results[0].formatted_address;
          }
        }
      });
    });
  };

  setupAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.input);
    autocomplete.bindTo('bounds', this.map);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(11);
      }
      const location = place.geometry.location.toJSON();
      this.setState({searchLocation: location});
      this.setHomeMarker(location);
      this.calculateDistance(location);
    });
  }

  clearMarkers() {
    this.markers.forEach(m => {
      m.setMap(null);
    });
    this.markers = [];
  }

  calculateDistance(searchLocation) {
    const {stores, limit} = this.props;
    if (!searchLocation) return stores;
    promiseMap(stores, store => {
      return this.getDistance(searchLocation, store.location).then(result => {
        Object.assign(store, result);
        return store;
      });
    }).then(data => {
      let result = data.sort((a, b) => a.distance - b.distance);
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(searchLocation);
      this.clearMarkers();
      result = result.map((store, i) => {
        store.hidden = i + 1 > limit;
        const marker = this.addStoreMarker(store);
        if (store.hidden) {
          marker.setOpacity(this.props.farAwayMarkerOpacity);
        } else {
          bounds.extend(store.location);
        }
        return store;
      });
      this.map.fitBounds(bounds);
      this.map.setCenter(bounds.getCenter(), this.map.getZoom() - 1);
      this.setState({stores: result});
    });
  }

  componentDidMount() {
    this.loadGoogleMaps().then(this.setupMap);
  }

  onStoreClick({location, id}) {
    this.map.setCenter(location);
    this.map.setZoom(16);
    this.setState({activeStoreId: id});
  }

  //noinspection JSCheckFunctionSignatures
  render({searchHint, travelMode, fullWidthMap}, {activeStoreId, stores}) {
    return (
      <div className={cx(classNames.container, {[classNames.fullWidthMap]: fullWidthMap})}>
        <div className={classNames.searchBox}>
          <div className={classNames.searchInput}>
            <input type="text" ref={input => (this.input = input)} />
            <SearchIcon className={classNames.searchIcon} />
          </div>
          {searchHint && <div className={classNames.searchHint}>{searchHint}</div>}
          <ul className={classNames.storesList}>
            {stores.map(store => {
              const locationStr = `${store.location.lat},${store.location.lng}`;
              return (
                <li
                  key={store.id}
                  onClick={() => this.onStoreClick(store)}
                  className={cx({
                    [classNames.activeStore]: store.id === activeStoreId,
                    [classNames.hiddenStore]: store.hidden
                  })}>
                  <h4>{store.name}</h4>
                  {store.distanceText && (
                    <div className={classNames.storeDistance}>
                      {store.distanceText} away{' '}
                      {store.durationText &&
                        `(${store.durationText} by ${travelModes[travelMode]})`}
                    </div>
                  )}
                  <address>{store.address}</address>
                  <div className={classNames.storeActions} onClick={e => e.stopPropagation()}>
                    <a target="_blank" href={`https://www.google.com/maps?daddr=@${locationStr}`}>
                      <DirectionIcon />
                      directions
                    </a>{' '}
                    {store.website && (
                      <a target="_blank" href={store.website}>
                        <WebIcon />
                        website
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={classNames.map} ref={mapFrame => (this.mapFrame = mapFrame)} />
      </div>
    );
  }
}

export default StoreLocator;
