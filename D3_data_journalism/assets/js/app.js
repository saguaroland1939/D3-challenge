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
    bottom: 50,
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


    // Convert arrays of interest to number data type
    data.forEach(function(d) {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });
    
    // Declares x and y scaling rules
    var x_Scale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.poverty)])
        .range([0, chartWidth]);

    var y_Scale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([chartHeight, 0]);

    // Appends circles to chart group and position based on poverty and healthcare data values
    chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", data => x_Scale(data.poverty))
        .attr("cy", data => y_Scale(data.healthcare))
        .attr("r", 15)
        .attr("fill", "#34a1eb")
    
    // Add labels to circles
    chartGroup.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(data => data.abbr)
        .attr("text-anchor", "middle")
        .attr("x", data => x_Scale(data.poverty))
        .attr("y", data => y_Scale(data.healthcare)+5)
        .attr("fill", "white");

    // Declares scaled axes objects
    var y_axis = d3.axisLeft(y_Scale).ticks(5);
    var x_axis = d3.axisBottom(x_Scale).ticks(5);

    // Appends two group elements to SVG to hold axes.
    chartGroup.append("g")
        .call(y_axis);
        
    chartGroup.append("g")
        .attr("transform", "translate(0, " + chartHeight + ")") //Shifts x-axis to bottom of chart area
        .call(x_axis);

    // Logs any errors to the console
}).catch(function (error) {
    console.log(error);

}); // closes .catch chained to d3.csv