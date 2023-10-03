const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init() {
    d3.json(url).then(function(data) {
        let name = data.names;
        // Add names to drop down menu
        let dropdownMenu = d3.select("#selDataset");
        name.forEach(function(name) {
            dropdownMenu.append("option").text(name);
        });

        // Load in data
        let sampleValues = Object.values(data.samples[0].sample_values);
        let otuIDs = Object.values(data.samples[0].otu_ids);
        let otuLables = Object.values(data.samples[0].otu_labels);
        let metadata = data.metadata[0];

        // Create the default bar plot
        barChart(sampleValues, otuIDs, otuLables);

        // Create default bubble chart
        bubbleChart(otuIDs, sampleValues, otuLables);

        //Create default metadata table
        d3.select("#sample-metadata").html(metadataTable(metadata));

    })
};

init();

// Function called by DOM changes
function optionChanged(value) {
    d3.json(url).then(function(data){

        let index = data.names.indexOf(String(value));
        console.log(index);
        
        // Get data for the new selected person
        let dataValue = Object.values(data.samples[index].sample_values);
        let dataLabel = Object.values(data.samples[index].otu_ids);
        let dataText = Object.values(data.samples[index].otu_labels);
        let metadata = data.metadata[index];

        // Update the chart
        barChart(dataValue, dataLabel, dataText);
        bubbleChart(dataLabel, dataValue, dataText);
        d3.select("#sample-metadata").html(metadataTable(metadata))
    });

  }

function barChart(value, label, text) {
    let x = value.slice(0,10).reverse();
    let y = label.slice(0,10).map(id => `OTU ${id}`).reverse();
    let text1 = text.slice(0,10).reverse();

    let plotData = [{
        x: x,
        y: y,
        text: text1,
        type: "bar",
        orientation: "h"
    }]

    // Call function to update the chart
    Plotly.newPlot("bar", plotData);
}

function bubbleChart(otuIDs, sampleValues, otuLables) {
    let bubblePlot = [{
        type: "bubble",
        x: otuIDs,
        y: sampleValues,
        text: otuLables,
        mode: "markers",
        marker: {
            size: sampleValues,
            color: otuIDs
        }
    }]

    Plotly.newPlot("bubble", bubblePlot);
};

function metadataTable(metadata) {
    let rowValue = [];
    for (var key in metadata) {
        let value = metadata[key]
        rowValue += `${key}: ${value}<br><br>`;
    }
    // console.log(keys, values);
    // console.log(metadata);
    return rowValue;
};