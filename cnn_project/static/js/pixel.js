$(
  function(){
    x0_pixel = 650
    y0_pixel = 70

    $('#cnn-image-grid').click(function(e){
          e.preventDefault()

          var width = global_image_file_width;// $('#image-upload').width()
          var height = global_image_file_height; //$('#image-upload').height()

          //var global_tile_width = 25
          var pixel_group = d3.select(".svg-general-class")
                          .append("rect")
                          .attr("class", "grid-group")
                          .attr("x", x0_pixel)
                          .attr("y", y0_pixel)
                          .attr("width", 500)
                          .attr("height",  500)
                          .style("fill", "#fff")
                          //.style("fill", "url(#upload-img-def-id-00a_" + img_index + ")")
                          .attr('stroke', '#2378ae')
                          .attr('stroke-dasharray', '10,5')
                          .attr('stroke-linecap', 'butt')
                          .attr('stroke-width', '3')
                      //.attr("transform", "translate(" + 0 + "," + offsety + ")")
          for(let v=0; v<global_uploaded_image_data.length; v++){
           //var xtop = d3.select("#upload-img-def-id_" + v).attr("x")
           //var ytop = d3.select("#upload-img-def-id_" + v).attr("y")

           var xtop = d3.select("#d3-rect-obj-index_" + v).attr("x")
           var ytop = d3.select("#d3-rect-obj-index_" + v).attr("y")

           console.log("ytop: ", ytop)
           console.log("xtop: ", xtop)

           console.log("width: ", width)
           console.log("width: ", height)
           return false;



           }//for loop
    })//click


})//$//jquery
