'use strict';

const fs = require('fs');
const _ = require('lodash');

console.time('entire process');

function calculate(file, column) {
  return sort(column, tabulate(column, file, parse(getData(file))));
}

function getData(file) {
  return fs.readFileSync('./data/' + file + '.csv')
        .toString()
        .split('\r\n')
        .map(row => row.split(','));
}

function parse(dataSet) {
  let columnHeader = _.first(dataSet);
  let columnData = _.rest(dataSet);

  return columnData.map ( function (data) {
    let record = {};
    for (var i in data) {
      record[columnHeader[i]] = data[i];
    }
    return record;
  });
}

function tabulate(column, file, parsedColumns) {
  return parsedColumns.reduce(function(memo, record) {
    if (file === 'crime') {
      if (record['OFFENSE_CATEGORY_ID'] !== 'traffic-accident') {
        memo[record[column]] = ++memo[record[column]] || 1
      }
    } else {
      memo[record[column]] = ++memo[record[column]] || 1
    }
    return memo
  }, {})
}

function sort(record, results) {
  let sortable = [];
  for (var record in results) {
    sortable.push([record, results[record]])
  }
  sortable.sort(function(a,b) { return a[1] - b[1] })
  return sortable;
}

let incidents = calculate('traffic-accidents', 'INCIDENT_ADDRESS')
let neighborhoods = calculate('traffic-accidents', 'NEIGHBORHOOD_ID')
let crimes = calculate('crime', 'NEIGHBORHOOD_ID')

console.timeEnd('entire process');

//console.log(incidents);
//console.log(neighborhoods);
//console.log(crimes);
