const fetchDataSet = async () => {
  const response = await fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  );
  const data = await response.json();
  drawGraph(JSON.stringify(data));
};
fetchDataSet();

const drawGraph = async (data) => {
  const dataSet = JSON.parse(data).monthlyVariance;

  console.log(dataSet);

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
    .domain(d3.extent(dataSet, (d) => xParseYear(d.year)))
    .range([p, w - p]);

  const yScale = d3 //
    .scaleLinear()
    .domain([d3.max(dataSet, (d) => d.month), 0])
    .range([h - p, p]);

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

  svg // Dots
    .selectAll(".cell")
    .data(dataSet)
    .enter()
    .append("rect")
    .classed("cell", true)
    .attr("x", (d) => xScale(xParseYear(d.year)))
    .attr("y", (d) => yScale(d.month) - 17)
    .attr("height", 17)
    .attr("width", 1)
    // .attr("fill", "red");
    .attr("fill", (d, i) => {
      // console.log(d.variance);
      // console.log(scale);
      // return d.variance > 0 ? "red" : "blue";
      scale.forEach((element) => {
        // console.log(`${d.variance} <= ${element.temp} = ${element.color}`);
        if (d.variance <= element.temp) {
          console.log(`COLOR ${element.color}`);
          return element.color;
        } else {
          console.error("no color");
        }
      });
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
};
