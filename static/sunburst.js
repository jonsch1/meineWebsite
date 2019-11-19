const data = {
		"name": "Biomedical Sciences",
		"children": [{
				"name": "Year 1",
				"children": [{
						"name": "The Lego Bricks of Life",
						"size": 20
					},
					{
						"name": "Homeostasis and Organ Systems",
						"size": 20
					},
					{
						"name": "Statistics",
						"size": 10
					},
					{
						"name": "Brain, Behaviour and Movement",
						"size": 20
					},
					{
						"name": "Genetics, Reprod., Embryology",
						"size": 20
					},
					{
						"name": "Reviewing Biomed. Publications",
						"size": 10
					}
				]
			},
			{
				"name": "Year 2",
				"children": [{
						"name": "Threats and Defense Mechanisms",
						"size": 18
					},
					{
						"name": "Development, Ageing, Disease",
						"size": 18
					},
					{
						"name": "Techniques in Biomed. Research",
						"size": 10
					},
					{
						"name": "Human Intermediary Metabolism",
						"size": 18
					},
					{
						"name": "Biorhythms in Homeostasis",
						"size": 18
					},
					{
						"name": "Sensorymotorics, Neuroplasticity",
						"size": 18
					}
				]
			},
			{
				"name": "Year 3",
				"children": [{
						"name": "Minor",
						"size": 50
					},
					{
						"name": "The core of Biomedical Sciences",
						"size": 15
					},
					{
						"name": "Internship+Thesis",
						"size": 35
					}
				]

			}
		]

};
const width = 900;
const radius = width/2;
const partition = data => d3.partition()
    .size([2 * Math.PI, radius])
  (d3.hierarchy(data)
    .sum(d => d.size)
    .sort((a, b) => b.value - a.value));
const color = d3.scaleOrdinal().range(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
const format = d3.format(",d");
const arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius / 2)
    .innerRadius(d => d.y0)
    .outerRadius(d => d.y1 - 1);
const root = partition(data);
root.each(d => d.current = d);

const aHistory = [];

let oLastZoomed = root;






const svg = d3.select("body")
            .append("svg")
	.attr("width", width)
	.attr("height", width)
	.attr("viewBox", `0,0,${width},${width}`)
	.style("width", "100%")
	.style("height", "auto")
	.style("padding", "10px")
	.style("font", "10px sans-serif")
	.style("box-sizing", "border-box");




const g = svg.append("g")
    .attr("transform", `translate(${width/2 },${width/2 } )`);
let paths = g.append("g")
      .attr("fill-opacity", 0.6)
    .selectAll("path")
    .data(root.descendants())
    .enter().append("path")
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return !d.depth ? 'none' : color(d.data.name); })
      .attr("stroke", "black")
      .attr("border", 1)
      .attr("fill-opacity", d => d.children ? 0.2 : 0.1)
      .attr("d", arc)
      .attr("id", function(d,i){
        return 'cp-' + i;
      });
  /*d => { while (d.depth > 1) d = d.parent; return !d.depth ? 'none' : color(d.data.name); }*/
  paths.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`)

  paths.style('cursor', 'pointer')
    .on("click", clicked);

     const labels = g.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants().filter(d => d.depth))
    .enter().append("text")
      .attr("transform", d => labelTransform(d))
      .attr("fill-opacity", d => +labelVisible(d) )
      .attr("dy", "0.35em")
      .attr("clip-path", function(d, i){
        return 'url(#cp-'+ i + ')';
      })
		 .style("font-size", d => {if(d.depth===1){return "32px"}})
      .text(d => d.data.name);

  function labelVisible(d) {
    //console.log(+(d.x1 - d.x0 > 0),+((d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
    return (d.x1 - d.x0 > 0) && ((d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10);
  }

  function labelTransform(d) {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2 ;
    //console.log(x,y)
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }


  function clicked(p) {

    if(p.data.name == "Threats and Defense Mechanisms" ){
     let kursname = p.data.name.replace(/\s/g, '_');
     window.open("/"+kursname)
     return;
    }

    /**
     * First time, mark the clicked node as zoomed;
     * Second time, un-mark the node as zoomed.
     * When an already zoomed node is clicked, lets zoom out to its parent or root.
     */
    let target;

    // determine actual node to highlight
    // root will have no parent
    if (p.depth > 1) {
      target = p.bZoomed ? p : (p.children ? p : p.parent);
    }else{
      target = p;
    }

    if(target.bZoomed){
      delete target.bZoomed;
      target = oLastZoomed = aHistory.pop();

      if (!aHistory.length) {
        root.bHighlighted = true;
        target = oLastZoomed = root;
      }
    }else{
      target.bZoomed = true;
      if (oLastZoomed) {
        aHistory.push(oLastZoomed);
      }
      oLastZoomed = target;
    }
        /* x0 und x1 werden neu skaliert, abhängig von der Größe vom parent node: z.B. d.x1-target.x1 ist die differenz der x1 werte, das ergebnis wird auf die neue größe vom parent (target.x1 - target.x0) normiert.
        wieviel vom neuen Kreisabschnitt des parents wird von dem node eingenommen? Anschließend wird das Ergebnis mit 2 pi multipliziert, da dieser Faktor bei der Normierung verloren gegangen ist. */
    root.each(function(d){
      //console.log(d.data.name,d.x0,d.x1,target.data.name,target.x0,target.x1)
      d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - target.x0) / (target.x1 - target.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - target.x0) / (target.x1 - target.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - target.y0),
        y1: Math.max(0, d.y1 - target.y0)
      };
      //console.log(d.target.x0,d.target.x1)
    });
    const t = g.transition().duration(750);

    // Transition the data on all arcs, even the ones that aren’t visible,
    // so that if this transition is interrupted, entering arcs will start
    // the next transition from the desired position.
    paths.transition(t)
        .tween("data", d => {
          const i = d3.interpolate(d.current, d.target);
          return t => d.current = i(t);
        })
        .attrTween("d", d => () => arc(d.current));

    labels.transition(t)
        .attr("fill-opacity", d => +labelVisible(d.target) )
        .attrTween("transform", d => () => labelTransform(d.current));

  }