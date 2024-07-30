# Leakmited hiring process for the Full-Stack position
https://download.geofabrik.de/europe/france/ile-de-france.html
## Test & Goal
The goal here is to assess your technical ability to integrate in the best conditions with our
team as this is what we do at Leakmited: **displaying data on a Map and interacting with it**. In
this test you will write an App in **Sveltekit** where you will **display a Dashboard** with **stats** and
**data** on a map.

## Due time :
You’ll have up to 2 week to do the test

### Contact :
If you have any questions, do not hesitate to contact
sebastien.mounier@leakmited.com

### Delivery :
 Upload the code in any hosted version control service of your choice and give us
access to it

### Input: ile de france road network
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

## Installation & requirement
- `.env` file with `VITE_MAPBOX_TOKEN=<your-token>`
-  installation: `pnpm install`
-  launch: `pnpm dev`

## Development questions
- [x] mapgl and svelte
- [ ] mapgl and roads to load file formats open street map? 


## Code development
- [x] Dashboard like layout
- [x] Map
- [x] Widget


## Requirements
- [x] roads to display ( mapboxgl > loaded file as tileset > using tileset )
- Filter based one maximal speeds