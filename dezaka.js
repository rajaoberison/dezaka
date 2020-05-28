var map = L.map("mapid", {
  scrollWheelZoom: false,
  zoomControl: false,
}).setView([-18.89, 47.521], 6);

document.getElementById("search").onsearch = function () {
  searchValue = document.getElementById("search").value;
  mapDataPoints(searchValue);
};

searchValue = "";
getSearchValue = window.location.search.split("=")[1];
if (getSearchValue) {
  searchValue = getSearchValue.replace("+", " ");
}
mapDataPoints(searchValue);

function mapDataPoints(searchValue) {
  var humdata = data.humdata.features.filter(
    (d) => d.properties.ADM1_EN.toLowerCase() == searchValue.toLowerCase()
  );

  if (humdata.length == 0 || searchValue == "") {
    humdata = data.humdata.features;
  }

  $.getJSON("mapbox.json", function (mapbox) {
    var mapbox = mapbox;

    // Mapbox Layer
    L.tileLayer(
      "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=" +
        mapbox.mapbox,
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        // maxZoom: 18,
        id: "mapbox.streets",
      }
    ).addTo(map);

    ///////////////////////////////////////////
    // POPULATION DATA
    //Custom radius and icon create function
    // https://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers
    //https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    //http://bl.ocks.org/uafrazier/6417e384d22702ac1ebd
    // CUSTOM ICON
    //https://leafletjs.com/reference-1.3.4.html#geojson

    var population = L.markerClusterGroup({
      maxClusterRadius: 120,
      iconCreateFunction: function (cluster) {
        var markers = cluster.getAllChildMarkers();
        //console.log([markers[1].feature.properties.p2009])
        var n = 0;
        for (var i = 0; i < markers.length; i++) {
          n += Math.round(markers[i].feature.properties.p2018est / 1000);
        }
        return L.divIcon({
          html:
            '<span class="badge badge-primary">' +
            "" +
            n.toLocaleString() +
            "k" +
            "</span>",
          className: "data-label",
          iconSize: [0, 0],
        });
      }, //,
      //Disable all of the defaults:
      //spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false
    });

    L.geoJSON(humdata, {
      pointToLayer: function (geoJsonPoint, latlng) {
        return L.marker(latlng, {
          icon: L.divIcon({
            html:
              '<span class="badge badge-light">' +
              geoJsonPoint.properties.ADM4_EN +
              ": " +
              '<span class="badge badge-primary">' +
              geoJsonPoint.properties.p2018est.toLocaleString() +
              "</span>" +
              "<br>" +
              geoJsonPoint.properties.ADM2_EN +
              "</span>",
            iconSize: [0, 0], // size of the icon
            className: "data-label",
          }),
          draggable: "true",
        });
      },
    }).addTo(population);
    //map.addLayer(markers);

    ///////////////////////////////////////////
    // EDUCATION
    var education = L.markerClusterGroup();

    L.geoJSON(data.school, {
      pointToLayer: function (geoJsonPoint, latlng) {
        return L.marker(latlng, {
          icon: L.divIcon({
            html: "<kbd>" + "School" + "</kbd>",
            iconSize: [0, 0], // size of the icon
            // className: 'data-label'
          }),
        });
      },
    }).addTo(education);
    //map.addLayer(education);

    ///////////////////////////////////////////
    // HEALTH
    var health = L.markerClusterGroup();

    L.geoJSON(data.hospital, {
      pointToLayer: function (geoJsonPoint, latlng) {
        return L.marker(latlng, {
          icon: L.divIcon({
            html: "<kbd>" + "Hospital" + "</kbd>",
            iconSize: [0, 0], // size of the icon
            // className: 'data-label'
          }),
          draggable: "true",
        });
      },
    }).addTo(health);
    //map.addLayer(health);

    ///////////////////////////////////////////
    // FOREST COVER
    var forest_cover = L.markerClusterGroup({
      maxClusterRadius: 120,
      iconCreateFunction: function (cluster) {
        var markers = cluster.getAllChildMarkers();
        //console.log([markers[1].feature.properties.p2009])
        var n = 0;
        for (var i = 0; i < markers.length; i++) {
          n += Math.round(markers[i].feature.properties.forest);
        }
        return L.divIcon({
          html:
            '<span class="badge badge-success">' +
            n.toLocaleString() +
            " ha" +
            "</span>",
          className: "data-label",
          iconSize: [0, 0],
        });
      },
    });

    L.geoJSON(humdata, {
      pointToLayer: function (geoJsonPoint, latlng) {
        return L.marker(latlng, {
          icon: L.divIcon({
            html:
              '<span class="badge badge-light">' +
              geoJsonPoint.properties.ADM4_EN +
              ": " +
              '<span class="badge badge-success">' +
              Math.round(geoJsonPoint.properties.forest).toLocaleString() +
              " ha" +
              "</span>" +
              "<br>" +
              geoJsonPoint.properties.ADM2_EN +
              "</span>",
            iconSize: [0, 0], // size of the icon
            className: "data-label",
          }),
          draggable: "true",
        });
      },
    }).addTo(forest_cover);
    //map.addLayer(forest_cover);

    ///////////////////////////////////////////
    // TREE HEIGHT
    var tree_height = L.markerClusterGroup({
      maxClusterRadius: 120,
      iconCreateFunction: function (cluster) {
        var markers = cluster.getAllChildMarkers();
        //console.log([markers[1].feature.properties.p2009])
        var n = 0;
        for (var i = 0; i < markers.length; i++) {
          n += Math.round(markers[i].feature.properties.treeh) / markers.length;
        }
        return L.divIcon({
          html:
            '<span class="badge badge-success">' +
            n.toFixed(1) +
            " m" +
            "</span>",
          className: "data-label",
          iconSize: [0, 0],
        });
      },
    });

    L.geoJSON(humdata, {
      pointToLayer: function (geoJsonPoint, latlng) {
        return L.marker(latlng, {
          icon: L.divIcon({
            html:
              '<span class="badge badge-light">' +
              geoJsonPoint.properties.ADM4_EN +
              ": " +
              '<span class="badge badge-success">' +
              Math.round(geoJsonPoint.properties.treeh).toFixed(1) +
              " m" +
              "</span>" +
              "<br>" +
              geoJsonPoint.properties.ADM2_EN +
              "</span>",
            iconSize: [0, 0], // size of the icon
            className: "data-label",
          }),
          draggable: "true",
        });
      },
    }).addTo(tree_height);
    //map.addLayer(tree_height);

    ///////////////////////////////////////////
    // MANGROVE COVER
    var mangrove_cover = L.markerClusterGroup({
      maxClusterRadius: 50,
      iconCreateFunction: function (cluster) {
        var markers = cluster.getAllChildMarkers();
        //console.log([markers[1].feature.properties.p2009])
        var n = 0;
        for (var i = 0; i < markers.length; i++) {
          n += Math.round(markers[i].feature.properties.mangrove);
        }

        if (n <= 0) {
          var mangrove_style = "badge-no";
        }
        if (n > 0) {
          var mangrove_style = "badge-success";
        }

        return L.divIcon({
          html:
            '<span class="badge ' +
            mangrove_style +
            '">' +
            n.toLocaleString() +
            " ha" +
            "</span>",
          className: "data-label",
          iconSize: [0, 0],
        });
      },
    });

    L.geoJSON(humdata, {
      pointToLayer: function (geoJsonPoint, latlng) {
        mangrove_area = geoJsonPoint.properties.mangrove;
        if (mangrove_area <= 0) {
          var mangrove_style = "badge-no";
          var for_no = "badge-no";
        }
        if (mangrove_area > 0) {
          var mangrove_style = "badge-success";
          var for_no = "";
        }

        return L.marker(latlng, {
          icon: L.divIcon({
            html:
              '<span class="badge badge-light ' +
              for_no +
              '">' +
              geoJsonPoint.properties.ADM4_EN +
              ": " +
              '<span class="badge ' +
              mangrove_style +
              '">' +
              Math.round(mangrove_area).toLocaleString() +
              " ha" +
              "</span>" +
              "<br>" +
              geoJsonPoint.properties.ADM2_EN +
              "</span>",
            iconSize: [0, 0], // size of the icon
            className: "data-label",
          }),
          draggable: "true",
        });
      },
    }).addTo(mangrove_cover);
    //map.addLayer(mangrove_cover);

    ///////////////////////////////////////////
    // FOOD SECURITY
    // http://www.fsnnetwork.org/sites/default/files/coping_strategies_tool.pdf
    var food_security = L.markerClusterGroup({
      maxClusterRadius: 120,
      iconCreateFunction: function (cluster) {
        //-----------------------------------------//
        var markers = cluster.getAllChildMarkers();
        //console.log(markers)
        var n = 0;
        for (var i = 0; i < markers.length; i++) {
          n += Math.round(
            markers[i].feature.properties.CSI_rMean / markers.length
          );

          //-----------------------------------------//
          var status = markers[i].feature.properties.CSI_rMean;
          if (status >= 20) {
            var project_style = "badge-danger";
          } else if (status <= 10) {
            var project_style = "badge-success";
          } else {
            var project_style = "badge-warning";
          }
        }
        return L.divIcon({
          html:
            '<span class="badge ' +
            project_style +
            '">' +
            n.toFixed(0) +
            "</span>",
          className: "data-label",
          iconSize: [0, 0],
        });
      },
    });

    L.geoJSON(data.region_csi, {
      pointToLayer: function (geoJsonPoint, latlng) {
        var status = geoJsonPoint.properties.CSI_rMean;
        if (status >= 20) {
          var project_style = "badge-danger";
        } else if (status <= 10) {
          var project_style = "badge-success";
        } else {
          var project_style = "badge-warning";
        }
        return L.marker(latlng, {
          icon: L.divIcon({
            html:
              '<span class="badge badge-light">' +
              geoJsonPoint.properties.ADM1_EN +
              "&nbsp;" +
              '<span class="badge ' +
              project_style +
              '">' +
              Math.round(geoJsonPoint.properties.CSI_rMean).toFixed(0) +
              "" +
              "</span>" +
              "</span>",
            iconSize: [0, 0], // size of the icon
            className: "data-label",
          }),
          draggable: "true",
        });
      },
    }).addTo(food_security);

    // WORLD BANK
    var wb_project = L.markerClusterGroup({
      maxClusterRadius: 120,
      iconCreateFunction: function (cluster) {
        var markers = cluster.getAllChildMarkers();
        //console.log([markers[1].feature.properties.p2009])
        var n = 0;
        for (var i = 0; i < markers.length; i++) {
          n += Math.round(markers[i].feature.properties.totalamt / 1000000);
        }
        return L.divIcon({
          html:
            '<span class="badge badge-info">' +
            "" +
            n.toLocaleString() +
            "m" +
            "</span>",
          className: "data-label",
          iconSize: [0, 0],
        });
      },
    });

    L.geoJSON(data.wb_data, {
      pointToLayer: function (geoJsonPoint, latlng) {
        var status = geoJsonPoint.properties.status;
        if (status == "Active") {
          var project_style = "badge-success";
        } else {
          var project_style = "badge-danger";
        }

        return L.marker(latlng, {
          icon: L.divIcon({
            html:
              "<div>" +
              '<div class="badge badge-dark">' +
              geoJsonPoint.properties.GeoLocName +
              "</div>" +
              '<span class="badge badge-dark">' +
              '<span class="badge badge-warning">' +
              Math.round(geoJsonPoint.properties.totalamt / 1000000)
                .toFixed(1)
                .toLocaleString() +
              "m" +
              "</span>" +
              "&nbsp; &nbsp;" +
              '<span class="badge badge-pill ' +
              project_style +
              '">' +
              geoJsonPoint.properties.status +
              "</span>" +
              "&nbsp; &nbsp;" +
              '<span class="badge badge-pill ' +
              project_style +
              '">' +
              geoJsonPoint.properties.closingdate
                .split("")
                .slice(0, 4)
                .join("") +
              "</span>" +
              "</span>" +
              "</div>",

            iconSize: [0, 0], // size of the icon
            className: "data-label",
          }),

          draggable: "true",
        }).bindTooltip(geoJsonPoint.properties.project_name, {
          className: "alert alert-dark",
          direction: "top",
        });
      },
    }).addTo(wb_project);

    //map.addLayer(wb_project);

    // TITLE
    var title = L.control({ position: "topleft" });

    var layer_list = [
      population,
      education,
      health,
      forest_cover,
      food_security,
      wb_project,
    ];
    var layer_name = [
      "Population",
      "Education",
      "Health",
      "Forest cover",
      "Food security",
      "World Bank project",
    ];

    title.onAdd = function (map) {
      this._div = L.DomUtil.create("div", "title"); // create a div with a class "title"
      this.update();
      return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    title.update = function (props) {
      this._div.innerHTML = '<div class="h3">' + "Existing datasets" + "</div>";
    };

    title.addTo(map);

    // ALL LAYERS
    L.control
      .layers(
        {},
        {
          "Population 2018": population,
          "School buildings": education,
          "Medical buildings": health,
          "Forest cover": forest_cover,
          "Tree height": tree_height,
          "Mangrove cover": mangrove_cover,
          "Food Security (CSI)": food_security,
          "World Bank projects": wb_project,
        },

        { collapsed: false, position: "topright" }
      )
      .addTo(map);

    // ZOOM
    L.control.zoom({ position: "topleft" }).addTo(map);

    if (humdata.length == 0 || searchValue == "") {
      map.addLayer(food_security);
    } else {
      map.addLayer(population);
    }
  });
}
