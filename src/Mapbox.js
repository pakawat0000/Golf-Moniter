import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import Greencar from "./image/greencar.png";
import Bluecar from "./image/bluecar.png";
import Orangecar from "./image/orangecar.png";
import Pinkcar from "./image/pinkcar.png";
import Purplecar from "./image/purplecar.png";
mapboxgl.accessToken =
  "pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pwY3owbGFxMDVwNTNxcXdwMms2OWtzbiJ9.1PPVl0VLUQgqrosrI2nUhg";
var initialpose = false;
import API from "./API";
var counter;
var coordinates = [];
var geoLocateControl
export default function Mapbox({ Data, OR, Info }) {
  // console.log(Data);
  const geolocate = useRef(true);
  const map = useRef(null);
  const mapContainer = useRef(null);
  const steps = 40;
  const api = new API();
  const TimeoutID = useRef(null);
  // const [positions,setpositions] = useState()
  var positions = [];
  const routecar = useRef({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [[], []],
        },
      },
    ],
  });
  const point = useRef({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [0, 0],
        },
      },
    ],
  });
  //,[100.542559,13.808058],[100.541663,13.807313],[100.539373,13.801384],[100.540955,13.800473],[100.541878,13.800103]

  useEffect(() => {
    if (map.current && positions) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [100.541838, 13.799767], //[lng,lat]
      paint: ["rgb", 42, 43, 47],
      zoom: 14.5,
      pitch: 0,
    });
    geoLocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
      watchPosition: true,
      showUserLocation: true,
      showAccuracyCircle: false,
    });
    map.current.addControl(geoLocateControl, "bottom-right");
    map.current.on("load", function () {
      if (geolocate.current && Data.node !== OR) {
        geolocate.current=false;
        setTimeout(() => {
          geoLocateControl.trigger(); //<- Automatically activates geolocation
        }, 1000);
      }
    });
    const routeData = {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      },
    };
    const route_agv_data = {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      },
    };
    const circle_point = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [],
            },
          },
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [],
            },
          },
        ],
      },
    };
    map.current.on("load", () => {
      map.current.addSource("route", routeData);
      map.current.addSource("route-agv", route_agv_data);
      map.current.addSource("circle-point", circle_point);
      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
          visibility: "none",
        },
        paint: {
          "line-color": "#B5B5B5",
          "line-width": 8,
        },
      });
      map.current.addLayer({
        id: "route-agv",
        type: "line",
        source: "route-agv",
        layout: {
          "line-join": "round",
          "line-cap": "round",
          visibility: "none",
        },
        paint: {
          "line-color": "#44B1F3",
          "line-width": 8,
        },
      });
      map.current.addLayer({
        id: "circle-point",
        type: "circle",
        source: "circle-point",
        layout: {
          visibility: "none",
        },
        paint: {
          "circle-radius": 8,
          "circle-color": "#FFFFFF",
          "circle-stroke-color": "#ccc",
          "circle-stroke-width": 2,
        },
        filter: ["==", "$type", "Point"],
      });

      map.current.addSource("point", {
        type: "geojson",
        data: point.current,
      });
      map.current.loadImage(Orangecar, (error, image) => {
        if (error) throw error;

        // Add the image to the map style.
        map.current.addImage("orangecar", image);
        map.current.addLayer({
          id: "AGV1",
          type: "symbol",
          source: "point", // reference the data source
          layout: {
            "icon-image": "orangecar", // reference the image
            "icon-size": 0.4,
            "icon-rotate": ["get", "bearing"],
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            visibility: "none",
          },
        });
      });
      map.current.loadImage(Greencar, (error, image) => {
        if (error) throw error;

        // Add the image to the map style.
        map.current.addImage("greencar", image);
        map.current.addLayer({
          id: "AGV2",
          type: "symbol",
          source: "point", // reference the data source
          layout: {
            "icon-image": "greencar", // reference the image
            "icon-size": 0.4,
            "icon-rotate": ["get", "bearing"],
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            visibility: "none",
          },
        });
      });
      map.current.loadImage(Purplecar, (error, image) => {
        if (error) throw error;

        // Add the image to the map style.
        map.current.addImage("purplecar", image);
        map.current.addLayer({
          id: "AGV3",
          type: "symbol",
          source: "point", // reference the data source
          layout: {
            "icon-image": "purplecar", // reference the image
            "icon-size": 0.4,
            "icon-rotate": ["get", "bearing"],
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            visibility: "none",
          },
        });
      });
      map.current.loadImage(Pinkcar, (error, image) => {
        if (error) throw error;

        // Add the image to the map style.
        map.current.addImage("pinkcar", image);
        map.current.addLayer({
          id: "AGV4",
          type: "symbol",
          source: "point", // reference the data source
          layout: {
            "icon-image": "pinkcar", // reference the image
            "icon-size": 0.4,
            "icon-rotate": ["get", "bearing"],
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            visibility: "none",
          },
        });
      });
      map.current.loadImage(Bluecar, (error, image) => {
        if (error) throw error;

        // Add the image to the map style.
        map.current.addImage("bluecar", image);
        map.current.addLayer({
          id: "AGV5",
          type: "symbol",
          source: "point", // reference the data source
          layout: {
            "icon-image": "bluecar", // reference the image
            "icon-size": 0.4,
            "icon-rotate": ["get", "bearing"],
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            visibility: "none",
          },
        });
      });
    });
  },[Data.node]);
  async function Caranimate() {
    // console.log(Data.state,OR);
    if (Data.name && !coordinates.length) {
      console.log(Data.name);
      const Route = await api.get(`/route/${Data.name}`, "");
      if (Array.isArray(Route.data) && Route.data.length) {
        coordinates = [];
        for (let i = 1; i < Route.data.length; i++) {
          const lnglat0 = [Route.data[i - 1].lng, Route.data[i - 1].lat];
          const lnglat1 = [Route.data[i].lng, Route.data[i].lat];
          const pointdata0 = turf.point(lnglat0);
          const pointdata1 = turf.point(lnglat1);
          const lineDistance = turf.distance(pointdata0, pointdata1, {
            units: "kilometers",
          });
          console.log(lineDistance);
          if (lineDistance > 0.01) {
            for (let i = 0; i < lineDistance; i += 0.01) {
              const segment = turf.along(
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "LineString",
                    coordinates: [lnglat0, lnglat1],
                  },
                },
                i
              );
              coordinates.push(segment.geometry.coordinates);
            }
          }
          coordinates.push(lnglat1);
        }

        const route = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        };
        const circlePoint = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: coordinates[0],
              },
            },
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: coordinates[coordinates.length - 1],
              },
            },
          ],
        };
        map.current.getSource("route").setData(route);
        map.current.getSource("route-agv").setData(route);
        map.current.getSource("circle-point").setData(circlePoint);

        
      }
    }
    // console.log(routecar.current["features"][0]["geometry"]["coordinates"][0]);
    const location1 = Data.location;
    console.log(routecar.current["features"][0]["geometry"]["coordinates"][0]);
    // console.log(location1);
    if (!routecar.current["features"][0]["geometry"]["coordinates"][0].length) {
      point.current.features[0].geometry.coordinates = location1;
      routecar.current["features"][0]["geometry"]["coordinates"] = [
        location1,
        location1,
      ];

      map.current.setLayoutProperty(Data.name, "visibility", "visible");
      map.current.getSource("point").setData(point.current);

      return;
    }
    initialpose = true;
    const origin =
      routecar.current["features"][0]["geometry"]["coordinates"].pop();
    routecar.current["features"][0]["geometry"]["coordinates"] = [[], []];
    routecar.current["features"][0]["geometry"]["coordinates"][0] = origin;
    routecar.current["features"][0]["geometry"]["coordinates"][1] = location1;
    const lineDistance = turf.length(routecar.current.features[0]);
    const arc = [];
    // Draw an arc between the `origin` & `destination` of the two points
    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
      const segment = turf.along(routecar.current.features[0], i);
      arc.push(segment.geometry.coordinates);
    }
    routecar.current.features[0].geometry.coordinates = arc;
    if (initialpose) {
      // console.log(arc);
      counter = 0;
      clearTimeout(TimeoutID);
      animate();
    }
    console.log(geolocate.current)
    if (Data.state === 4 && Data.node === OR && map.current) {
      if (!geolocate.current && Data.node === OR) {
        geoLocateControl.trigger(1);
        geolocate.current=true;
      }
      const bounds = new mapboxgl.LngLatBounds();

        for (const coord of coordinates) {
          // console.log(coord);
          bounds.extend({ lon: coord[0], lat: coord[1] });
        }
        map.current.fitBounds(bounds, {
          padding: 60,
          speed: 0.8,
        });
      map.current.setLayoutProperty("route", "visibility", "visible");
      map.current.setLayoutProperty("route-agv", "visibility", "visible");
      map.current.setLayoutProperty("circle-point", "visibility", "visible");
    }
  }

  function animate() {
    const start = routecar.current.features[0].geometry.coordinates[counter];
    const end = routecar.current.features[0].geometry.coordinates[counter + 1];
    if (start && end) {
      let minDistance = 10.0;
      let memoIndex = 0;
      const newRoute = [end];
      for (let i = 0; i < coordinates.length; i++) {
        const pointroute = coordinates[i];
        const _distance = turf.distance(
          turf.point(end),
          turf.point(pointroute)
        );
        if (_distance < minDistance) {
          minDistance = _distance;
          memoIndex = i;
        }
      }
      for (let i = memoIndex; i < coordinates.length; i++) {
        newRoute.push(coordinates[i]);
      }
      const updateRoute = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: newRoute,
        },
      };
      map.current.getSource("route-agv").setData(updateRoute);
      point.current.features[0].geometry.coordinates = end;
      point.current.features[0].properties.bearing = turf.bearing(
        turf.point(start),
        turf.point(end)
      );
      map.current.getSource("point").setData(point.current);
    }

    // Request the next frame of animation as long as the end has not been reached
    if (counter < steps) {
      TimeoutID.current = setTimeout(animate, 71);
      // console.log(counter)
    }

    counter = counter + 1;
  }
  // function User (){
  //   if(positions){

  //     map.current.flyTo({
  //       center: positions,
  //       speed: 1
  //     })
  //     const user = {
  //       type: "Point",
  //       coordinates: positions
  //     }
  //     map.current.getSource("user-location").setData(user);
  //     map.current.setLayoutProperty("user-location", 'visibility', 'visible');

  //   }
  // }c

  useEffect(() => {
    if (map.current !== null) {
      // setInterval(() => {
      //   navigator.geolocation.getCurrentPosition((position) => {
      //     positions =[ position.coords.longitude,position.coords.latitude];
      //     console.log(positions)
      //     User()
      //   }
      //   )
      // }, 3000);
      // console.log(positions,1)

      if (map.current.getLayer(Data.name)) {
        Caranimate();
        // console.log(111, Data.name);
      }
    }
  }, [Data]);

  return (
    <>
      <div ref={mapContainer} style={{ height: "100%", width: "100%" }}></div>
    </>
  );
}
