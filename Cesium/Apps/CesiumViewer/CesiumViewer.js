const viewer = new Cesium.Viewer("cesiumContainer", {
  shouldAnimate: true,
});

const queryToObject = Cesium.queryToObject;
const defined = Cesium.defined;
const CzmlDataSource = Cesium.CzmlDataSource;
const endUserOptions = queryToObject(window.location.search.substring(1));
const source = endUserOptions.source;


 if (defined(source)) {
    let sourceType = endUserOptions.sourceType;
    if (!defined(sourceType)) {
      // autodetect using file extension if not specified
      if (/\.czml$/i.test(source)) {
        sourceType = "czml";
      } else if (
        /\.geojson$/i.test(source) ||
        /\.json$/i.test(source) ||
        /\.topojson$/i.test(source)
      ) {
        sourceType = "geojson";
      } else if (/\.kml$/i.test(source) || /\.kmz$/i.test(source)) {
        sourceType = "kml";
      } else if (/\.gpx$/i.test(source) || /\.gpx$/i.test(source)) {
        sourceType = "gpx";
      }
    }

    let loadPromise;
    if (sourceType === "czml") {
      loadPromise = CzmlDataSource.load(source);
    } else if (sourceType === "geojson") {
      loadPromise = GeoJsonDataSource.load(source);
    } else if (sourceType === "kml") {
      loadPromise = KmlDataSource.load(source, {
        camera: scene.camera,
        canvas: scene.canvas,
        screenOverlayContainer: viewer.container,
      });
    } else if (sourceType === "gpx") {
      loadPromise = GpxDataSource.load(source);
    } else {
      showLoadError(source, "Unknown format.");
    }

   if (defined(loadPromise)) {
      viewer.dataSources
        .add(loadPromise)
        .then(function (dataSource) {
          const lookAt = endUserOptions.lookAt;
          if (defined(lookAt)) {
            const entity = dataSource.entities.getById(lookAt);
            if (defined(entity)) {
              viewer.trackedEntity = entity;
            } else {
              const error = `No entity with id "${lookAt}" exists in the provided data source.`;
              showLoadError(source, error);
            }
          } else if (!defined(view) && endUserOptions.flyTo !== "false") {
            viewer.flyTo(dataSource);
          }
        })
        .catch(function (error) {
          showLoadError(source, error);
        });
    }
 }




//  viewer.dataSources.add(
//    Cesium.CzmlDataSource.load("https://th0ma5w.github.io/Cesium/Apps/CesiumViewer/Gallery/solo_cross_country.czml")
//  );

