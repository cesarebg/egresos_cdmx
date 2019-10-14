// Drawing the scatterplot

// 1. Margins, width and height

var margin = {top: 20, right: 220, bottom: 30, left: 40},
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

var p = d3.select("body").append("p")
    .attr("class", "tooltip_p")
    .style("opacity", 0);


// Loading DATA

// 4. Load the CSV and draw points

d3.csv("egresos_spread.csv")
    .then(function(data) {
    // Coerce the strings to numbers.
        data.forEach(function(d) {
        d.fecha_de_libertad = parseDate(d.fecha_de_libertad);
        d.COMPURGADO = +d.COMPURGADO;
        d.EXTERNADO = +d.EXTERNADO;
        d.ABSUELTO = +d.ABSUELTO;
        d.OTROS = +d.OTROS;
        d["CONDENA CONDICIONAL/SUSPENSIÓN CONDICIONADA DE PENA"] = +d["CONDENA CONDICIONAL/SUSPENSIÓN CONDICIONADA DE PENA"]
        d["LIBERTAD PREPARATORIA"] = +d["LIBERTAD PREPARATORIA"]
        d["REMISION PARCIAL DE LA PENA"] = +d["REMISION PARCIAL DE LA PENA"]
        d["TRATAMIENTO EN LIBERTAD/SEMILIBERTAD"] = +d["TRATAMIENTO EN LIBERTAD/SEMILIBERTAD"]
    });

    console.log(data)

    // Compute the scales’ domains.

    x.domain(d3.extent(data, function(d) { return d.fecha_de_libertad; }));

    y.domain(d3.extent(data, function(d) { return d.EXTERNADO; })).nice();

    loessRegression_e = d3.regressionLoess()
      .x(d => d.fecha_de_libertad)
      .y(d => d.EXTERNADO)
      .bandwidth(0.20);

    loessRegression_c = d3.regressionLoess()
      .x(d => d.fecha_de_libertad)
      .y(d => d.COMPURGADO)
      .bandwidth(0.20);

    loessRegression_a = d3.regressionLoess()
      .x(d => d.fecha_de_libertad)
      .y(d => d.ABSUELTO)
      .bandwidth(0.20);

    loessRegression_o = d3.regressionLoess()
      .x(d => d.fecha_de_libertad)
      .y(d => d.OTROS)
      .bandwidth(0.20);

    loessRegression_co = d3.regressionLoess()
      .x(d => d.fecha_de_libertad)
      .y(d => d["CONDENA CONDICIONAL/SUSPENSIÓN CONDICIONADA DE PENA"])
      .bandwidth(0.20);

    loessRegression_li = d3.regressionLoess()
      .x(d => d.fecha_de_libertad)
      .y(d => d["LIBERTAD PREPARATORIA"])
      .bandwidth(0.20);

    loessRegression_re = d3.regressionLoess()
      .x(d => d.fecha_de_libertad)
      .y(d => d["REMISION PARCIAL DE LA PENA"])
      .bandwidth(0.20);

    loessRegression_ta = d3.regressionLoess()
      .x(d => d.fecha_de_libertad)
      .y(d => d["TRATAMIENTO EN LIBERTAD/SEMILIBERTAD"])
      .bandwidth(0.20);

    var valueline = d3.line()
            .x(function(d) { return x(d[0]); })
            .y(function(d) { return y(d[1]); })
            .curve(d3.curveCatmullRom);

    console.log(loessRegression_e(data)[199][0])

    console.log(typeof valueline(loessRegression_e(data)))


    // svg.append("path")
    //     .data([loessRegression(data)])
    //     .attr("class", "line")
    //     .attr("d", valueline);

    svg.append("path")
        .data([loessRegression_e(data)])
        .attr("class", "line_e")
        .attr("d", valueline)
        .on("mouseover", handleMouseOver_e)
        .on("mouseout", handleMouseOut_e);


    svg.append("path")
        .data([loessRegression_c(data)])
        .attr("class", "line_c")
        .attr("d", valueline)
        .on("mouseover", handleMouseOver_c)
        .on("mouseout", handleMouseOut_c);


    svg.append("path")
        .data([loessRegression_a(data)])
        .attr("class", "line_a")
        .attr("d", valueline)
        .on("mouseover", handleMouseOver_a)
        .on("mouseout", handleMouseOut_a);


    svg.append("path")
        .data([loessRegression_o(data)])
        .attr("class", "line_o")
        .attr("d", valueline)
        .on("mouseover", handleMouseOver_o)
        .on("mouseout", handleMouseOut_o);


    svg.append("path")
        .data([loessRegression_co(data)])
        .attr("class", "line_co")
        .attr("d", valueline)
        .on("mouseover", handleMouseOver_co)
        .on("mouseout", handleMouseOut_co);


    svg.append("path")
        .data([loessRegression_li(data)])
        .attr("class", "line_li")
        .attr("d", valueline)
        .on("mouseover", handleMouseOver_li)
        .on("mouseout", handleMouseOut_li);


    svg.append("path")
        .data([loessRegression_re(data)])
        .attr("class", "line_re")
        .attr("d", valueline)
        .on("mouseover", handleMouseOver_re)
        .on("mouseout", handleMouseOut_re);


    svg.append("path")
        .data([loessRegression_ta(data)])
        .attr("class", "line_ta")
        .attr("d", valueline)
        .on("mouseover", handleMouseOver_ta)
        .on("mouseout", handleMouseOut_ta);



    // Add the x-axis.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")));

    // Add the y-axis.
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

        var formatTime = d3.timeFormat("%Y-%m-%d");
        var div = d3.select("body").append("div")
          .attr("class", "tooltip_p")
          .style("position", "relative")
          .style("opacity", 0);

    // Add the points!
    svg.selectAll(".point")
        .data(data)
        .enter().append("path")
        .attr("class", "point")
        .attr("d", d3.symbol().type(d3.symbolSquare))
        .attr("transform", function(d) { return "translate(" + x(d.fecha_de_libertad) + "," + y(d.EXTERNADO) + ")"; })
        .on("mouseover", function(d) {
                                      div.transition()
                                        .duration(200)
                                        .style("opacity", 1);
                                      div.html("Fecha: " + formatTime(d.fecha_de_libertad) + "<br/>" + "Externado: " + d.EXTERNADO)
                                        .style("left", x(d.fecha_de_libertad) + 3 + "px")
                                        .style("top", y(d.EXTERNADO) - 615 + "px");
                                      handleMouseOver_e(d)
                                      })
        .on("mouseout", function(d) {
                                      div.transition()
                                        .duration(500)
                                        .style("opacity", 0);
                                      handleMouseOut_e(d)
                                      });


    svg.selectAll(".point-2")
        .data(data)
        .enter().append("path")
        .attr("class", "point-2")
        .attr("d", d3.symbol().type(d3.symbolSquare))
        .attr("transform", function(d) { return "translate(" + x(d.fecha_de_libertad) + "," + y(d.COMPURGADO) + ")"; })
        .on("mouseover", function(d) {
                                      div.transition()
                                        .duration(200)
                                        .style("opacity", 1);
                                      div.html("Fecha: " + formatTime(d.fecha_de_libertad) + "<br/>" + "Compurgado: " + d.COMPURGADO)
                                        .style("left", d3.event.pageX + 3 + "px")
                                        .style("top", d3.event.pageY - 615 + "px");
                                      handleMouseOver_c(d)
                                      })
        .on("mouseout", function(d) {
                                      div.transition()
                                        .duration(500)
                                        .style("opacity", 0);
                                      handleMouseOut_c(d)
                                      });

    svg.selectAll(".point-3")
            .data(data)
            .enter().append("path")
            .attr("class", "point-3")
            .attr("d", d3.symbol().type(d3.symbolSquare))
            .attr("transform", function(d) { return "translate(" + x(d.fecha_de_libertad) + "," + y(d.ABSUELTO) + ")"; })
            .on("mouseover", function(d) {
                                          div.transition()
                                            .duration(200)
                                            .style("opacity", 1);
                                          div.html("Fecha: " + formatTime(d.fecha_de_libertad) + "<br/>" + "Absueltos: " + d.ABSUELTO)
                                            .style("left", d3.event.pageX + 3 + "px")
                                            .style("top", d3.event.pageY - 615 + "px");
                                          handleMouseOver_a(d)
                                          })
            .on("mouseout", function(d) {
                                          div.transition()
                                            .duration(500)
                                            .style("opacity", 0);
                                          handleMouseOut_a(d)
                                          });


    svg.selectAll(".point-4")
            .data(data)
            .enter().append("path")
            .attr("class", "point-4")
            .attr("d", d3.symbol().type(d3.symbolSquare))
            .attr("transform", function(d) { return "translate(" + x(d.fecha_de_libertad) + "," + y(d.OTROS) + ")"; })
            .on("mouseover", function(d) {
                                          div.transition()
                                            .duration(200)
                                            .style("opacity", 1);
                                          div.html("Fecha: " + formatTime(d.fecha_de_libertad) + "<br/>" + "Otros: " + d.OTROS)
                                            .style("left", d3.event.pageX + 3 + "px")
                                            .style("top", d3.event.pageY - 615 + "px");
                                          handleMouseOver_o(d)
                                          })
            .on("mouseout", function(d) {
                                          div.transition()
                                            .duration(500)
                                            .style("opacity", 0);
                                          handleMouseOut_o(d)
                                          });

    svg.selectAll(".point-5")
            .data(data)
            .enter().append("path")
            .attr("class", "point-5")
            .attr("d", d3.symbol().type(d3.symbolSquare))
            .attr("transform", function(d) { return "translate(" + x(d.fecha_de_libertad) + "," + y(d["CONDENA CONDICIONAL/SUSPENSIÓN CONDICIONADA DE PENA"]) + ")"; })
            .on("mouseover", function(d) {
                                          div.transition()
                                            .duration(200)
                                            .style("opacity", 1);
                                          div.html("Fecha: " + formatTime(d.fecha_de_libertad) + "<br/>" + "Condena condicional: " + d["CONDENA CONDICIONAL/SUSPENSIÓN CONDICIONADA DE PENA"])
                                            .style("left", d3.event.pageX + 3 + "px")
                                            .style("top", d3.event.pageY - 615 + "px");
                                          handleMouseOver_co(d)
                                          })
            .on("mouseout", function(d) {
                                          div.transition()
                                            .duration(500)
                                            .style("opacity", 0);
                                          handleMouseOut_co(d)
                                          });

    svg.selectAll(".point-6")
            .data(data)
            .enter().append("path")
            .attr("class", "point-6")
            .attr("d", d3.symbol().type(d3.symbolSquare))
            .attr("transform", function(d) { return "translate(" + x(d.fecha_de_libertad) + "," + y(d["LIBERTAD PREPARATORIA"]) + ")"; })
            .on("mouseover", function(d) {
                                          div.transition()
                                            .duration(200)
                                            .style("opacity", 1);
                                          div.html("Fecha: " + formatTime(d.fecha_de_libertad) + "<br/>" + "Libertad preparatoria: " + d["LIBERTAD PREPARATORIA"])
                                            .style("left", d3.event.pageX + 3 + "px")
                                            .style("top", d3.event.pageY - 615 + "px");
                                          handleMouseOver_li(d)
                                          })
            .on("mouseout", function(d) {
                                          div.transition()
                                            .duration(500)
                                            .style("opacity", 0);
                                          handleMouseOut_li(d)
                                          });

    svg.selectAll(".point-7")
            .data(data)
            .enter().append("path")
            .attr("class", "point-7")
            .attr("d", d3.symbol().type(d3.symbolSquare))
            .attr("transform", function(d) { return "translate(" + x(d.fecha_de_libertad) + "," + y(d["REMISION PARCIAL DE LA PENA"]) + ")"; })
            .on("mouseover", function(d) {
                                          div.transition()
                                            .duration(200)
                                            .style("opacity", 1);
                                          div.html("Fecha: " + formatTime(d.fecha_de_libertad) + "<br/>" + "Remisión parcial: " + d["REMISION PARCIAL DE LA PENA"])
                                            .style("left", d3.event.pageX + 3 + "px")
                                            .style("top", d3.event.pageY - 615 + "px");
                                          handleMouseOver_re(d)
                                          })
            .on("mouseout", function(d) {
                                          div.transition()
                                            .duration(500)
                                            .style("opacity", 0);
                                          handleMouseOut_re(d)
                                          });

    svg.selectAll(".point-8")
            .data(data)
            .enter().append("path")
            .attr("class", "point-8")
            .attr("d", d3.symbol().type(d3.symbolSquare))
            .attr("transform", function(d) { return "translate(" + x(d.fecha_de_libertad) + "," + y(d["TRATAMIENTO EN LIBERTAD/SEMILIBERTAD"]) + ")"; })
            .on("mouseover", function(d) {
                                          div.transition()
                                            .duration(200)
                                            .style("opacity", 1);
                                          div.html("Fecha: " + formatTime(d.fecha_de_libertad) + "<br/>" + "Tratamiento en libertad: " + d["TRATAMIENTO EN LIBERTAD/SEMILIBERTAD"])
                                            .style("left", d3.event.pageX + 3 + "px")
                                            .style("top", d3.event.pageY - 615 + "px");
                                          handleMouseOver_ta(d)
                                          })
            .on("mouseout", function(d) {
                                          div.transition()
                                            .duration(500)
                                            .style("opacity", 0);
                                          handleMouseOut_ta(d)
                                          });


    var body = d3.select('body');

    body.append('div')
      .attr('class', 'tooltip')
      .attr('id', "externado")
      .style("position", "absolute")
      .text("Externado")
      .style("left", x(loessRegression_e(data)[199][0]) + 48 + "px")
      .style("top", y(loessRegression_e(data)[199][1]) + 8 + "px")
      .on("mouseover", handleMouseOver_e)
      .on("mouseout", handleMouseOut_e);
      // .style("display", "none");
      // .attr("transform", "translate(" + (x(loessRegression_e(data)[199][0])) + "," + y(loessRegression_e(data)[199][1]) + ")");

      body.append('div')
        .attr('class', 'tooltip')
        .attr('id', "compurgado")
        .style("position", "absolute")
        .text("Compurgado")
        .style("left", x(loessRegression_c(data)[199][0]) + 50 + "px")
        .style("top", y(loessRegression_c(data)[199][1]) + 8 + "px")
        .on("mouseover", handleMouseOver_c)
        .on("mouseout", handleMouseOut_c);

        body.append('div')
          .attr('class', 'tooltip')
          .attr('id', "absuelto")
          .style("position", "absolute")
          .text("Absuelto")
          .style("left", x(loessRegression_a(data)[199][0]) + 48 + "px")
          .style("top", y(loessRegression_a(data)[199][1]) + 8 + "px")
          .on("mouseover", handleMouseOver_a)
          .on("mouseout", handleMouseOut_a);

          body.append('div')
            .attr('class', 'tooltip')
            .attr('id', "otros")
            .style("position", "absolute")
            .text("Otros")
            .style("left", x(loessRegression_o(data)[199][0]) + 48 + "px")
            .style("top", y(loessRegression_o(data)[199][1]) + 8 + "px")
            .on("mouseover", handleMouseOver_o)
            .on("mouseout", handleMouseOut_o);

            body.append('div')
              .attr('class', 'tooltip')
              .attr('id', "condicional")
              .style("position", "absolute")
              .text("Condena condicional")
              .style("left", x(loessRegression_co(data)[199][0]) + 48 + "px")
              .style("top", y(loessRegression_co(data)[199][1]) + 8 + "px")
              .on("mouseover", handleMouseOver_co)
              .on("mouseout", handleMouseOut_co);

              body.append('div')
                .attr('class', 'tooltip')
                .attr('id', "libertad")
                .style("position", "absolute")
                .text("Libertad preparatoria")
                .style("left", x(loessRegression_li(data)[199][0]) + 48 + "px")
                .style("top", y(loessRegression_li(data)[199][1]) + 8 + "px")
                .on("mouseover", handleMouseOver_li)
                .on("mouseout", handleMouseOut_li);

                body.append('div')
                  .attr('class', 'tooltip')
                  .attr('id', "remision")
                  .style("position", "absolute")
                  .text("Remisión parcial")
                  .style("left", x(loessRegression_re(data)[199][0]) + 48 + "px")
                  .style("top", y(loessRegression_re(data)[199][1]) + 8 + "px")
                  .on("mouseover", handleMouseOver_li)
                  .on("mouseout", handleMouseOut_li);

                  body.append('div')
                    .attr('class', 'tooltip')
                    .attr('id', "tratamiento")
                    .style("position", "absolute")
                    .text("Tratamiento en libertad")
                    .style("left", x(loessRegression_ta(data)[199][0]) + 48 + "px")
                    .style("top", y(loessRegression_ta(data)[199][1]) + 8 + "px")
                    .on("mouseover", handleMouseOver_ta)
                    .on("mouseout", handleMouseOut_ta);

                    // body.append('div')
                    //   .data(data)
                    //   .enter()
                    //   .attr('class', 'tooltip')
                    //   .attr('id', "tooltip")
                    //   .style("position", "absolute")
                    //   .text("Tratamiento en libertad")
                    //   .style("left", x(data.fecha_de_libertad) + 48 + "px")
                    //   .style("top", y(data.EXTERNADO) + 8 + "px")
                    //   .on("mouseover", handleMouseOver_ta)
                    //   .on("mouseout", handleMouseOut_ta);

                    // body.append('p')
                    //   .data(data)
                    //   .enter().append("path")
                    //   .attr('class', 'tooltip_p')
                    //   .attr("transform", function(d) { return "translate(" + x(d.fecha_de_libertad) + "," + y(d.EXTERNADO) + ")"; })
                    //   .style("opacity", 0)

                    // svg.selectAll('.tooltip_p')
                    //   .data(data)
                    //   .enter().append("path")
                    //   .attr('class', 'tooltip_p')
                    //   .style("position", "absolute")
                    //   .style("opacity", 1)
                    //   .attr("d", path)
                    //   .attr("transform", function(d) { return "translate(" + x(d.fecha_de_libertad) + "," + y(d.EXTERNADO) + ")"; })
                      // .style("left", x(function(d) { return x(d[d.fecha_de_libertad]); }) + "px")
                      // .style("top", y(function(d) { return y(d[d.EXTERNADO]); }) + "px")


                      // .x(function(d) { return x(d[0]); })
                      // .y(function(d) { return y(d[1]); })
                      // .style("left", (d3.event.pageX) + "px")
                      // .style("top", (d3.event.pageY - 28) + "px")




                    function handleMouseOver_e(d) {

                     d3.select("#externado")
                        .style(".border-color", "red")
                        .style("color", "red")
                        .style("z-index", "20");

                      d3.selectAll(".point")
                          .style("opacity", "1")
                          .style("z-index", "20")

                      d3.select(".line_e")
                        .style("stroke-width", "6")

                    }

                   function handleMouseOut_e(d) {
                     d3.select("#externado")
                        .style(".border-color", "black")
                        .style("color", "black");

                        d3.selectAll(".point")
                            .style("opacity", "0.3")

                        d3.select(".line_e")
                          .style("stroke-width", "4")

                     }

                     function handleMouseOver_c(d) {

                      d3.select("#compurgado")
                         .style(".border-color", "steelblue")
                         .style("color", "steelblue")
                         .style("z-index", "20");

                         d3.selectAll(".point-2")
                             .style("opacity", "1")
                             .style("z-index", "10")

                     d3.select(".line_c")
                       .style("stroke-width", "6")

                     }

                    function handleMouseOut_c(d) {
                      d3.select("#compurgado")
                         .style(".border-color", "black")
                         .style("color", "black");


                         d3.selectAll(".point-2")
                             .style("opacity", "0.3")

                         d3.select(".line_c")
                           .style("stroke-width", "4")
                      }

                      function handleMouseOver_a(d) {

                       d3.select("#absuelto")
                          .style(".border-color", "green")
                          .style("color", "green")
                          .style("z-index", "20");

                          d3.selectAll(".point-3")
                              .style("opacity", "1")
                              .style("z-index", "20")

                      d3.select(".line_a")
                        .style("stroke-width", "6")
                        .style("z-index", "20")

                      }

                     function handleMouseOut_a(d) {
                       d3.select("#absuelto")
                          .style(".border-color", "black")
                          .style("color", "black")
                          .style("z-index", "auto");


                          d3.selectAll(".point-3")
                              .style("opacity", "0.3")
                              .style("z-index", "auto");


                          d3.select(".line_a")
                            .style("stroke-width", "4")
                            .style("z-index", "auto");
                       }

                       function handleMouseOver_o(d) {

                       d3.select("#otros")
                          .style(".border-color", "orange")
                          .style("color", "orange")
                          .style("z-index", "20");


                          d3.selectAll(".point-4")
                              .style("opacity", "1")
                              .style("z-index", "20");

                      d3.select(".line_o")
                        .style("stroke-width", "6")
                        .style("z-index", "20");
                      }

                     function handleMouseOut_o(d) {
                       d3.select("#otros")
                          .style(".border-color", "black")
                          .style("color", "black")
                          .style("z-index", "auto");


                          d3.selectAll(".point-4")
                              .style("opacity", "0.3")
                              .style("z-index", "auto");


                          d3.select(".line_o")
                            .style("stroke-width", "4")
                            .style("z-index", "auto");
                          }

                          function handleMouseOver_co(d) {

                          d3.select("#condicional")
                             .style(".border-color", "purple")
                             .style("color", "purple")
                             .style("z-index", "20");


                             d3.selectAll(".point-5")
                                 .style("opacity", "1")
                                 .style("z-index", "20");

                         d3.select(".line_co")
                           .style("stroke-width", "6")
                           .style("z-index", "20");
                         }

                        function handleMouseOut_co(d) {
                          d3.select("#condicional")
                             .style(".border-color", "black")
                             .style("color", "black")
                             .style("z-index", "auto");


                             d3.selectAll(".point-5")
                                 .style("opacity", "0.3")
                                 .style("z-index", "auto");


                             d3.select(".line_co")
                               .style("stroke-width", "4")
                               .style("z-index", "auto");
                             }

                             function handleMouseOver_li(d) {

                             d3.select("#libertad")
                                .style(".border-color", "black")
                                .style("color", "black")
                                .style("z-index", "20");


                                d3.selectAll(".point-6")
                                    .style("opacity", "1")
                                    .style("z-index", "20");

                            d3.select(".line_li")
                              .style("stroke-width", "6")
                              .style("z-index", "20");
                            }

                           function handleMouseOut_li(d) {
                             d3.select("#libertad")
                                .style(".border-color", "black")
                                .style("color", "black")
                                .style("z-index", "auto");


                                d3.selectAll(".point-6")
                                    .style("opacity", "0.3")
                                    .style("z-index", "auto");


                                d3.select(".line_li")
                                  .style("stroke-width", "4")
                                  .style("z-index", "auto");
                                }

                                function handleMouseOver_re(d) {

                                d3.select("#remision")
                                   .style(".border-color", "brown")
                                   .style("color", "brown")
                                   .style("z-index", "20");


                                   d3.selectAll(".point-7")
                                       .style("opacity", "1")
                                       .style("z-index", "20");

                               d3.select(".line_re")
                                 .style("stroke-width", "6")
                                 .style("z-index", "20");
                               }

                              function handleMouseOut_re(d) {
                                d3.select("#remision")
                                   .style(".border-color", "black")
                                   .style("color", "black")
                                   .style("z-index", "auto");


                                   d3.selectAll(".point-7")
                                       .style("opacity", "0.3")
                                       .style("z-index", "auto");


                                   d3.select(".line_re")
                                     .style("stroke-width", "4")
                                     .style("z-index", "auto");
                                   }

                                   function handleMouseOver_ta(d) {

                                   d3.select("#tratamiento")
                                      .style(".border-color", "pink")
                                      .style("color", "pink")
                                      .style("z-index", "20");


                                      d3.selectAll(".point-8")
                                          .style("opacity", "1")
                                          .style("z-index", "20");

                                  d3.select(".line_ta")
                                    .style("stroke-width", "6")
                                    .style("z-index", "20");
                                  }

                                 function handleMouseOut_ta(d) {
                                   d3.select("#tratamiento")
                                      .style(".border-color", "black")
                                      .style("color", "black")
                                      .style("z-index", "auto");


                                      d3.selectAll(".point-8")
                                          .style("opacity", "0.3")
                                          .style("z-index", "auto");


                                      d3.select(".line_ta")
                                        .style("stroke-width", "4")
                                        .style("z-index", "auto");
                                      }




});
