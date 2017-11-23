# Store Locator

A drop-in module for a website that shows a google map with list of stores in the sidebar. 

![Screenshot](/screenshot.png?raw=true)

## Features
- draws all stores on a map
- shows a list of stores in the side bar providing map navigation
- determains user location and sorts the stores, showing nearest first
- shows a distance to each store form a given location
- allows to search for nearest store to a givenn location
- provides a direction link to each store

## Usage

- Include [store-locator.js](/dist/store-locator.js?raw=true) and [store-locator.css](/dist/store-locator.css?raw=true) on your page
- Add a container where you want the map to be rendered
- Initialize the script


```html
<div id="my-store-locator">
      <!-- map will be rendered here-->
</div>
<script src="store-locator.js"></script>
<script>
      storeLocator({
        container: 'store-locator',
        apiKey: 'GOOGLE_MAPS_API_KEY',
        searchHint: "Not all stores sell our whole range so if you're looking for a specific product we recommend you call ahead.",
        stores: [
          {
            name: 'PAEZ FLAGSHIP STORE EL BORN',
            address: 'Carrer de les Caputxes, 2, 08003 Barcelona, Spain',
            location: {lat: 41.3833695, lng: 2.1814855999999736},
            website: 'http://microapps.com'
          },
          {
            name: 'PAEZ STORE CC. Maremagnum',
            address: "Moll d'Espanya, 5, 08039 Barcelona, Spain",
            location: {lat: 41.3752, lng: 2.18286999999998}
          }
        ]
      })
    </script>
```

## Configuration options

- `container` - id of the element where the map will be rendered
- `stores` - an array of stores to render on a map,
- `zoom` - initial map zoom `default: 6`,
- `center` - initial map center `default: {lat: 39.6433995, lng: -6.4396778}`
- `markerIcon` - custom marker icon
- `searchHint` - text rendered after a search input

