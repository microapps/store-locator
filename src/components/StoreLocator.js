import {Component} from 'preact';
import {loadScript} from 'lib/utils';
import classNames from './StoreLocator.css';

class StoreLocator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMapLoaded: Boolean(window.google && window.google.maps)
    };
  }

  loadGoogleMaps() {
    if (this.state.isMapLoaded) return;
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${this.props.apiKey}&libraries=geometry`
    ).then(() => {
      this.setState({isMapLoaded: true});
    });
  }

  componentDidMount() {
    this.loadGoogleMaps();
  }

  render() {
    return (
      <div className={classNames.container}>
        <div className={classNames.map} ref={map => (this.map = map)} />
      </div>
    );
  }
}

export default StoreLocator;
