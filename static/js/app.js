const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init() {
    d3.json(url).then(function(data) {        
        // Add test subject id to drop down menu
        let name = data.names;
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

        // Create default metadata table
        d3.select("#sample-metadata").html(metadataTable(metadata));

        // Create default gauge chart
        let wfreq = data.metadata[0].wfreq;
        gaugeChart(wfreq);       
    })
};

function optionChanged(value) {
    d3.json(url).then(function(data){

        let index = data.names.indexOf(String(value));
        // console.log(index);
        
        // Get data for the new selected person
        let dataValue = Object.values(data.samples[index].sample_values);
        let dataLabel = Object.values(data.samples[index].otu_ids);
        let dataText = Object.values(data.samples[index].otu_labels);
        let metadata = data.metadata[index];
        let wfreq = data.metadata[index].wfreq;

        // Update the chart
        barChart(dataValue, dataLabel, dataText);
        bubbleChart(dataLabel, dataValue, dataText);
        d3.select("#sample-metadata").html(metadataTable(metadata))
        gaugeChart(wfreq);
        console.log(wfreq);
    });

  }

function barChart(value, label, text) {
    // Prepare the data for the bar plot
    let x = value.slice(0,10).reverse();
    let y = label.slice(0,10).map(id => `OTU ${id}`).reverse();
    let text1 = text.slice(0,10).reverse();
    
    let plotData = [{
        x: x,
        y: y,
        text: text1,
        type: "bar",
        orientation: "h",
        marker: {color: 'rgb(49,130,189)',
                opacity: 0.75}
    }]
    // Update layout
    let layout = {
        width: 400,
        height: 450,
        margin: {t:0, r:0, b:25}
    };
    // Call function to update the chart
    Plotly.newPlot("bar", plotData, layout);
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
            color: otuIDs,
            colorscale: 'YlGnBu'
        }
    }]

    let layout = {
        width: 1200,
        height: 400,
        margin: {t: 25, r: 25, l: 25, b: 25}
    }
    Plotly.newPlot("bubble", bubblePlot, layout);
};

function metadataTable(metadata) {
    let rowValue = [];
    for (var key in metadata) {
        let value = metadata[key]
        rowValue += `${key}: ${value}<br>`;
    }
    // console.log(keys, values);
    // console.log(metadata);
    return rowValue;
};

function gaugeChart(number) {
    let washData = [{
            type: "indicator",            
            mode: "gauge+number",           
            value: number,           
            title: {text: `<b>Belly Button Washing Frequency</b> <br>Scrubs per Week`},                   
            gauge: {            
              axis: {range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },            
              bar: {color: 'rgb(49,130,189)', opacity:0.75},            
              bgcolor: "white",            
              borderwidth: 2,                        
              steps: [            
                {range: [0, 1], color: '#ffffd9'},
                {range: [1,2], color: '#edf8b1'},
                {range: [2,3], color: '#c7e9b4'},
                {range: [3,4], color: '#7fcdbb'},
                {range: [4,5], color: '#41b6c4'},
                {range: [5,6], color: '#1d91c0'},
                {range: [6,7], color: '#225ea8'},
                {range: [7,8], color: '#0c2c84'},
                {range: [8,9], color: '#011d6b'}                      
              ],           
              threshold: {            
                line: {color: "red", width: 4},            
                thickness: 0.75,            
                value: number           
              },          
            }            
          }
    ];
    let layout = {
        width: 500,
        height: 400,
    };
    Plotly.newPlot("gauge", washData, layout);
}

init();