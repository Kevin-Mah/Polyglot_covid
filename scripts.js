const api = 'https://disease.sh/v3/covid-19/historical/Canada%2C%20United%20States?lastdays=all';

const getData = async () => {
  const response = await fetch(`${api}`);
  if (response.ok) {
    return await response.json();
  } else {
    return Promise.reject(response.status);
  }
};

const result = getData();
result
  .then((data) => {
    let date = Object.keys(data[0].timeline.cases);
    let total = Object.values(data[0].timeline.cases);
    for(var i=0; i<total.length; i++) {
            total[i] = total[i] / 376;
        }
    let deaths = Object.values(data[0].timeline.deaths);
    for(var i=0; i<deaths.length; i++) {
            deaths[i] = deaths[i] / 376;
        }
    let totalus = Object.values(data[1].timeline.cases);
    for(var i=0; i<totalus.length; i++) {
            totalus[i] = totalus[i] / 3282;
        }
    let deathsus = Object.values(data[1].timeline.deaths);
    for(var i=0; i<deathsus.length; i++) {
            deathsus[i] = deathsus[i] / 3282;
        }
    var ctx = document.getElementById('myChart').getContext('2d');
    let myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: date,
        datasets: [
          {
            label: ' Cases Canada',
            data: total,
            borderColor: 'rgba(247, 29, 29, 1)',
            fill: false,
          },
          {
            label: 'Deaths Canada',
            data: deaths,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
          },
          {
            label: ' Cases US',
            data: totalus,
            borderColor: 'rgba(176, 95, 255, 1)',
            fill: false,
          },
          {
            label: 'Deaths US',
            data: deathsus,
            borderColor: 'rgba(255, 118, 0, 1)',
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Number of Cases/Deaths',
              },
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Date(DD/MM/YYYY)',
              },
            },
          ],
        },
        title: {
          display: true,
          text: `Total Cases and Deaths per 100,000`,
        },
      },
    });    
  })
  .catch((error) => {
    console.log('Error: ', error);
  });

const getData1 = async () => {
  const response1 = await fetch("./data/data.json");
  if (response1.ok) {
    return await response1.json();
  } else {
    return Promise.reject(response1.status);
  }
};

const result1 = getData1();
result1
  .then((data1) => {
    var date = data1["Dates"];
    var cases = data1["Cases"];
    var deaths = data1["Fatal"];
    var casesma = data1["Cases_ma"];
    var deathsma = data1["Fatal_ma"];
    var casesma30 = data1["Cases_ma30"];
    var deathsma30 = data1["Fatal_ma30"];

    var ctx1 = document.getElementById('myChart1').getContext('2d');
    let myChart1 = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: date,
        datasets: [
          {
            label: ' Daily Cases Canada',
            data: cases,
            borderColor: 'rgba(247, 29, 29, 1)',
            fill: false,
          },
          {
            label: ' Cases 7-day Moving Ave.',
            data: casesma,
            borderColor: 'rgba(29, 61, 247, 1)',
            fill: false,
            pointRadius: 0,
            pointHitRadius: 0,
          },
          {
            label: 'Cases 30-day Moving Ave.',
            data: casesma30,
            borderColor: 'rgba(249, 231, 26, 1)',
            fill: false,
            pointRadius: 0,
            pointHitRadius: 0,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Number of Cases',
              },
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Date(DD/MM/YYYY)',
              },
            },
          ],
        },
        title: {
          display: true,
          text: `Daily Cases and Moving Averages`,
        },
      },
    });
    
    var ctx2 = document.getElementById('myChart2').getContext('2d');
    let myChart2 = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: date,
        datasets: [
          {
            label: ' Daily Deaths Canada',
            data: deaths,
            borderColor: 'rgba(247, 29, 29, 1)',
            fill: false,
          },
          {
            label: ' Deaths 7-day Moving Ave.',
            data: deathsma,
            borderColor: 'rgba(29, 61, 247, 1)',
            fill: false,
            pointRadius: 0,
            pointHitRadius: 0,
          },
          {
            label: 'Deaths 30-day Moving Ave.',
            data: deathsma30,
            borderColor: 'rgba(249, 231, 26, 1)',
            fill: false,
            pointRadius: 0,
            pointHitRadius: 0,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Number of Deaths',
              },
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Date(DD/MM/YYYY)',
              },
            },
          ],
        },
        title: {
          display: true,
          text: `Daily Deaths and Moving Averages`,
        },
      },
    });
  })


const getData2 = async () => {
  const response2 = await fetch("./data/prov.json");
  if (response2.ok) {
    return await response2.json();
  } else {
    return Promise.reject(response2.status);
  }
};

function provChart(date, cases, fatal, hosp, crit, prov, chart) {
    var ctx = document.getElementById(chart).getContext('2d');

    let mychart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: date,
        datasets: [
          {
            label: ' Daily Cases',
            data: cases,
            borderColor: 'rgba(146, 207, 211, 1)',
            fill: false,
          },
          {
            label: 'Fatalities',
            data: fatal,
            borderColor: 'rgba(247, 29, 29, 1)',
            fill: false,
          },
          {
            label: 'Hospitalizations',
            data: hosp,
            borderColor: 'rgba(29, 61, 247, 1)',
            fill: false,
          },
          {
            label: 'Critical',
            data: crit,
            borderColor: 'rgba(249, 231, 26, 1)',
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Number of People',
              },
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Date(DD/MM/YYYY)',
              },
            },
          ],
        },
        title: {
          display: true,
          fontSize: 24,
          text: prov ,
        },
      },
    });
}

function getrecent(info) {
    return info[info.length - 1]
}

function provtext(date, cases, fatal, hosp, crit, prov, name) {
    document.getElementById(name).innerHTML =
        prov + ' Numbers for '
        + getrecent(date) + ':<br>'
        + 'New Cases: ' + getrecent(cases) + '<br>' 
        + 'Fatalities: ' + getrecent(fatal) + '<br>' 
        + 'Hospitalizations: ' + getrecent(hosp) + '<br>' 
        + 'In Critical Condition: ' + getrecent(crit);
}

const result2 = getData2();
result2
  .then((data2) => {
    var date = data2["Dates"];
    var ontc100 = data2.Ont["Cases100"];
    var quec100 = data2.Que["Cases100"];
    var bcc100 = data2.Bc["Cases100"];
    var abc100 = data2.Ab["Cases100"];
    var manc100 = data2.Man["Cases100"];
    
    var ontcases = data2.Ont["Cases"];
    var ontfatal = data2.Ont["Fatal"];
    var onthosp = data2.Ont["Hosp"];
    var ontcrit = data2.Ont["Crit"];
    
    var quecases = data2.Que["Cases"];
    var quefatal = data2.Que["Fatal"];
    var quehosp = data2.Que["Hosp"];
    var quecrit = data2.Que["Crit"];
    
    var bccases = data2.Bc["Cases"];
    var bcfatal = data2.Bc["Fatal"];
    var bchosp = data2.Bc["Hosp"];
    var bccrit = data2.Bc["Crit"];
    
    var abcases = data2.Ab["Cases"];
    var abfatal = data2.Ab["Fatal"];
    var abhosp = data2.Ab["Hosp"];
    var abcrit = data2.Ab["Crit"];
    
    var mancases = data2.Man["Cases"];
    var manfatal = data2.Man["Fatal"];
    var manhosp = data2.Man["Hosp"];
    var mancrit = data2.Man["Crit"];
    
    var ctx3 = document.getElementById('myChart3').getContext('2d');
    let myChart = new Chart(ctx3, {
      type: 'line',
      data: {
        labels: date,
        datasets: [
          {
            label: 'Ontario',
            data: ontc100,
            borderColor: 'rgba(247, 29, 29, 1)',
            fill: false,
          },
          {
            label: 'Quebec',
            data: quec100,
            borderColor: 'rgba(29, 61, 247, 1)',
            fill: false,
          },
          {
            label: 'BC',
            data: bcc100,
            borderColor: 'rgba(249, 231, 26, 1)',
            fill: false,
          },
          {
            label: 'Alberta',
            data: abc100,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
          },
          {
            label: 'Manitoba',
            data: manc100,
            borderColor: 'rgba(176, 95, 255, 1)',
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Number of Cases',
              },
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Date(DD/MM/YYYY)',
              },
            },
          ],
        },
        title: {
          display: true,
          text: `Daily Cases per 100,000`,
        },
      },
    });
    provChart(date, ontcases, ontfatal, onthosp, ontcrit, 'Ontario', 'chartOnt');
    provtext (date, ontcases, ontfatal, onthosp, ontcrit, 'Ontario', 'onttext');
    
    provChart(date, quecases, quefatal, quehosp, quecrit, 'Quebec', 'chartQue');
    provtext (date, quecases, quefatal, quehosp, quecrit, 'Quebec', 'quetext');
    
    provChart(date, bccases, bcfatal, bchosp, bccrit, 'British Columbia', 'chartBc');
    provtext (date, bccases, bcfatal, bchosp, bccrit, 'British Columbia', 'bctext');
    
    provChart(date, abcases, abfatal, abhosp, abcrit, 'Alberta', 'chartAb');
    provtext (date, abcases, abfatal, abhosp, abcrit, 'Alberta', 'abtext');
    
    provChart(date, mancases, manfatal, manhosp, mancrit, 'Manitoba', 'chartMan');
    provtext (date, mancases, manfatal, manhosp, mancrit, 'Manitoba', 'mantext');
  })


const getData3 = async () => {
  const response3 = await fetch("./data/deathcorr.json");
  if (response3.ok) {
    return await response3.json();
  } else {
    return Promise.reject(response3.status);
  }
};

const result3 = getData3();
result3
  .then((data3) => {
      var datacorr = data3["XYsmk"];
      var agecorr = data3["XYage"];
      var smkcoef = data3.Smkcorr;
      var agecoef = data3.Agecorr;
      var country = data3["Country"];
    
    document.getElementById('smkcoef').innerHTML = 'Correlation Coefficient of Smoking/Death: ' + smkcoef
    document.getElementById('agecoef').innerHTML = 'Correlation Coefficient of Age/Death: ' + agecoef
    
    var ctx4 = document.getElementById('smkcorr').getContext('2d');
    let smkcorr = new Chart(ctx4, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: ' Scatter',
            data: datacorr,
            borderColor: 'rgba(29, 61, 247, 1)',
            backgroundColor: 'rgba(29, 61, 247, 1)',
          },
        ],
      },
        options: {
            scales: {
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: '% of a Country that Smokes',
                  },
                },
              ],
              xAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Deaths per 100,000',
                  },
                },
              ],
            },
            title: {
              display: true,
              text: `Smoking Correlation to Death Rates`,
              fontSize: 24,
            },
            tooltips: {
                custom: function(tooltip) {
                    if (!tooltip) return;
                    tooltip.displayColors = false;
                },
               callbacks: {
                  label: function(tooltipItem, data) {
                     var label = country[tooltipItem.index];
                     return [label, 'deaths per 100k: ' + tooltipItem.xLabel, '% smokers: ' + tooltipItem.yLabel];
                  },
               },
            },
        },
    });
    
    var ctx5 = document.getElementById('agecorr').getContext('2d');
    let agechart = new Chart(ctx5, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: ' Scatter',
            data: agecorr,
            borderColor: 'rgba(247, 29, 29, 1)',
            backgroundColor: 'rgba(247, 29, 29, 1)',
          },
        ],
      },
        options: {
            scales: {
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Median Age of Country Population',
                  },
                },
              ],
              xAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Deaths per 100,000',
                  },
                },
              ],
            },
            title: {
              display: true,
              text: `Age Correlation to Death Rates`,
              fontSize: 24,
            },
            tooltips: {
               custom: function(tooltip) {
                    if (!tooltip) return;
                    tooltip.displayColors = false;
                  },
               callbacks: {
                  label: function(tooltipItem, data) {
                     var label = country[tooltipItem.index];
                     return [label, 'deaths per 100k: ' + tooltipItem.xLabel, 'mean age: ' + tooltipItem.yLabel];
                  },
               },
            },
        },
    });
  })
  .catch((error) => {
    console.log('Error: ', error);
  });