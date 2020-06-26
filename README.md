# D3-challenge


## Project Overview

This projects utilizes JavaScript and D3.js to create an interactive, dynamic scatter plot with the goal of visualizing what has often been referred to as the "health-poverty trap". Poverty is both a cause and consequence of poor health. The [data](assets/data/data.csv) used here corresponds to the estimates per state from the 2014 census data. Source: https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml

The [code](assets/js/app.js) is written in JS and uses D3 to fetch data from a CSV file to render it to an [HTML page](index.html).

Note: The HTML page must be run on a local host (localhost:8000).

## Technologies Used

- JavaScript
- HTML
- CSS
- Bootstrap
- D3.js

## Scatter Plot Features

This visualization allows the user to interact with the chart by choosing one of three parameters along each axis to plot. So there are actually 9 plots in 1!
The user is able to choose from the following combinations:
















Values correcsponding to each point are available by hovering over the point. This was posible by utilizing tooltips.


