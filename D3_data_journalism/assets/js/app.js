//Set svg width and height
var svgWidth = 960;
var svgHeight = 500;

//Set margins
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

//Set chart width and height by subtracting margins from svg width and height
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

//Create svg wrapper, append svg group that will hold our chart
//Shift svg group by left and top margins
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//Append svg group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initial Parameters
var chosenXAxis = "poverty";

//Function to update x-scale variable upon click on x-axis label
function xScale(data, chosenXAxis) {
    //create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]),
            d3.max(data, d => d[chosenXAxis])
        ])
        .range([0, chartWidth]);
    
    return xLinearScale;
}

//Function to update y-scale variable upon click on y-axis label
function yScale(data, chosenYAxis) {
    //create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]),
            d3.max(data, d => d[chosenXAxis])
        ])
        .range([chartHeight, 0]);

    return yLinearScale;
}

//Function to update xAxis variable upon click on x-axis label
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
}

//Function to update yAxis variable upon click on y-axis label
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

//Function to update circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

//Function to update circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    if (chosenXAxis === "poverty") {
        var label = "Poverty:";
    }
    else if (chosenXAxis === "age") {
        var label = "Median Age:";
    }
    else {
        var label = "Median Income:";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })  
        //onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

//Retrieve data from csv file
d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;

    //Parse data
    data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
    });

    //xLinearScale function from above csv import
    var xLinearScale = xScale(data, chosenXAxis);

    //yLinearScale function from above csv import
    var yLinearScale = yScale(data, chosenYAxis);

    //Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append x-Axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    //Append y-axis
    var yAxis = chartGroup.append("g")
})
