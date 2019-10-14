// Drawing the scatterplot

// 1. Margins, width and height

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// 2. X and Y scales are created

var parseDate = d3.timeParse("%Y-%m-%d");

var x = d3.scaleTime()
    .range([0, width])
var y = d3.scaleLinear()
    .range([height, 0]);

// 3. Add SVG to the body

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Loading DATA

// 4. Load the CSV and draw points

d3.csv("egresos_compurgado.csv")
    .then(function(data) {
    // Coerce the strings to numbers.
    data.forEach(function(d) {
        d.fecha_de_libertad = parseDate(d.fecha_de_libertad)
        d.total = +d.total;
    });

    // Compute the scales’ domains.
    x.domain(d3.extent(data, function(d) { return d.fecha_de_libertad; }));
    console.log(x)
    y.domain(d3.extent(data, function(d) { return d.total; })).nice();

    // Add the x-axis.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")));

    // Add the y-axis.
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    console.log(data)
    // Add the points!
    svg.selectAll(".point")
        .data(data)
        .enter().append("path")
        .attr("class", "point")
        .attr("d", d3.symbol().type(d3.symbolTriangle))
        .attr("transform", function(d) { return "translate(" + x(d.fecha_de_libertad) + "," + y(d.total) + ")"; });
});
