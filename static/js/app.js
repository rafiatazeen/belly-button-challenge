//Use the D3 library to read in samples.json from the URL

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


// Promise Pending
// const dataPromise = d3.json(url);
// console.log("Data Promise: ", dataPromise);


// Fetch the JSON data and console log it

d3.json(url).then(function(data) {
    console.log(data);
  });
  

function buildMetadata(sample_id) {
  d3.json(url).then((data) => {
    let metadata = data.metadata;
    let value = metadata.filter(result => result.id == sample_id);
    // console.log(value)
    let valueData = value[0];
    let metadatadiv = d3.select('#sample-metadata');
    metadatadiv.html("");
    Object.entries(valueData).forEach(([key, value]) => {
      // console.log(key,value)
      metadatadiv.append('h5').text(`${key}: ${value}`);
    });
  });
};


function buildBarchart(sample_id) {
  d3.json(url).then((data) => {
    let id_info = data.samples;
    let value = id_info.filter(result => result.id == sample_id);
    let valueData = value[0];
    
    let otu_ids = valueData.otu_ids.slice(0,10).reverse();
    let otu_labels = valueData.otu_labels.slice(0, 10).reverse();
    let sample_values = valueData.sample_values.slice(0, 10).reverse();
    // console.log(otu_ids, otu_labels, sample_values);

    let trace = {
      x: sample_values,
      y: otu_ids.map(object => 'OTU ' + object),
      text: otu_labels,
      type: "bar",
      orientation: "h"
    };

    let layout = {
      margin: {t: 30, 1: 150}
    }

    Plotly.newPlot("bar", [trace], layout)
  });
};


function buildBubblechart(sample_id) {
  d3.json(url).then((data) => {
    let id_info = data.samples;
    let value = id_info.filter(result => result.id == sample_id);
    let valueData = value[0];

    let otu_ids = valueData.otu_ids;
    let otu_labels = valueData.otu_labels;
    let sample_values = valueData.sample_values;

    let trace_bubble = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids
      }
    };

    let layout = {
      xaxis: {title: "OTU ID"}
    };

    Plotly.newPlot("bubble", [trace_bubble], layout)
  });
};


function init() {
  let selector = d3.select('#selDataset');
  d3.json(url).then((data) => {
    let sampleNames = data.names;
    sampleNames.forEach((id) => {
      // console.log(id);
      selector
      .append("option")
      .text(id)
      .property('value',id);
    });

    let id_one = sampleNames[0];
    // console.log(id_one);
    buildMetadata(id_one);
    buildBarchart(id_one);
    buildBubblechart(id_one);
  });
};

function optionChanged(sample_id) {
  buildMetadata(sample_id);
  buildBarchart(sample_id);
  buildBubblechart(sample_id);

};



init();