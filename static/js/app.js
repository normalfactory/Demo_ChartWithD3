/* Demonstration to showcase how to have a d3 bar chart display in page.
The SVG that the chart is located within is redrawn when the browser window
is resized.
*/

console.log("--> app.js");



//- Constants
const CHARTDIVNAME = "#barchart";   // name of div that contains bar chart

const CHARTMARGINS = {
    top: 10,
    right: 10,
    bottom: 40,
    left: 60
}


//- Global
var _svgWidth = 0;  //width that was used to generate the SVG



function getChartDivWidth(){
    /* Returns the width, in pixels, of the div that contains the SVG of the chart. This div
    that is column within a Bootstrap grid, resizes bases on the size of the browser.

    Accepts : nothing

    Returns : (int) current width of the div; in pixels
    */

    return parseInt(d3.select("body").select(CHARTDIVNAME).style('width').slice(0, -2));
}


function getSvgHeight(){
    /* Returns the height of the svg container; it is always calculated to be 50% of window height

    Accepts : nothing

    Returns : (number) height of the container in px
    */

    return (window.innerHeight * 0.5);
}


function createChart(sourceData){
    /* Creates the chart within the SVG.

    Accepts : sourceData (array) data used to populate the bar chart
                name: (string) List of the names of the strings
                count: (int) List of the count of records in the bin
            
    Returns : undefined
    */

    console.log("--> createChart");


    //- Remove Existing Chart
    //  SVG chart is redrawn when the browser is resized
    let svgArea = d3.select(CHARTDIVNAME).select("svg");

    if (!svgArea.empty()){
        svgArea.remove();
    }


    //- Determine SVG Size
    let svgHeight = getSvgHeight();
    _svgWidth = getChartDivWidth();


    //- Create SVG Container
    let svgContainer = d3.select(CHARTDIVNAME).append("svg")
                            .attr("height", svgHeight)
                            .attr("width", _svgWidth);


    //- Shift Chart based on margins
    let svgChartGroup = svgContainer.append("g")
                            .attr("transform", `translate(${CHARTMARGINS.left}, ${CHARTMARGINS.top})`);


    //- Get Chart Area; exclude margins
    let chartHeight = (svgHeight - CHARTMARGINS.top - CHARTMARGINS.bottom);
    let chartWidth = (_svgWidth - CHARTMARGINS.left - CHARTMARGINS.right);



    //- Prepare X: Bin Name
    let xScale = d3.scaleBand()
                    .range([0, chartWidth])
                    .domain(sourceData.map(d => d.name))
                    .padding(0.1);

    let xAxis = d3.axisBottom(xScale);



    //- Prepare Y: Count
    let maxYValue = d3.max(sourceData, d => d.count);

    let yScale = d3.scaleLinear()
                    .range([chartHeight, 0])
                    .domain([0, maxYValue]);
    
    let yAxis = d3.axisLeft(yScale);

    
    //- Create Chart
    svgChartGroup.selectAll("bar")
            .data(sourceData)
            .enter()
            .append("rect")
            .attr("class", "chartBar")
            .attr("x", d => xScale(d.name))
            .attr("y", d => yScale(d.count))
            .attr("height", d => chartHeight - yScale(d.count))
            .attr("width", xScale.bandwidth() );


    //- Create X Axis
    svgChartGroup.append('g')
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale));

    let xLabel = svgChartGroup.append("g");

    xLabel.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${svgHeight + CHARTMARGINS.top - 20})`)
        .attr("class", "chartAxisText")
        .text("Bin ID");


    //- Create Y Axis
    svgChartGroup.append("g")
        .call(d3.axisLeft(yScale));
    
    let yLabel = svgChartGroup.append("g");

    yLabel.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -30)
            .attr("x", 0 - (svgHeight / 2))
            .attr("class", "chartAxisText")
            .text("Count in Bin");
}


function createMockData(){
    /* Creates the mock data to be used with the chart; this data could be from RESTFul endpoint or passed 
    to the control

    Accepts : nothing

    Returns : (list)
                name: (string) name of the bin
                count: (int) number of records found within the bin
    */

    console.log("--> createMockData");


    let sourceData = [
        { name: "Bin_0", count: 20},
        { name: "Bin_1", count: 15},
        { name: "Bin_2", count: 56},
        { name: "Bin_3", count: 40}
    ];

    console.log(sourceData);

    return sourceData;
}


function makeChartResponsive(){
    /* Called when the window is resized; when it is found that the size of the SVG has changed
    the chart is redrawn
    
    Accepts : nothing

    Returns : undefined
    */

    console.log("--> makeChartResponsive");


    //- Get Current Width
    let currentWidth = getChartDivWidth(CHARTDIVNAME);

    if (currentWidth == _svgWidth){
        console.log("No change in width");
        return;
    }
    else{
        console.log(`Change in width, current: ${currentWidth}  existing: ${_svgWidth}`);

        //- Create Mock Data
        let sourceData = createMockData();

        //- Create Chart
        createChart(sourceData);
    }

}


//- Prepare Responsive Layout
//  Listen for the resize event and call the function to re-draw the chart
d3.select(window).on("resize", makeChartResponsive);


//- Create Mock Data
let sourceData = createMockData();

//- Create Chart
createChart(sourceData);