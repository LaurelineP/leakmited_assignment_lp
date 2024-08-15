# Leakmited hiring process for the Full-Stack position

## [WebApp Live](https://leakmited-lp.netlify.app/)  
<img width="1492" alt="image" src="https://github.com/user-attachments/assets/c0196f22-d417-477b-ac5f-4e450de11be5">

[![Netlify Status](https://api.netlify.com/api/v1/badges/1ea58664-7496-41c1-bb1a-c83fa108ca7a/deploy-status)](https://app.netlify.com/sites/leakmited-lp/deploys)

## 📌 Test & Goal
Resource to consider - IDF : https://download.geofabrik.de/europe/france/ile-de-france.html

The goal here is to assess your technical ability to integrate in the best conditions with our
team as this is what we do at Leakmited: **displaying data on a Map and interacting with it**. In
this test you will write an App in **Sveltekit** where you will **display a Dashboard** with **stats** and
**data** on a map.

### 📂 Input: ile de france road network
TODOs (by order of priority)

- **Display on a Map** the roads of **Ile-de-France**
- Allow the user to **filter** on the fly the roads **based on the maximum speed** -
- **Make road selectable** and display a **tooltip with the road maximum speed** -
- Display a **Dashboard with a graph** and **statistics about the road network**
- For examples:
  - the **distribution of the max_speed on number of kilometers**
  - the **length of road network**
- (Bonus) deploy the solution on AWS or Vercel/Netlify

There is no good or bad answer to this test. Just have fun doing it as we hope
you will have once you join our team to fix the water loss Challenge !

<hr>


## 🚀 Installation & requirement
- `.env` and `.env.production` files should be created
- installation: `pnpm install`
- launch: `pnpm dev`

## ⚙️ Stack
- pnpm 
- JS
- TailwindCSS
- Svelte
- SvelteKit
- Mapbox Gl
- Flowbite
- Netlify


## 💻 TL;DR - Details - Development & problematics
- Web first development - no mobile
- Perf could be improved
- Test could have been added
- Finding Flowbite TS
--> Main concerns through development: implementing features

- [x] [ Dashboard ]
  - contains:
    - a side panel to display map related info in widgets
    - the map loaded with the road
- [x] [ implemented ] Map
      The map will display the map at a given area ( IDF ) with the roads from the given files.
      Interacting with the road will provide data infos on the map, or on a selected road.

- [x] [ Display a map with the roads layer ] Display a map with the roads layer
      Mapboxgl is a powerful tool relying on WebGL to create cartography - ( previously used )
  - [ not implemented ] attempt on using leaflet to get geojson
  - [x] [ Loading roads files ]
    How the files for the roads to loads will be/are served:
    - [ not implemented ] from server: a manual geojson was created manually in order to
      		serve the geojson over the server / went for another solution.
    - [x] [ implemented ] mapboxgl studio and tiles ( tiers library / no needs for server )
      		Also found a sizing issue > which I reduced then had some fields that mapbox couldn't handle
      - had to manually create a zip per folder ( here roads folders shp files )
      - had to zip it manually
      - zip being too big - in order to apply a layer from such files we need
      		to create tiles from loaded files
      		- issue on the manual zip folder
      		- solved by providing the same zip to [mapshaper](https://www.mapshaper.com)
      			and export it as shape zipped folder
      		- loaded again the folder on mapBox gl studio which could generate a layer of tiles
      		[ nice to have in anticipation for features ] --> make an in-app import to ingest the data
 - [x] [ Filter roads ]
      Filter the roads based on their maxspeed values
         A range and an input allows to controls the roads displayed if the max speed is
         superior or equal to the inputs values
         [ feature concept ] data flow, reactive and bounding values with svelte -> updating info to display

- [x] [ Selectable roads ]
        Observed issue: the road needed a unique identifier for the road to display - used `osm_id`.
        Since we use `osm_id` this does segment one road
        --> issue on click a whole road: not able to click on an entire road but a osm entity
        --> issue on getting the right number of roads ( unless we dive into the documentation and add more
        algo to resolve a whole road selection ) / but it is the numbers of osm segment
        [ would have like to do ] --> more dive ins
        [ feature concept ] - working with map

- [x] [ Metrics and graph ]
      Those are displayed as widgets [ map, selection ].
      Library choice for the graph: [flowbite](https://www.flowbite.com)
- [x] [ Roads metrics ] - percentage and total of displayed roads graph  
  As mentioned previously
  - the road are osm entities and the current graph computations is affected  
    this concepts and the current constrains of mapbox tiles and roads displayed   
  - with mapbox I could not load all the roads that the layer   
    contained as it is progressively displayed on a specific zoomed zone.  
  - tradeoffs for the feature:  
    - ended by getting the total of the current tiles area zoomed in  
    - calculated percents for this area  
    [ feature concept ] handling dynamic data, data binding / data visualization  
    [ would have like to do ] more feature on the pie interactivity
      - on hover / on part of the donut selected --> the map should displays the corresponding one
     

