// README


// Declare SVG height and width variables
var svgWidth = 750;
var svgHeight = 500;

// Append SVG element to #scatter div
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Declare object variable to hold margins
var margin =
{
    top: 100,
    bottom: 100,
    left: 100,
    right: 100
};

// Set up chart height and width
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;


// Append group element to SVG element that will hold chart. Shift it within margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Declare variables to hold user's dataset choice.
// Defaults are set to display healthcare vs. poverty on page load.
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Import data
d3.csv("/assets/data/data.csv").then(function (data, err) {
    if (err) throw err;

    // Convert arrays of interest to number data type
    data.forEach(function(d) {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
        d.age = +d.age;
        d.smokes = +d.smokes;
    });

    // Declares function to update x scaling rule based on user choice
    function getXScale(data, chosenXAxis) 
    {
        var x_Scale = d3.scaleLinear()
                        .domain([0, d3.max(data.map(d => d[chosenXAxis]))])
                        .range([0, chartWidth]);
        return x_Scale;
    }
    
    // Declares function to update y scaling rule based on user choice
    function getYScale(data, chosenYAxis) 
    {
        var y_Scale = d3.scaleLinear()
                        .domain([0, d3.max(data.map(d => d[chosenYAxis]))])
                        .range([chartHeight, 0]);
        return y_Scale;
    }

    // Appends circles to chart group and position based on poverty and healthcare data values
    chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", getXScale(data, chosenXAxis))
        .attr("cy", getYScale(data, chosenYAxis))
        .attr("r", 15)
        .attr("fill", "#34a1eb")
    
    // Adds labels to circles
    chartGroup.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(data => data.abbr)
        .attr("text-anchor", "middle")
        .attr("x", getXScale(data, chosenXAxis))
        .attr("y", getYScale(data, chosenYAxis))
        .attr("fill", "white");

    // Declares scaled axes objects
    var y_axis = d3.axisLeft(getYScale(data, chosenYAxis)).ticks(5);
    var x_axis = d3.axisBottom(getXScale(data, chosenXAxis)).ticks(5);

    // Appends axes
    chartGroup.append("g")
        .call(y_axis);
        
    chartGroup.append("g")
        .attr("transform", "translate(0, " + chartHeight + ")") //Shifts x-axis to bottom of chart area
        .call(x_axis);

    // Appends x-axis labels
    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`); // Shift to bottom center of chart area

    labelsGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 20)
        .text("Poverty Index");
    
    labelsGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Age");

    // Append y-axis labels
    chartGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "4em") // Specifies label location
        .classed("axis-text", true)
        .text("Healthcare Index");
    
    chartGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "2.8em") // Specifies label location
        .classed("axis-text", true)
        .text("Smoking Index");

    // Logs any errors to the console
}).catch(function (error) {
    console.log(error);

}); // closes .catch chained to d3.csv