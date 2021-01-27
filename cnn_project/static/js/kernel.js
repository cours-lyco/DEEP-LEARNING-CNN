$(
  function(){
    x0 = 50 //to globalize
    y0 = 50 //to globalize

    //KERNEL
    var kernel_array = [
        [-1,  7,  5],
         [0, -2, -3],
         [8,  7, -4]
     ]

     var kernel_identity = [
         [0,   0,  0],
         [0,   1,  0],
         [0,   0,  0]
      ]

      var kernel_edge_detection0 = [
        [-1, -2, -1],
        [0,  0,  0],
        [1,  2,  1]
      ]

      var kernel_edge_detection1 = [
          [1,   0,  -1],
          [0,   1,   0],
          [-1,  0,   1]
       ]

       var kernel_edge_detection2 = [
           [0,   1,   0],
           [1,   -4,   1],
           [0,    1,   0]
        ]

        var kernel_edge_detection3 = [
            [-1,   -1,   -1],
            [-1,   8,   -1],
            [-1,   -1,   -1]
         ]

        var kernel_sharpen = [
            [0,   -1,   0],
            [-1,   5,   -1],
            [0,    -1,   0]
         ]

      var kernel_box_blur = [
                  [1/9, 1/9, 1/9],
                  [1/9, 1/9, 1/9],
                  [1/9, 1/9, 1/9] ]

     var kernel_gaussian_blur = [
              [1/16, 2/16, 1/16],
              [2/16, 4/16, 2/16],
              [1/16, 1/16, 1/16] ]



    $("#build_kernel").click(function( e ){

        e.preventDefault()
        if (typeof global_uploaded_image_data === "undefined" || !global_uploaded_image_data.length){
          console.error("Please, upload image before")
        }else {

        //.....................................................................
        //  DISPLAY FILTER POP - UP
        //......................................................................

          if(  $("#myfilter-Form").css("display") == 'block'  ){
               $("#myForm").css("display", "none")
          } else {  $("#myfilter-Form").css("display", "block")  }
        }//if global_uploaded_image_data  legth > 0

    })//$("#build_kernel").click(function( e ){

    //..........................................................................
    //
    //..........................................................................
    $("form").on('click', function(e){
          e.preventDefault()
          if(e.target.name == 'submit-filter')
          {
                var inputVal = $("input[type='text']").val()
                var a = inputVal.split(",").map(Number);

                global_user_input_kernel = [
                  [a[0], a[1], a[2]],
                  [a[3], a[4], a[5]],
                  [a[6], a[7], a[8]]
                ]

                if(global_kernel_shape_show){
                    for(let j=0; j<global_uploaded_image_data.length;j++){

                            rect = d3.select("#d3-rect-obj-index_"+ j)["_groups"][0][0]
                            rect_id = rect.getAttribute("id")
                            rect_width = rect.getAttribute("width")
                            rect_height = rect.getAttribute("height")

                            image = d3.select("#upload-img-def-id_"+ j)["_groups"][0][0]
                            image_width = image.getAttribute("width") //302
                            image_height = image.getAttribute("height") //300
                            image_x = image.getAttribute("x") //300
                            image_y = image.getAttribute("y") //300

                            xtop_rect = x0 + parseInt((rect_width - global_uploaded_image_data[j]['current_img_width'])/2)

                            ytop_rect  = y0 + global_tile_width + j * uploaded_img_rect_height + parseInt((rect_height - global_uploaded_image_data[j]['current_img_height'])/2)


                            draw_kernel(  xtop_rect ,   ytop_rect , global_uploaded_image_data[j]['current_img_width'], global_uploaded_image_data[j]['current_img_height'], global_user_input_kernel )
                    }//for loop j

                    global_kernel_shape_show = false
                 } else {
                   draw_kernel(  xtop_rect ,   ytop_rect ,kernel_array)
                      global_kernel_shape.remove()
                      global_kernel_shape_show = true;
                  }

          }
          if(  e.target.name == 'reset-filter') {
             $(this).remove()
             //$(this).hide()
          }
    })

    //..........................................................................
    //   CLOSE FILTER POP UP
    //......................................................................
    $(".form-container input[name='reset-filter']").on('click', function(e){
          e.preventDefault()
          $("#myForm").css("display", "none")
    })

    //......................................................................
    //  UTILS
    //......................................................................
    function draw_kernel(x_top_left, y_top_left,  img_width, img_height, kernel_data){

      var data_obj = [
        [ {x:x_top_left, y: y_top_left, t:kernel_data[0][0]}, {x:x_top_left + global_tile_width, y: y_top_left, t:kernel_data[0][1]}, {x:x_top_left + 2*global_tile_width, y: y_top_left, t:kernel_data[0][2]}],

        [{x:x_top_left, y: y_top_left + global_tile_width, t:kernel_data[1][0]}, {x:x_top_left + global_tile_width, y: y_top_left + global_tile_width, t:kernel_data[1][1]}, {x:x_top_left + 2*global_tile_width, y: y_top_left + global_tile_width, t:kernel_data[1][2]}],

        [{x:x_top_left, y: y_top_left + 2*global_tile_width, t:kernel_data[2][0]}, {x:x_top_left + global_tile_width, y: y_top_left + 2*global_tile_width, t:kernel_data[2][1]}, {x:x_top_left + 2*global_tile_width, y: y_top_left + 2*global_tile_width, t:kernel_data[2][2]}]
      ]

      var num_row = parseInt(img_height/global_tile_width)
      var num_col = parseInt(img_width/global_tile_width)
console.log("num_row: ", num_row)
console.log("num_col: ", num_col)
      /*global_kernel_shape = d3.select('.upload-image-container')
              .append("svg")
              .attr("width", global_tile_width * num_col)
              .attr("height", global_tile_width * num_row)
              .selectAll("g")
              .data(data_obj)
              .enter()
              .append("g")
              .attr("class", "kernel")

      var rects = global_kernel_shape.selectAll('rect')
      .data( function(d,i,j) { return d; } ) //lines
      .enter()
      .append("rect")
      .attr("x", function(d,i, j){ return d.x;})
      .attr("y", function(d,i, j){return d.y;})
      .attr("width", global_tile_width)
      .attr("height", global_tile_width)
      .attr("fill", "rgba(128, 128, 128, 0.4)")
      .attr("class", "kernel_rects")
      .style("stroke", "rgb(6,120,155)")
      .style("stroke-width", 4)*/

      for(let r=0; r<data_obj.length; r++){
        for(let s=0; s<data_obj[r].length; s++){
            svg.append("rect")
            .attr("x", data_obj[r][s]["x"])
            .attr("y", data_obj[r][s]["y"])
            .attr("width", global_tile_width)
            .attr("height", global_tile_width)
            .attr("fill", "rgba(128, 128, 128, 0.4)")
            .attr("class", "kernel_rects")
            .style("stroke", "rgb(6,120,155)")
            .style("stroke-width", 4)
        }
      }

      for(let r=0; r<data_obj.length; r++){
        for(let s=0; s<data_obj[r].length; s++){
            svg.append("text")
            .attr("x", data_obj[r][s]["x"] + 0.45*global_tile_width)
            .attr("y", data_obj[r][s]["y"] + 0.45*global_tile_width)
            .attr("fill", "black")
            .attr("class", "kernel_texts")
            .text(function() {
               if (data_obj[r][s]["t"] % 1 === 0){ return data_obj[r][s]["t"]}
               return (data_obj[r][s]["t"]).toFixed(2);
           })
        }
      }
      //vertical lines
    /*  for(let x=xtop_rect; x<xtop_rect + global_uploaded_image_data[img_index]['current_img_width']; x=x+global_tile_width){
        svg.append("line")
        .attr("x1", x )
        .attr("y1", ytop_rect)
        .attr("x2", x)
        .attr("y2", ytop_rect + global_uploaded_image_data[img_index]['current_img_height'])
        .style('stroke-width', '3')
        .attr('fill', "red")
        .attr('stroke', "black")
        .attr("class", "pixel-horizontal-lines")
        .attr("id", "pixel-vertical-lines_" + img_index)
        .attr("class", "current-rect-pixel_"+img_index)
      }

      //horizontal lines
      for(let y=ytop_rect; y<ytop_rect + global_uploaded_image_data[img_index]['current_img_height']; y=y+global_tile_width){
        svg.append("line")
        .attr("x1", xtop_rect )
        .attr("y1", y)
        .attr("x2", xtop_rect + global_uploaded_image_data[img_index]['current_img_width'])
        .attr("y2", y)
        .style('stroke-width', '3')
        .attr('fill', "red")
        .attr('stroke', "black")
        .attr("class", "pixel-horizontal-lines")
        .attr("id", "pixel-horizontal-lines_" + img_index)
        .attr("class", "current-rect-pixel_"+img_index)
      } */



      /*var texts = global_kernel_shape.selectAll('text')
       .data( function(d,i,j) { return d; } )
       .enter()
       .append("text")
       .attr('x', function(d, i, j) { return d.x + 0.45*global_tile_width; })
       .attr('y', function(d, i, j) { return d.y + 0.55*global_tile_width; })
       .attr('fill', function(d, i, j ) { return "black"; })
       .attr("class", "kernel_texts")
       .text(function(d,i,j) {
          if (d.t % 1 === 0){ return d.t}
          return (d.t).toFixed(2);
      }) */

    } //DRAW KERNEL

    //END JQUERY
})
