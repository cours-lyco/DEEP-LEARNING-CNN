$(
  function(){

    //.........................................................................//
    //        CONVOLUTION
    //..........................................................................//
    $("#convolution").click (function(evt){
        evt.preventDefault()
        $(".convolution_image_container img").remove()

        for (let j=0; j<global_uploaded_image_data.length; j++){

        var img_width = global_uploaded_image_data[j]['current_img_width']
        var img_height = global_uploaded_image_data[j]['current_img_height']

        var num_row = parseInt(img_height/global_tile_width)
        var num_col = parseInt(img_width/global_tile_width)

        rect = d3.select("#d3-rect-obj-index_"+ j)["_groups"][0][0]
        rect_id = rect.getAttribute("id")
        rect_width = rect.getAttribute("width")
        rect_height = rect.getAttribute("height")

        image = d3.select("#upload-img-def-id_"+ j)["_groups"][0][0]
        image_width = image.getAttribute("width") //302
        image_height = image.getAttribute("height") //300
        image_x = image.getAttribute("x") //300
        image_y = image.getAttribute("y") //300

        x_top_left = x0 + parseInt((rect_width - global_uploaded_image_data[j]['current_img_width'])/2)

        y_top_left  = y0 + global_tile_width + j * uploaded_img_rect_height + parseInt((rect_height - global_uploaded_image_data[j]['current_img_height'])/2)


        //var x_top_left = global_image_xtop_left
        //var y_top_left = global_image_ytop_left

        var xx_top_left = x_top_left
        var yy_top_left = y_top_left

        var row = 0;
        var col = 0;

        //......................//
        function processData(global_user_input_kernel,  callback){

        var inte = setInterval(() => {
            x_top_left = xx_top_left + col * global_tile_width
            y_top_left = yy_top_left + row * global_tile_width

            if(global_kernel_shape){global_kernel_shape.remove()}
            //console.log("row: "+row +" ,col: "+col);
            draw_kernel(global_user_input_kernel , x_top_left, y_top_left)
            col += 1;

            if(col > num_col - global_user_input_kernel[0].length){ row = row + 1; col = 0; x_top_left = xx_top_left; y_top_left=yy_top_left + row*global_tile_width }
            if(row > num_row-global_user_input_kernel[0].length  ){

              if(typeof callback == "function"){
                callback()
              }
              clearInterval(inte);

            }
        }, 120)}

        //..............//
        processData(global_user_input_kernel, xx_top_left, yy_top_left, col, row,  () => {

            /*var conv_margin_top = parseInt( 1.7*global_image_file_height + 20)
            $(".convolution_image_container").css({
              'position' : 'absolute' ,
              'top': conv_margin_top,
              'left': '6%'
            })

            $(".convolution_image_container").append( $('<div  width:79%;"><p style="position:absolute; z-index:15;top:-25%;left:-4%;"><img id="image-upload" static src= "/' + global_kernel_file +'" style="display:inline-block; border:1px solid blue; position:absolute; top:' + conv_margin_top  + 'left:' + global_image_xtop_left +'" alt="image-ici"></div>'))

            //Draw array
            const grey_scale_dimensions = [   global_kernel_array.length,   global_kernel_array[0].length,   global_kernel_array[0][0].length ]; //[276, 182, 2]


          var d = global_kernel_array;
          var offset_x = parseInt(1.25*global_image_file_width)
          var pixel_array = '<ul class="pixel-array-displayed" style="position:absolute; left:'+ offset_x +'px; padding:">'
          for (let i=0; i< grey_scale_dimensions[0]; i += global_tile_width){
            pixel_array += '<li style="list-style-type:none;">'
            for (let j = 0; j< grey_scale_dimensions[1]; j += global_tile_width){

                var pixel_id = "rgb_" + i + '_' + j
                pixel_array += '<span class="rgb_class-conv" id="' + pixel_id +'">'
                colors = ['red', 'green', 'blue']
              if(typeof grey_scale_dimensions[2] !== 'undefined'){
                for (let k=0; k< grey_scale_dimensions[2]; k++ ){
                  var dd = d[i][j][k];
                  if(dd < 100 ){ dd = "&nbsp;&nbsp;" + dd}

                  if(k == 0){
                  pixel_array += '<span class="rgb_red_class" style="color:red; list-style-type:none;">['+ dd  +',</span>'
                  }
                  if(k == 1){
                  pixel_array += '<span class="rgb_green_class" style="color:green; list-style-type:none;">'+ dd  +', </span>'
                  }
                  if(k == 2){
                  pixel_array += '<span class="rgb_blue_class" style="color:blue; list-style-type:none;">'+ dd +']</span>'
                  }
                }
            }//undefined
            else {
              var dd = d[i][j];
              if(dd < 100 ){ dd = "&nbsp;&nbsp;" + dd}
              pixel_array += '<span class="rgb_red_class" style="color:rgb(120, 121, 128); list-style-type:none;">'+ dd  +',</span>'
            }//else
                pixel_array += '</span>'

            }//j
            pixel_array += '</li>'
          }
          pixel_array += '</ul>'
          //$('.image-channels').text(JSON.stringify(JSON.stringify(global_images_array)))
          $('.grey-scale-array').html(pixel_array)
          $(".rgb_class-conv").css("font-size", '1.2em'); */
            //------------- END -------------------//
        })


        $.ajax({
          url: "/cnn-convolution-kernel",
          data: { "kernel_array": global_user_input_kernel },
          type: 'post',
          success: function (data) {
              data = JSON.parse(data)

              global_kernel_file = data[0]
              global_kernel_array = JSON.parse(data[1])
          },
          errr: function(err) {  console.error(err)  }
      })//$.ajax
      }//for loop m=0

    })//$ on click  */




    //.........................................................................
    //                          UTILS
    //........................................................................
    function draw_kernel(  global_user_input_kernel,  x_top_left, y_top_left,  img_width, img_height){

      kernel_data =   global_user_input_kernel

      var data_obj = [
        [ {x:x_top_left, y: y_top_left, t:kernel_data[0][0]}, {x:x_top_left + global_tile_width, y: y_top_left, t:kernel_data[0][1]}, {x:x_top_left + 2*global_tile_width, y: y_top_left, t:kernel_data[0][2]}],

        [{x:x_top_left, y: y_top_left + global_tile_width, t:kernel_data[1][0]}, {x:x_top_left + global_tile_width, y: y_top_left + global_tile_width, t:kernel_data[1][1]}, {x:x_top_left + 2*global_tile_width, y: y_top_left + global_tile_width, t:kernel_data[1][2]}],

        [{x:x_top_left, y: y_top_left + 2*global_tile_width, t:kernel_data[2][0]}, {x:x_top_left + global_tile_width, y: y_top_left + 2*global_tile_width, t:kernel_data[2][1]}, {x:x_top_left + 2*global_tile_width, y: y_top_left + 2*global_tile_width, t:kernel_data[2][2]}]
      ]

      var num_row = parseInt(img_height/global_tile_width)
      var num_col = parseInt(img_width/global_tile_width)

      if(d3.selectAll(".kernel_rects")){d3.selectAll(".kernel_rects").remove()}
      if(d3.selectAll(".kernel_texts")){d3.selectAll(".kernel_texts").remove()}

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
      }//for loop r=0


    } //DRAW KERNEL






    //END JQUERY
})
