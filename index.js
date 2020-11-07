const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(url).then((data) => {
  // console.log("hello");
  // console.log(data.monthlyVariance);
  // console.log(data.baseTemperature);

  const w = 3 * Math.ceil(data.monthlyVariance.length / 12);
  const h = 25 * 12;
  const p = 50;

  const svg = d3 //
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("id", "graph");

  const xParseYear = d3.timeParse("%Y");

  const xScale = d3 //
    .scaleTime()
    .domain(d3.extent(data.monthlyVariance, (d) => xParseYear(d.year)))
    .range([p, w - p]);

  const yScale = d3 //
    .scaleBand()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    // .domain([d3.max(data.monthlyVariance, (d) => d.month - 1), 0])
    .range([h - p, p]);

  // const tempScale = d3 //
  //   .scaleLinear()
  //   .domain(
  //     d3.extent(data.monthlyVariance, (d) => data.baseTemperature + d.variance)
  //   )
  //   .range("blue", "red");

  const xAxis = d3 //
    .axisBottom(xScale);

  const yAxis = d3 //
    .axisLeft()
    .scale(yScale)
    .tickValues(yScale.domain())
    .tickFormat((d) => {
      switch (d) {
        case 1:
          return "January";
        case 2:
          return "February";
        case 3:
          return "March";
        case 4:
          return "April";
        case 5:
          return "May";
        case 6:
          return "June";
        case 7:
          return "July";
        case 8:
          return "August";
        case 9:
          return "September";
        case 10:
          return "October";
        case 11:
          return "November";
        case 12:
          return "December";
        default:
          throw "Bad Month";
      }
    });

  const scale = [
    { temp: 2.8, color: "#4575b4" },
    { temp: 3.9, color: "#74add0" },
    { temp: 5.0, color: "#abd9e9" },
    { temp: 6.1, color: "#e1f2f8" },
    { temp: 7.2, color: "#ffffbf" },
    { temp: 8.3, color: "#fde090" },
    { temp: 10.6, color: "#fdad61" },
    { temp: 11.7, color: "#f36d43" },
    { temp: 12.8, color: "#d63127" },
  ];
  // console.log(data.baseTemperature);
  // console.log(
  //   "extent:",
  //   d3.extent(data.monthlyVariance, (d) => {
  //     console.log("test:", data.baseTemperature + d.variance);
  //     data.baseTemperature + d.variance;
  //   })
  // );
  const legendDomaine = () => {
    const min = d3.min(
      data.monthlyVariance,
      (d) => data.baseTemperature + d.variance
    );
    const max = d3.max(
      data.monthlyVariance,
      (d) => data.baseTemperature + d.variance
    );
    const steps = 7;
    const step = (max - min) / steps;
    let a = [];
    for (let i = 0; i <= steps; i++) {
      a = [...a, min + step * i];
    }
    console.log("domaine: ", a);
    return a;
  };

  const colorRange = d3 // color range
    .scaleThreshold()
    .domain(legendDomaine())
    .range(scale.map((d) => d.color));

  console.log(scale.map((d) => d.color));

  svg // rectangles
    .selectAll(".cell")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .classed("cell", true)
    .attr("x", (d) => xScale(xParseYear(d.year)))
    .attr("y", (d) => yScale(d.month))
    .attr("height", 17)
    .attr("width", 3)
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => data.baseTemperature + d.variance)
    .attr("fill", (d, i) => {
      const temp = data.baseTemperature + d.variance;
      // console.log(temp);
      // console.log(tempScale(10));
      // return tempScale(temp);
      if (temp <= 6) {
        return scale[0].color;
      } else if (temp <= 7) {
        return scale[2].color;
      } else if (temp <= 8) {
        return scale[4].color;
      } else if (temp <= 9) {
        return scale[6].color;
        // } else if (d.month === 1) {
        //   return "green";
      } else {
        return scale[8].color;
      }
      // return "red";
    });

  svg // X axis
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${h - p})`)
    .call(xAxis);

  svg // Y axis
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate( ${p}, 0)`)
    .call(yAxis);

  svg // Legend
    .selectAll("legend")
    .append("rect")
    .attr("id", "legend")
    .classed("legned", true)
    .attr("x", 10)
    .attr("y", h - 30)
    .attr("height", 200)
    .attr("width", 200)
    .attr("fill", "purple");

  svg // Legend square
    .selectAll(".legendRect")
    .data(scale)
    .enter()
    .append("rect")
    .classed("legendRect", true)
    .attr("x", (d, i) => 30 + i * 20)
    .attr("y", h - 30)
    .attr("height", 20)
    .attr("width", 20)
    .attr("fill", (d) => d.color);
});
