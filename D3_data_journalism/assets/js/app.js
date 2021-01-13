// * * *
// App.js works in conjunction with app.py, index.html, and style.css to produce an interactive data plot.
// -Loads data and draws scaled svg elements to produce the chart
// -Handles click and hover events
// -Swaps in new datasets when user clicks axis labels
// -Pops up tooltips when user hovers mouse over data points
// * * *

// Declares SVG height and width variables
var svgWidth = 1000;
var svgHeight = 600;

// Appends SVG element to #scatter div
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Declares object variable to hold margins
var margin =
{
    top: 100,
    bottom: 100,
    left: 100,
    right: 100
};

// Sets up chart height and width
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;


// Appends group element to SVG element that will hold chart. Shifts it within margins.
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Declares variables to hold user's dataset choice.
// Defaults are set to display healthcare vs. poverty on page load.
var chosenXAxis = "age";
var chosenYAxis = "healthcare";

// Appends toolTip div to body element
var toolTip = d3.select("body")
                .append("div")
                .attr("class", "d3-tip")
                .style("opacity", 100)
                .style("position", "absolute")
                .style("visibility", "hidden");

var mouseOver = function()
{
    var d3Obj = d3.select(this);
    var data = d3Obj.data();

    var xPos = d3Obj.attr("cx");
    var yPos = d3Obj.attr("cy");

    xPos = parseInt(xPos) + 617
    yPos = parseInt(yPos) + 119

    toolTip.html(`<strong>${data[0].state}</strong><br>${chosenXAxis}: ${data[0][chosenXAxis]}<br>${chosenYAxis}: ${data[0][chosenYAxis]}`)
            .style("display", "block")              
            .style("left", xPos + "px")
            .style("top", yPos + "px")
            .style("visibility", "visible");
};

var mouseOut = function()
{
    toolTip.style("visibility", "hidden");
};

// Imports data
d3.csv("/assets/data/data.csv").then(function (data, err) {
    if (err) throw err;

    // Converts arrays of interest to number data type
    data.forEach(function(d) {
        d.age = +d.age;
        d.healthcare = +d.healthcare;
        d.income = +d.income;
        d.smokes = +d.smokes;
    });

    var xMin = d3.min(data.map(d => d[chosenXAxis]));
    var xMax = d3.max(data.map(d => d[chosenXAxis]));

    var yMin = d3.min(data.map(d => d[chosenYAxis]));
    var yMax = d3.max(data.map(d => d[chosenYAxis]));    

    var xAxisShift = (xMax-xMin)/40;
    var yAxisShift = (yMax-yMin)/40;

    // Declares function to update x scaling rule based on user choice.
    // +1 and -1 add a buffer between the edge of the data and the ends of the axes.
    var x_Scale = d3.scaleLinear()
                    .domain([xMin-xAxisShift, xMax+xAxisShift])
                    .range([0, chartWidth]);
    
    // Declares function to update y scaling rule based on user choice
    var y_Scale = d3.scaleLinear()
                    .domain([yMin-yAxisShift, yMax+yAxisShift])
                    .range([chartHeight, 0]);

    // Appends circles to chart group and positions based on poverty and healthcare data values
    chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        // Extracts an array value, scales it, and uses the scaled value to position the center of the circle
        .attr("cx", d => x_Scale(d[chosenXAxis]))
        .attr("cy", d => y_Scale(d[chosenYAxis]))
        .attr("r", 10)
        .attr("fill", "#34a1eb")
        .on("mouseover", mouseOver);
    
    // Append group element to chartGroup to hold circle labels so they can be removed on click events
    circleTextGroup = svg.append("g");

    // Adds labels to circles
    circleTextGroup.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(data => data.abbr)
        // Places the center (rather than edge) of the text label at the x,y position
        .attr("text-anchor", "middle") 
        .attr("x", d => x_Scale(d[chosenXAxis])+100)
        // Scoots the text label down a little to be better centered over circle
        .attr("y", d => y_Scale(d[chosenYAxis])+104)
        .attr("fill", "white")
        .attr("font-size", "11");

    // Declares scaled axes objects
    var y_axis = d3.axisLeft(y_Scale);
    var x_axis = d3.axisBottom(x_Scale);

    // Appends axes
    chartGroup.append("g")
        .attr("class", "y")
        .call(y_axis);
        
    chartGroup.append("g")
        .attr("class", "x")
        .attr("transform", "translate(0, " + chartHeight + ")") //Shifts x-axis to bottom of chart area
        .call(x_axis);

    // X-axis labels

    // Appends group element to hold x-axis labels so that an event listener can be assigned to the group.
    var labelGroupX = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`); // Shift to bottom center of chart area

    // Appends x-axis label
    labelGroupX.append("text")
        .data("Age")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 20)
        .text("Age")
        .style("font-weight", "bold");
    
    // Appends 2nd x-axis label
    labelGroupX.append("text")
        .data("Age")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Income");

    // Y-axis labels

    // Appends group element to hold y-axis labels so an event listener can be assigned to the group.
    var labelGroupY = chartGroup.append("g");

    // Appends y-axis label
    labelGroupY.append("text")
        .data("Healthcare Index")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "4em") // Specifies label location
        .classed("axis-text", true)
        .text("Healthcare Index")
        .style("font-weight", "bold");
    
    // Appends 2nd y-axis label
    labelGroupY.append("text")
        .data("Smoking Index")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "2.8em") // Specifies label location
        .classed("axis-text", true)
        .text("Smoking Index");

    // Event listeners/handlers for mouse-over events on x-axis labels
    labelGroupX.selectAll("text").on("mouseover", function()
    {
        d3.select(this).style("cursor", "pointer");
    });
    labelGroupX.selectAll("text").on("mouseout", function()
    {
        d3.select(this).style("cursor", "default");
    });
    
    // Event listener/handler for click events on x-axis labels
    labelGroupX.selectAll("text").on("click", function()
    {   
        // Switches highlight to selected label
        labelGroupX.selectAll("text").style("font-weight", "normal");
        d3.select(this).style("font-weight", "bold");
                
        // Retrieves text string from selected label
        var value = d3.select(this).text();
                
        if (value == "Age") {
            value = "age";
        }
        if (value == "Income") {
                    value = "income";
        }
        if(value !== chosenXAxis)
        {
            // Remove x-axis. Will be replaced.
            chartGroup.select(".x").remove();

            // Point chosenXAxis to dataset selected by user
            chosenXAxis = value;
            xMin = d3.min(data.map(d => d[chosenXAxis]));
            xMax = d3.max(data.map(d => d[chosenXAxis]));
            xAxisShift = (xMax-xMin)/40;
            x_Scale = d3.scaleLinear()
                .domain([xMin-xAxisShift, xMax+xAxisShift])
                .range([0, chartWidth]);
            y_Scale = d3.scaleLinear()
                .domain([yMin-yAxisShift, yMax+yAxisShift])
                .range([chartHeight, 0]);
            chartGroup.selectAll("circle")
                .transition()
                .duration(1000)
                .attr("cx", d => x_Scale(d[chosenXAxis])) 
                .attr("cy", d => y_Scale(d[chosenYAxis]));
            console.log(circleTextGroup.selectAll("text"))
            circleTextGroup.selectAll("text")
                .transition()
                .duration(1000)
                .attr("x", d => x_Scale(d[chosenXAxis])+100)
                .attr("y", d => y_Scale(d[chosenYAxis])+104)
            x_axis = d3.axisBottom(x_Scale);
            chartGroup.append("g")
                .attr("class", "x")
                .attr("transform", "translate(0, " + chartHeight + ")") //Shifts x-axis to bottom of chart area
                .transition().duration(1000)
                .call(x_axis);
        } // closes if
    }); // closes event listener

    // Event listener/handler for mouse-over events on y-axis labels
    labelGroupY.selectAll("text").on("mouseover", function()
    {
        d3.select(this).style("cursor", "pointer");
    });
    labelGroupY.selectAll("text").on("mouseout", function()
    {
        d3.select(this).style("cursor", "default");
    });
        
    // Event listener/handler for click events on y-axis labels
    labelGroupY.selectAll("text").on("click", function()
    {
        // Switches highlight to selected label
        labelGroupY.selectAll("text").style("font-weight", "normal");
        d3.select(this).style("font-weight", "bold").style("fill", "black");
               
        // Retrieves text string from selected label
        var value = d3.select(this).text();

        if (value == "Healthcare Index") {
            value = "healthcare";
        }

        if (value == "Smoking Index") {
            value = "smokes";
        }
                
        if(value !== chosenYAxis)
        {
            // Remove y-axis. Will be replaced.
            chartGroup.select(".y").remove();

            // Point chosenYAxis to dataset select by user
            chosenYAxis = value;
            yMin = d3.min(data.map(d => d[chosenYAxis]));
            yMax = d3.max(data.map(d => d[chosenYAxis]));
            yAxisShift = (yMax-yMin)/40;
            x_Scale = d3.scaleLinear()
                .domain([xMin-xAxisShift, xMax+xAxisShift])
                .range([0, chartWidth]);
            y_Scale = d3.scaleLinear()
                .domain([yMin-yAxisShift, yMax+yAxisShift])
                .range([chartHeight, 0]);
            chartGroup.selectAll("circle")
                .transition()
                .duration(1000)
                .attr("cx", d => x_Scale(d[chosenXAxis])) 
                .attr("cy", d => y_Scale(d[chosenYAxis]));
            circleTextGroup.selectAll("text")
                .transition()
                .duration(1000)
                .attr("x", d => x_Scale(d[chosenXAxis])+100)
                .attr("y", d => y_Scale(d[chosenYAxis])+104)
            y_axis = d3.axisLeft(y_Scale);
            chartGroup.append("g")
                .attr("class", "y")
                .transition().duration(1000)
                .call(y_axis);
        } // closes if
    }); // closes event listener

    // Closes d3.csv and logs any errors to the console
}).catch(function (error) {
    console.log(error);

}); // closes .catch