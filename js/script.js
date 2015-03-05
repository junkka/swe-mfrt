var parishApp = angular.module('mfrtApp', [
  'ngRoute'
]);

parishApp.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      });
  });

parishApp.controller('MainCtrl', function($scope, $http) {
  var map;
  var age_map;
  $scope.selected_code = colors[0];
  $scope.counties = colors;

  $http({method: 'GET', url: 'data/mfrt.json'}).
    success(function(d) {
      plot_chart(plot_data(d));
      $scope.dataLoading = false;
    }).
    error(function(d, s) {
      console.log("error", d, s);
    });

  $http({method: 'GET', url: 'data/mfrt_table.json'}).
    success(function(data){
      $scope.tbl = data;
    });

  $http({method: 'GET', url: 'data/map.geo.json'}).
    success(function(data){
      console.log(data);
      plot_map(data);
    });

  $http({method: 'GET', url: 'data/age_mfrt_' + $scope.selected_code.county + '.json'}).
    success(function(data){
      var d2 =  fig_data(data);
      plot_age_chart(d2);
    });

  $scope.$watch('selected_code', function(a){
    // rerender map
    $http({method: 'GET', url: 'data/age_mfrt_' + a.county + '.json'}).
      success(function(data){
        var d = fig_data(data);
        for (var i=0,  tot=age_map.series.length; i < tot; i++) {
          age_map.series[i].setData(d[i].data);
        }
      });
  });


  var set_series_color = function(k){
    map.series[k].update({color: '#FF5463'});
    for (var i=0,  tot=map.series.length; i < tot; i++) {
      // var j = i -1
      if (i !== k){
        map.series[i].update({color: "#AFAFAF"});
      }
    } 
  }

  var update_table = function(county){
    // console.log(county);
    set_series_color(county.index);
    update_color(county.userOptions.county);
    // color series
    $scope.$apply();
  }

  var update_color = function(code){
    console.log("update_color", code);
    $scope.selected_code = $.grep(colors, function(e){ return e.county == code; })[0];
  }

  $scope.select_county = function(code){
    update_color(code);

    indexes = $.map(map.series, function(obj, index) {
      if(obj.userOptions.county == code) {
        return index;
      }
    });

    map.series[indexes].update({
      color: "#000000"
    });
  };

  var plot_map = function(d){
    console.log('plot map');
    cnty_map = new Highcharts.Map({
      chart: {
        renderTo: 'cnty_map'
      },
      title: {
        text: ''
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        map: {
          mapData: d,
          color: 'white',
          joinBy: ['lan', 'county'],
          states: {
            hover: {
              color: '#DED835',
              enabled: true
            }
          },
          events: {
            click: function (event) {
              update_color(event.point.lan);
              // console.log(event.point.lan);
              // update_table(this);
              // color series
              $scope.$apply();
            }
          }
        }
      },
      series: [{
        data : colors,
        name: 'County'
      }]
    });
  };

  var plot_age_chart = function(d){
    console.log(d);
    age_map = new Highcharts.Chart({
      chart: {
          renderTo: 'mfrtage',
          type: 'line',
          zoomType: 'y',
          borderWidth : 1,
          borderColor: '#D7D7D7'
        },      
        title: {
            text: ''
        },
        xAxis: {
          categories: ['20-24', '25-29', '30-34', '35-39', '40-44']
        },
        yAxis: {
          title: {text: "MFRT"},
          min: 0,
          max: 500
        },
        legend: {
          enabled: false
        },
        series : d
    });
  }

  var plot_chart = function(d){
     map = new Highcharts.Chart({
        chart: {
          renderTo: 'mfrtfigure',
          type: 'line',
          zoomType: 'xy'
        },      
        title: {
            text: ''
        },
        yAxis: {
          title: {text: "TMFRT"}
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          series:{
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 4,
                color: '#000000'
              }
            },
            events: {
              click: function (event) {
                // console.log(this);
                update_table(this);
              }
            }
          },
          line: {
            
            marker: {
              enabled: false
            }
          }
        },
        series : d
      });
  }

});
var colors = [
    {county: 1, cname: "Stockholm"},
    {county: 2, cname: "Stockholm stad"},
    {county: 3, cname: "Uppsala"},
    {county: 4, cname: "Söremanland"},
    {county: 5, cname: "Östergötland"},
    {county: 6, cname: "Jönköping"},
    {county: 7, cname: "Kronoberg"},
    {county: 8, cname: "Kalmar"},
    {county: 9, cname: "Gotland"},
    {county: 10, cname: "Blekinge"},
    {county: 11, cname: "Kristianstads"},
    {county: 12, cname: "Skåne"},
    {county: 13, cname: "Hallands"},
    {county: 14, cname: "Västra Götalands"},
    {county: 15, cname: "Älvsborgs"},
    {county: 16, cname: "Skaraborgs"},
    {county: 17, cname: "Värmlands"},
    {county: 18, cname: "Örebro"},
    {county: 19, cname: "Västmanlands"},
    {county: 20, cname: "Dalarnas"},
    {county: 21, cname: "Gävleborgs"},
    {county: 22, cname: "Västernorrlands"},
    {county: 23, cname: "Jämtlands"},
    {county: 24, cname: "Västerbottens"},
    {county: 25, cname: "Norrbottens"},
    {county: "NA", cname: "Sweden"}
  ];

var plot_data = function(d){
  
  var set_color = function(code){
    var results = colors.filter(function (entry) { return entry.county === code; });
    return(results[0].color)
  }
  var ret = [];
  angular.forEach(d, function(value, key) {
    this.push({name: key, data: value.data, color: '#AFAFAF', county: value.county[0] });
  }, ret);

  return(ret);
}

var fig_data = function(d){
  var ret = [];
  angular.forEach(d, function(value, key) {
    this.push({name: key, data: value.data});
  }, ret);
  return(ret);
}
