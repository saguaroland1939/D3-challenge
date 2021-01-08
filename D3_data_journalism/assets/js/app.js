// README

// Declare SVG height and width variables
var svgWidth = 1000;
var svgHeight = 750;

// Append SVG element to #scatter div
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Declare object variable to hold margins
var margin =
{
    top: 50,
    botton: 50,
    left: 50,
    right: 50
};

// Set up chart height and width
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Append group element to SVG element that will hold chart. Shift it within margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data
d3.csv("/assets/data/data.csv").then(function (data, err) {
    if (err) throw err;

    // Figure out how to extract arrays of interest
    var poverty = data.map(x =>x.poverty);
    var healthcare = data.map(x =>x.healthcare);

    // Convert data arrays to numeric format for scaling and plotting
    poverty.forEach(function (data) {
        data = +data;
    });

    healthcare.forEach(function (data) {
        data = +data;
    });

    // Declares x and y scaling rules
    var x_Scale = d3.scaleLinear()
        .domain([0, d3.max([poverty])])
        .range([0, chartWidth]);

    var y_Scale = d3.scaleLinear()
        .domain([0, d3.max([healthcare])])
        .range([chartHeight, 0]);

    // Appends circles to chart group and position based on poverty and healthcare data values
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x_Scale(poverty))
        .attr("cy", d => y_Scale(healthcare))
        .attr("fill", "blue");
    // Adds text labels

    // Declare scaled axes objects
    var y_axis = d3.axisLeft(y_Scale);
    var x_axis = d3.axisBottom(x_Scale);

    // Append two group elements to SVG to hold axes. Shift the x-axis group into place
    chartGroup.append("g")
        .classed("axis", true)
        .call(y_axis);

    chartGroup.append("g")
        .classed("axis", true)
        .attr("transform", "translate(0, " + chartHeight + ")")
        .call(x_axis);

    // Log any errors to the console
}).catch(function (error) {
    console.log(error);

}); // closes .catch chained to d3.csv