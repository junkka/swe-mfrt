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
        yAxis: {
          title: {text: "MFRT"}
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
          zoomType: 'xy',
          borderWidth : 1,
          borderColor: '#D7D7D7'
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
            events: {
              click: function (event) {
                update_table(this.userOptions.county);
              }
            }
          },
          line: {
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 4,
                color: '#000000'
              }
            },
            marker: {
              enabled: false
            }
          }
        },
        series : d
      });
  }

  var update_table = function(code){
    update_color(code);
    $scope.$apply();
  }

  var update_color = function(code){
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
});
var colors = [
    {county: 1, color: "#AFAFAF", cname: "Stockholm"},
    {county: 2, color: "#6B9AC5", cname: "Stockholm stad"},
    {county: 3, color: "#AFAFAF", cname: "Uppsala"},
    {county: 4, color: "#AFAFAF", cname: "Söremanland"},
    {county: 5, color: "#AFAFAF", cname: "Östergötland"},
    {county: 6, color: "#AFAFAF", cname: "Jönköping"},
    {county: 7, color: "#AFAFAF", cname: "Kronoberg"},
    {county: 8, color: "#AFAFAF", cname: "Kalmar"},
    {county: 9, color: "#6B9AC5", cname: "Gotland"},
    {county: 10, color: "#AFAFAF", cname: "Blekinge"},
    {county: 11, color: "#AFAFAF", cname: "Kristianstads"},
    {county: 12, color: "#AFAFAF", cname: "Skåne"},
    {county: 13, color: "#AFAFAF", cname: "Hallands"},
    {county: 14, color: "#AFAFAF", cname: "Västra Götalands"},
    {county: 15, color: "#AFAFAF", cname: "Älvsborgs"},
    {county: 16, color: "#AFAFAF", cname: "Skaraborgs"},
    {county: 17, color: "#AFAFAF", cname: "Värmlands"},
    {county: 18, color: "#AFAFAF", cname: "Örebro"},
    {county: 19, color: "#AFAFAF", cname: "Västmanlands"},
    {county: 20, color: "#AFAFAF", cname: "Dalarnas"},
    {county: 21, color: "#AFAFAF", cname: "Gävleborgs"},
    {county: 22, color: "#AFAFAF", cname: "Västernorrlands"},
    {county: 23, color: "#AFAFAF", cname: "Jämtlands"},
    {county: 24, color: "#C64141", cname: "Västerbottens"},
    {county: 25, color: "#C64141", cname: "Norrbottens"},
    {county: "NA", color: "#000000", cname: "Sweden"}
  ];

var plot_data = function(d){
  
  var set_color = function(code){
    var results = colors.filter(function (entry) { return entry.county === code; });
    return(results[0].color)
  }
  var ret = [];
  angular.forEach(d, function(value, key) {
    this.push({name: key, data: value.data, color: set_color(value.county[0]), county: value.county[0] });
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
