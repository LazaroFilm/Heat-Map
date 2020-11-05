const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(url).then((data) => {
  console.log("hello");
  // console.log(data.monthlyVariance);
  console.log(data.baseTemperature);

  const w = 600;
  const h = 300;
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
    .scaleLinear()
    .domain([d3.max(data.monthlyVariance, (d) => d.month), 0])
    .range([h - p, p]);

  const tempScale = d3 //
    .scaleLinear()
    .domain(
      d3.extent(data.monthlyVariance, (d) => data.baseTemperature + d.variance)
    )
    .range("blue", "red");

  const xAxis = d3 //
    .axisBottom(xScale.nice());

  const yAxis = d3 //
    .axisLeft()
    .scale(yScale.nice());

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

  const colorRange = d3 // color range
    .scaleLinear()
    .domain([2, 13])
    .range("blue", "red");

  svg // Dots
    .selectAll(".cell")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .classed("cell", true)
    .attr("x", (d) => xScale(xParseYear(d.year)))
    .attr("y", (d) => yScale(d.month) - 17)
    .attr("height", 17)
    .attr("width", 2.5)
    .attr("data-month", (d) => d.month)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => data.baseTemperature + d.variance)
    .attr("fill", (d, i) => {
      // const temp = data.baseTemperature + d.variance;
      // console.log(tempScale(10));
      // return tempScale(temp);
      // if (temp <= 5) {
      //   return scale[0].color;
      // } else if (temp >= 10) {
      //   return scale[8].color;
      // } else {
      //   return scale[5].color;
      // }
      return "red";
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

  svg // Legend square
    .selectAll(".legend")
    .data(scale)
    .enter()
    .append("rect")
    .classed("legend", true)
    .attr("x", (d, i) => 30 + i * 20)
    .attr("y", h - 30)
    .attr("height", 20)
    .attr("width", 20)
    .attr("fill", (d) => d.color);
});
