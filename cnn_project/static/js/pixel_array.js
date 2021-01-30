
function draw_rgb_array(arr){
  var width = window.innerWidth;
  var height = window.innerHeight;

  var global_tile_width = 45

var top_left = document.getElementById("uploaded-images-console").getBoundingClientRect();

//$("#uploaded-images-console svg").css({top: top_left.top, left: 0, position:'absolute'});


    var data = []
    for(let i=0; i<arr.length;i+= global_tile_width){
      var d = []
      for(let j=0; j<arr[i].length;j+= global_tile_width){

        for(let k=0; k<arr[i][j].length;k++){
          color = 'red'

          if(k==1){color='green';}
          if(k==2){color='blue';}
          if(k==3){color='purple'; } //transparency

            d.push({
                color: color,
                t : arr[i][j][k],
                x:  i*global_tile_width,
                y:  j*global_tile_width ,
                width: global_tile_width,
                height: global_tile_width
            })
        }//k loop
      }//j loop
      data.push(d)
    }//i loop

    var rows = data.length;
    var cols = data[0].length;
    //var cols_cols = arr[0][0].length;
console.log("//////:  lenx: " + data.length + "leny: "+ data[0].length)
    //adjust container
    $("#upload-image-container").css({
      //"width":cols*cols_cols*global_tile_width + "px",
      "border":"1px solid orange"
    })

    var offsetx = parseInt(d3.select(".all-rect").attr("width")) + 35
    var offsety = parseInt(0.65 * d3.select(".all-rect").attr("height"))

    $("#uploaded-images-console").css({
      "position": "absolute",
      "width":cols*global_tile_width + "px",
      "height": rows*global_tile_width + "px",
      "left":  offsetx + "px",
      "top": offsety + "px",
      "padding": 0,
      "border": "2px solid white"
    })

    var rgb_grid = d3.select("#uploaded-images-console")
      .append("svg")
      .attr("width", cols *  global_tile_width )
      .attr("height", rows * global_tile_width );

    $("#uploaded-images-console svg").css({
      "position": "absolute",
      "left": 5  + "px",
      "top": 5 + "px",
      "border": "3px solid yellow"
    })


    var display_rgb = rgb_grid.append("g")

    var row = display_rgb.selectAll(".row")
        .data(data)
        .enter().append("svg:g")
        .attr("class", "row");

    var col = row.selectAll(".cell")
        .data(function (d) {
        return d ;
    })
        .enter().append("svg:rect")
        .attr("class", "cell")
        .attr("x", function (d) {
        return d.x;
    })
        .attr("y", function (d) {
        return d.y;
    })
        .attr("width", function (d) {
        return d.width;
    })
        .attr("height", function (d) {
        return d.height;
    })
    .attr("stroke", "white")


    var text = row.selectAll(".label")
        .data(function (d) {
        return d;
    })
        .enter().append("svg:text")
        .transition()
        .duration(2500)
        .delay(500)
        .attr("x", function (d) { console.log("--->: ", d)
        return d.x + d.width / 2;
    })
        .attr("y", function (d) {
        return d.y + d.height / 2;
    })
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .text(function (d) {
        return "a";
    });




    console.log("rows: " +  rows + " cols: "+ cols)
}


function draw_red_channel_array(){

}

function draw_green_channel_array(){

}


function draw_blue_channel_array(){

}


function draw_grey_channel_array(){

}
