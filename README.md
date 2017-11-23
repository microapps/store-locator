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


```
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
          },
          {
            name: "PAEZ POP UP STORE CC.L'illa",
            address: 'Avinguda Diagonal, 557, 08029 Barcelona, Spain',
            location: {lat: 41.3897854, lng: 2.1355045000000246}
          },
          {
            name: 'PAEZ ZARAGOZA',
            address: 'Calle San Félix, 2, 50003 Zaragoza, Spain',
            location: {lat: 41.65346359999999, lng: -0.8788438999999926}
          },
          {
            name: 'PAEZ PALMA',
            address: 'Carrer de la Bosseria, 12, 07001 Palma, Illes Balears, Spain',
            location: {lat: 39.5706846, lng: 2.651996899999972}
          },
          {
            name: 'PAEZ TENERIFE',
            address: 'Calle Ramón y Cajal, 37, 38004 Santa Cruz de Tenerife, Spain',
            location: {lat: 28.4660137, lng: -16.258979700000054}
          },
          {
            name: 'PAEZ CHIADO',
            address: 'R. do Alecrim 62, 1200-243 Lisboa, Portugal',
            location: {lat: 38.7094783, lng: -9.143068699999958}
          },
          {
            name: 'PAEZ PORTO',
            address: 'R. das Carmelitas 151, 4050-162 Porto, Portugal',
            location: {lat: 41.1462871, lng: -8.61489800000004}
          }
        ]
      })
    </script>
```
