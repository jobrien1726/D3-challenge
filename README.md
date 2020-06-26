# D3-challenge


## Project Overview

This projects aims to visualize what has often been referred to as the "health-poverty trap". Poverty is both a cause and consequence of poor health. The [data](assets/data/data.csv) used here corresponds to the estimates per state for 2014 census data from: https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml

## Technologies Used





This visualization allows to choose the parameter to plot in a dynamic way. Values correcsponding to each point are available by hovering over the point. This was posible by utilizing tooltips.

The code (assets/js/app.js) is written in JS and uses D3 to fetch data from csv file to render it to a html (index.html).

The visualization is runned on a local host localhost:8000 using 'python -m http.server'
