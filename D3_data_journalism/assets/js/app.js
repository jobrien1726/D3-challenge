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
var chosenYAxis = "obesity";

//Function to update x-scale variable upon click on x-axis label
function xScale(data, chosenXAxis) {
    //create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * .8,
            d3.max(data, d => d[chosenXAxis] * 1.1)
        ])
        .range([0, chartWidth]);
    
    return xLinearScale;
}

//Function to update y-scale variable upon click on y-axis label
function yScale(data, chosenYAxis) {
    //create scales
    var yLinearScale = d3.scaleLinear()
        .domain([0,
            d3.max(data, d => d[chosenYAxis] * 1.1)
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

//Function to update abbr group with a transition to new cirles
function renderText(abbrGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    abbrGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]))
  
    return abbrGroup;
}

//Function to update circles group with new tooltip
// function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
//     if (chosenXAxis === "poverty") {
//         var xlabel = "Poverty: ";
//     }
//     else if (chosenXAxis === "age") {
//         var xlabel = "Median Age: ";
//     }
//     else {
//         var xlabel = "Median Income: ";
//     }

//     if (chosenYAxis === "obesity") {
//         var ylabel = "Obesity: ";
//     }
//     else if (chosenYAxis === "smokes") {
//         var ylabel = "Smokes: ";
//     }
//     else {
//         var ylabel = "Lacks Healthcare: ";
//     }

//     var toolTip = d3.tip()
//         .attr("class", "tooltip")
//         .offset([80, -60])
//         .html(function(d) {
//             return (`<h1>${d.state}</h1><br>${xlabel} ${d[chosenXAxis]}%<br>${ylabel} ${d[chosenYAxis]}%`);
//         });

//     circlesGroup.call(toolTip);

//     circlesGroup.on("mouseover", function(data) {
//         toolTip.show(data);
//     })  
//         //onmouseout event
//         .on("mouseout", function(data, index) {
//             toolTip.hide(data);
//         });

//     return circlesGroup;
// }

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
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    //Append y-axis
    var yAxis = chartGroup.append("g")
        .attr("class", "y-axis")
        .call(leftAxis);

    //Append Initial Circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("class", "stateCircle");

    //Create abbreviation labels
    var abbrGroup = chartGroup.selectAll()
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .text(d => d.abbr)
        .attr("class", "stateText");

    //Create group for 3 x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") //value to grab for event listener
        .classed("active aText", true)
        .text("In Poverty (%)");

    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") //value to grab for event listener
        .classed("inactive aText", true)
        .text("Age (Median)");

    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") //value to grab for event listener
        .classed("inactive aText", true)
        .text("Household Income (Median)");

    //Create group for 3 y-axis labels

    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left}, ${chartHeight / 2})`);

    var obesityLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", 10)
        .attr("dy", "1em")
        .attr("value", "obesity") //value to grab for event listener
        .classed("active aText", true)
        .text("Obese (%)");

    var smokesLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", 30)
        .attr("dy", "1em")
        .attr("value", "smokes") //value to grab for event listener
        .classed("inactive aText", true)
        .text("Smokes (%)");

    var healthcareLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", 50)
        .attr("dy", "1em")
        .attr("value", "healthcare") //value to grab for event listener
        .classed("inactive aText", true)
        .text("Lacks Healthcare (%)");

    //updateToolTip function from above csv import
    // var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                // updates x scale for new data
                xLinearScale = xScale(data, chosenXAxis);

                // updates x axis with transition
                xAxis = renderXAxis(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // updates abbr w new x values
                abbrGroup = renderText(abbrGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                // circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                
                // changes classes to change bold text
                if (chosenXAxis === "poverty") {
                    povertyLabel
                      .classed("active aText", true)
                      .classed("inactive aText", false);
                    ageLabel
                      .classed("active aText", false)
                      .classed("inactive aText", true);
                    incomeLabel
                      .classed("active aText", false)
                      .classed("inactive aText", true);
                }
                else if (chosenXAxis === "age") {
                    povertyLabel
                      .classed("active aText", false)
                      .classed("inactive aText", true);
                    ageLabel
                      .classed("active aText", true)
                      .classed("inactive aText", false);
                    incomeLabel
                      .classed("active aText", false)
                      .classed("inactive aText", true);
                }
                else {
                    povertyLabel
                      .classed("active aText", false)
                      .classed("inactive aText", true);
                    ageLabel
                      .classed("active aText", false)
                      .classed("inactive aText", true);
                    incomeLabel
                      .classed("active aText", true)
                      .classed("inactive aText", false);
                }
            }
        });

    // y axis labels event listener 
    yLabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

                // replaces chosenXAxis with value
                chosenYAxis = value;

                // updates x scale for new data
                yLinearScale = yScale(data, chosenYAxis);

                // updates x axis with transition
                yAxis = renderYAxis(yLinearScale, yAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                // circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                
                // changes classes to change bold text
                if (chosenYAxis === "obesity") {
                    obesityLabel
                      .classed("active aText", true)
                      .classed("inactive aText", false);
                    smokesLabel
                      .classed("active aText", false)
                      .classed("inactive aText", true);
                    healthcareLabel
                      .classed("active aText", false)
                      .classed("inactive aText", true);
                }
                else if (chosenYAxis === "smokes") {
                    obesityLabel
                      .classed("active aText", false)
                      .classed("inactive aText", true);
                    smokesLabel
                      .classed("active aText", true)
                      .classed("inactive aText", false);
                    healthcareLabel
                      .classed("active aText", false)
                      .classed("inactive aText", true);
                }
                else {
                    obesityLabel
                      .classed("active aText", false)
                      .classed("inactive aText", true);
                    smokesLabel
                      .classed("active aText", false)
                      .classed("inactive aText", true);
                    healthcareLabel
                      .classed("active aText", true)
                      .classed("inactive aText", false);
                }
            }
        });
}).catch(function(error) {
    console.log(error);
});
