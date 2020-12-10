anychart.onDocumentReady(function () {

  // load the data
    anychart.data.loadJsonFile("https://disease.sh/v3/covid-19/countries", function (data) {
    // Variables
    var data1 = [];
    var bubbleData=[];

    for (var i = 0; i < data.length; i++) {
        data1.push({id: data[i].countryInfo.iso2, value: data[i].cases, size: data[i].deaths, title: data[i].country })
    }
    
    // connect the data with the map
    var chart = anychart.map(data1);

    chart.geoData(anychart.maps.world);

    var series = chart.choropleth(data1);
    
// store only the countries that have at least 1 death
    for (var i=0; i<data.length; i++) {
      if (data1[i].size>0){
        bubbleData.push(data1[i]);
      }
    };
    
//    console.log(bubbleData)

    var series_1 = chart.bubble(bubbleData);
    chart.maxBubbleSize(25);
    chart.minBubbleSize(3);
    
    chart.title("COVID-19 Global Cases");

    // color scale ranges
    ocs = anychart.scales.ordinalColor([
      { less: 9999 },
      { from: 10000, to: 49999 },
      { from: 50000, to: 99999 },
      { from: 100000, to: 249999 },
      { from: 250000, to: 499999 },
      { from: 500000, to: 999999 },
      { from: 1000000, to: 14999999 },
      { greater: 15000000 }
    ]);

    // set scale colors
    ocs.colors(["rgb(252,245,245)", "rgb(241,219,216)", "rgb(229,190,185)", "rgb(211,152,145)", "rgb(192,117,109)", "rgb(178,93,86)", "rgb(152,50,48)", "rgb(150,33,31)"]);

    // tell the series what to use as a colorRange (colorScale)
    series.colorScale(ocs);
    
    chart.legend(true);

// set the legend and add styles
    chart.legend()
      .itemsSourceMode("categories") 
      .position('right')
      .align('middle')
      .itemsLayout('vertical')
      .padding(50, 0, 0, 20)
      .paginator(false)
      .title("Total Cases");
      
    // point labels
    series.tooltip().format("Total Confirmed Cases: {%value}");
    series_1.tooltip().format("Total Deaths: {%size}");

    // zoom on click
    chart.listen('pointClick', function(e) {
        chart.zoomToFeature(e.point.get('id'));
    })

    chart.container('mapcontainer');

    chart.draw();

  })
});