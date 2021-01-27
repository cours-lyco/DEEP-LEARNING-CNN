$(
  function(){
    //.........................................................................
    //                  UPLOAD FILE
    //.........................................................................
    window.global_toogle_red_channel = false
    window.global_toogle_green_channel = false
    window.global_toogle_blue_channel = false
    window.global_toogle_grey_channel = false
    window.global_toogle_original_channel = false
    window.global_shifht_nodes = false
    window.global_current_index = 0
    window.svg = null;

    uploaded_img_rect_width = 400
    uploaded_img_rect_height = 400
    icon_inter_space = 35
    pixel_width = 30


    x0 = 50
    y0 = 50

    icon_x0 = 120
    icon_y0 = 60

    d3.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };


    svg = d3.select("body").append("svg")
              .attr("width", 1000)
              .attr("height", 4000)
              .attr("class", "svg-general-class")


    $(".upload-image-container").css('z-index', 300)
    $("#fileuploader").uploadFile({

        url: "/upload-cnn-files", // Server URL which handles File uploads
        method: "POST", // Upload Form method type POST or GET.
        enctype: "multipart/form-data", // Upload Form enctype.
        formData: null, // An object that should be send with file upload. data: { key1: 'value1', key2: 'value2' }
        returnType: null,
        allowedTypes: "*", // List of comma separated file extensions: Default is "*". Example: "jpg,png,gif"
        fileName: "file", // Name of the file input field. Default is file
        formData: {},
        dynamicFormData: function () { // To provide form data dynamically
            return {};
       },

       maxFileSize: 2097152, //-1, // Allowed Maximum file Size in bytes.
       maxFileCount: 20, // Allowed Maximum number of files to be uploaded
       multiple: true, // If it is set to true, multiple file selection is allowed.
       dragDrop: true, // Drag drop is enabled if it is set to true
       autoSubmit: true, // If it is set to true, files are uploaded automatically. Otherwise you need to call .startUpload function. Default istrue
       showCancel: true,
       showAbort: true,
       showDone: true,
       showDelete: true,
       showError: true,
       showStatusAfterSuccess: true,
       showStatusAfterError: true,
       showFileCounter: true,
       fileCounterStyle: "). ",
       showProgress: false,
       nestedForms: true,
       showDownload:false,

       onLoad:function(obj){},

       onSelect: function (files) {
         return true;
       },

       onSubmit: function (files, xhr) {},

       onSuccess: function (files, response, xhr,pd) {
         var rdata = JSON.parse(response)
         //console.log("server response upload: ", rdata);

         var obj = {
             "red_channel": rdata[0],
             "green_channel" : rdata[1],
             "blue_channel": rdata[2],
             "img_file_path": JSON.parse(rdata[3]),
             "image_array": JSON.parse(rdata[4]),
             "grey_channel": rdata[5],
             "grey_scale_array": JSON.parse(rdata[6]),
             "img_width": rdata[7],
             "img_height": rdata[8],
             "img_shape": JSON.parse(rdata[9]),
             "current_img_width" : rdata[7],
             "current_img_height" : rdata[8],
             "draw_grid": true
         }

          global_uploaded_image_data.push(obj);



          var defs = svg.append('svg:defs');
          obj_index = global_uploaded_image_data.indexOf(obj); //
          var offsety = obj_index * uploaded_img_rect_height + 30

          var group1 = svg.append("g")
                      .attr("class", "group1")
                      .attr("transform", "translate(" + 0 + "," + offsety + ")")

          var group2 = svg.append("g")
                      .attr("class", "group2")
                      .attr("transform", "translate(" + 0 + "," + (-offsety + 30) + ")")

          var group3 = svg.append("g")
                      .attr("class", "group3")
                    //  .attr("transform", "translate(" + 0 + "," + offsety + ")")



          //Center uploaded image
          if(obj['current_img_width'] > uploaded_img_rect_width){
            obj['current_img_width'] = uploaded_img_rect_width
          }
          if(obj['current_img_height'] > uploaded_img_rect_height){
            obj['current_img_height'] = uploaded_img_rect_height
          }

          var def = defs.append("svg:pattern")
          .attr("id", "upload-img-def-id_" + obj_index)
          .attr("class", "upload-img-def-class_" + obj_index)
          .attr("width", uploaded_img_rect_width)
          .attr("height", uploaded_img_rect_height)
          .attr("patternUnits", "userSpaceOnUse")
          .append("svg:image")
          .attr("xlink:href", "/media/" + obj['img_file_path'])
          .attr("width", obj['current_img_width'])
          .attr("height", obj['current_img_height'])
          .attr("x", 50 + parseInt(uploaded_img_rect_width - obj['current_img_width'])/2)
          .attr("y", 50 + parseInt(uploaded_img_rect_height - obj['current_img_height'])/2);



          var rect = group1.append('rect')
          .attr("x", x0)
          .attr("y", y0)
          .attr("width", uploaded_img_rect_width)
          .attr("height", uploaded_img_rect_height)
          .attr("id", "d3-rect-obj-index_"+ obj_index)
          .attr("class", "all-rect")
          .style("fill", "#000")
          .style("fill", "url(#upload-img-def-id_" + obj_index + ")")
          .attr('stroke', '#633974')
          .attr('stroke-dasharray', '10,5')
          .attr('stroke-linecap', 'butt')
          .attr('stroke-width', '3')

//......................................................................................
//                        pixelize cercle button
//.....................................................................................
var pixel_circle = group1.append('circle')

var texture = svg.append('defs')
              .append('pattern')
              .attr('id', 'texture')
              .attr('patternUnits', 'userSpaceOnUse')
              .attr('width', 8)
              .attr('height', 8)
              .append('path')
              .attr('d', 'M0 0L8 8ZM8 0L0 8Z')
              .attr('stroke', '#C48AB2')
              .attr('stroke-width', 1);

                pixel_circle
                .attr('cx', icon_x0)
                .attr('cy', icon_y0)
                .attr('r',10)
                .attr('stroke', 'red')
                .attr('fill', 'url(#texture)' )
                .attr('class', 'upload-image-menu_' + obj_index)
                .attr('id', 'upload-img-red-id_' + obj_index)
                .attr('stroke', 'orange')
                .attr('stroke-width', '3')
                .on("mouseover", function(){
                    d3.select(this)
                        .attr("r", 12)
                        .attr("stroke", 'purple')
                        .style("cursor", "pointer");
                })
                .on("mouseout", function(){
                      d3.select(this).attr("r", 10).attr("stroke", 'red')
                })
                .on("click", function(e){
                   d3.event.preventDefault();
                   var p = d3.select(this)
                   var clicked_id = p.attr("id")
                   var img_index = parseInt(clicked_id.split('_')[1])

                   var clicked_img_data = global_uploaded_image_data[img_index];

                    if(!global_uploaded_image_data[img_index]['draw_grid']){
                      rect = d3.select("#d3-rect-obj-index_"+ img_index)["_groups"][0][0]
                      rect_id = rect.getAttribute("id")
                      rect_width = rect.getAttribute("width")
                      rect_height = rect.getAttribute("height")

                      image = d3.select("#upload-img-def-id_"+ img_index)["_groups"][0][0]
                      image_width = image.getAttribute("width") //302
                      image_height = image.getAttribute("height") //300
                      image_x = image.getAttribute("x") //300
                      image_y = image.getAttribute("y") //300

                      xtop_rect = x0 + parseInt((rect_width - global_uploaded_image_data[img_index]['current_img_width'])/2)

                      ytop_rect  = y0 + pixel_width + img_index * uploaded_img_rect_height + parseInt((rect_height - global_uploaded_image_data[img_index]['current_img_height'])/2)
                      //vertical lines
                      for(let x=xtop_rect; x<xtop_rect + global_uploaded_image_data[img_index]['current_img_width']; x=x+pixel_width){
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
                      for(let y=ytop_rect; y<ytop_rect + global_uploaded_image_data[img_index]['current_img_height']; y=y+pixel_width){
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
                      }


                      global_uploaded_image_data[img_index]['draw_grid'] = true
                    }//if global_draw_pixel = true
                    else {
                      d3.selectAll(".current-rect-pixel_"+img_index).remove()
                      global_uploaded_image_data[img_index]['draw_grid'] = false
                    }//if global_draw_pixel = false
                })

//......................................................................................
//                        red channel button
//.....................................................................................
              var red_circle = group1.append('circle')
              .attr('cx', icon_x0 +  icon_inter_space)
              .attr('cy', icon_y0)
              .attr('r',10)
              .attr('stroke', 'red')
              .attr('fill', 'red')
              .attr('class', 'upload-image-menu_' + obj_index)
              .attr('id', 'upload-img-red-id_' + obj_index)
              .on("mouseover", function(){
                  d3.select(this)
                      .attr("r", 12)
                      .attr("stroke", 'purple')
                      .style("cursor", "pointer");
              })
              .on("mouseout", function(){
                    d3.select(this).attr("r", 10).attr("stroke", 'red')
              })
              .on("click", function(e){
                 d3.event.preventDefault();
                 //d3.select(this).raise()
                global_toogle_green_channel = false
                global_toogle_blue_channel = false
                global_toogle_grey_channel = false;

                  if (!global_toogle_red_channel){//if global_toogle_red_channel == false

                     var p = d3.select(this)
                     var clicked_id = p.attr("id")
                     var img_index = parseInt(clicked_id.split('_')[1])

                     var clicked_img_data = global_uploaded_image_data[img_index];
                     //d3.select("upload-img-def-id-00a_" + img_index).remove()

                     //d3.select("upload-img-def-id_" + obj_index).remove()


                    var defs2 =  defs.append("svg:pattern")
                    .attr("id", "upload-img-def-id-00a_" + img_index)
                    .attr("width", uploaded_img_rect_width)
                    .attr("height", uploaded_img_rect_height)
                    .attr("patternUnits", "userSpaceOnUse")
                    .append("svg:image")
                    .attr("xlink:href", "/" + clicked_img_data['red_channel'])
                    .attr("width", global_uploaded_image_data[img_index]['current_img_width'])
                    .attr("height", global_uploaded_image_data[img_index]['current_img_height'])
                    .attr("x", x0 + parseInt(uploaded_img_rect_width - global_uploaded_image_data[img_index]['current_img_width'])/2)
                    .attr("y", icon_y0 + parseInt(uploaded_img_rect_height - global_uploaded_image_data[img_index]['current_img_height'])/2);

                    //var rect2 = d3.select("#d3-rect-obj-index_"+ img_index) ||
                    //d3.select("#d3-rect-obj-index_"+ img_index).remove()
                    var rect2 = d3.select("#d3-rect-obj-index_"+ img_index)
                    //transition for old border to new
                    rect2.transition().duration(2000).attr('stroke', 'red')

                    rect2
                    .attr("x", x0)
                    .attr("y", y0)
                    .attr("width", uploaded_img_rect_width)
                    .attr("height",  uploaded_img_rect_height)
                    .style("fill", "#fff")
                    .style("fill", "url(#upload-img-def-id-00a_" + img_index + ")")
                    .attr('stroke', '#2378ae')
                    .attr('stroke-dasharray', '10,5')
                    .attr('stroke-linecap', 'butt')
                    .attr('stroke-width', '3')

                  global_toogle_original_channel = true
                  global_toogle_red_channel = true; //..........................
                }else { //if global_toogle_red_channel is true, show original image

                  var all_rects = d3.selectAll("rect")["_groups"]

                  var p = d3.select(this)
                  var clicked_id = p.attr("id")
                  var img_index = parseInt(clicked_id.split('_')[1])

                  var clicked_img_data = global_uploaded_image_data[img_index];

                  var drect = all_rects.filter(function(d){
                       var id =  d[0].getAttribute("id")
                        let index = parseInt(id.split("_")[1])
                       return index == img_index
                  })

                  var all_defs = d3.selectAll('defs')["_groups"]
                  var ddef = all_defs.filter(function(d){
                  var id = d[0].firstChild.getAttribute("id")

                  let  index = parseInt( id.split("_")[1])
                       return index == img_index
                  })

                  //d3.select("#d3-rect-obj-index_"+ img_index).lower();
                  //d3.select("#d3-def-obj-index_"+ img_index).lower();
                  //d3.select("upload-img-red-id_" + img_index).lower();

                  var defs3 =  defs.append("svg:pattern")
                    .attr("id", "upload-img-def-id-000a_" + img_index)
                    .attr("width", uploaded_img_rect_width)
                    .attr("height", uploaded_img_rect_height)
                    .attr("patternUnits", "userSpaceOnUse")
                    .append("svg:image")
                    .attr("xlink:href", "/media/" + obj['img_file_path'])
                    .attr("width", global_uploaded_image_data[img_index]['current_img_width'])
                    .attr("height", global_uploaded_image_data[img_index]['current_img_height'])
                    .attr("x", x0 + parseInt(uploaded_img_rect_width - global_uploaded_image_data[img_index]['current_img_width'])/2)
                    .attr("y", icon_y0 + parseInt(uploaded_img_rect_height - global_uploaded_image_data[img_index]['current_img_height'])/2);

                    var rect3 = d3.select("#d3-rect-obj-index_"+ img_index)

                      //transition for old border to new
                    rect3.transition().duration(200).attr('stroke', '#633974')

                    rect3
                    .attr("x", x0)
                    .attr("y", y0)
                    .attr("width", uploaded_img_rect_width)
                    .attr("height",  uploaded_img_rect_height)
                    .style("fill", "#fff")
                    .style("fill", "url(#upload-img-def-id-000a_" + img_index + ")")
                    .attr('stroke', '#2378ae')
                    .attr('stroke-dasharray', '10,5')
                    .attr('stroke-linecap', 'butt')
                    .attr('stroke-width', '3')

                      global_toogle_original_channel = false
                    global_toogle_red_channel = false;
                }//if global_toogle_red_channel is true
              })//on click red channel

//......................................................................................
//                        green channel button
//.....................................................................................
                    var green_circle = group1.append('circle')
                    .attr('cx', icon_x0 +  2*icon_inter_space)
                    .attr('cy', icon_y0)
                    .attr('r',10)
                    .attr('stroke', 'green')
                    .attr('fill', 'green')
                    .attr('class', 'upload-image-menu_' + obj_index)
                    .attr('id', 'upload-img-green-id_' + obj_index)
                    .on("mouseover", function(){
                        d3.select(this)
                            .attr("r", 12)
                            .attr("stroke", 'purple')
                            .style("cursor", "pointer");

                    })
                    .on("mouseout", function(){
                          d3.select(this)
                                  .attr("r", 10)
                                  .attr("stroke", 'green')
                    })
                    .on("click", function(e){
                       d3.event.preventDefault();

                      global_toogle_red_channel = false
                      global_toogle_blue_channel = false
                      global_toogle_grey_channel = false;


                        if (!global_toogle_green_channel){

                           d3.select("#d3-rect-obj-index_"+ img_index).raise();
                           d3.select("upload-img-def-id_" + img_index).raise();

                        //stylize clicked rect
                        var all_rects = d3.selectAll("rect")["_groups"]

                        var p = d3.select(this)
                        var clicked_id = p.attr("id")
                        var img_index = parseInt(clicked_id.split('_')[1])

                        var clicked_img_data = global_uploaded_image_data[img_index];

                        var drect = all_rects.filter(function(d){
                             var id =  d[0].getAttribute("id")
                              let index = parseInt(id.split("_")[1])
                             return index == img_index
                        })

                        var all_defs = d3.selectAll('defs')["_groups"]
                        var ddef = all_defs.filter(function(d){
                        var id = d[0].firstChild.getAttribute("id")

                        let  index = parseInt( id.split("_")[1])
                             return index == img_index
                        })


                        var defs2 =  defs.append("svg:pattern")
                          .attr("id", "upload-img-def-id-00b_" + img_index)
                          .attr("width", uploaded_img_rect_width)
                          .attr("height", uploaded_img_rect_height)
                          .attr("patternUnits", "userSpaceOnUse")
                          .append("svg:image")
                          .attr("xlink:href", "/" + clicked_img_data['green_channel'])
                          .attr("width", global_uploaded_image_data[img_index]['current_img_width'])
                          .attr("height", global_uploaded_image_data[img_index]['current_img_height'])
                          .attr("x", x0 + parseInt(uploaded_img_rect_width - global_uploaded_image_data[img_index]['current_img_width'])/2)
                          .attr("y", icon_y0 + parseInt(uploaded_img_rect_height - global_uploaded_image_data[img_index]['current_img_height'])/2);

                          var rect2 = d3.select("#d3-rect-obj-index_"+ img_index)

                          //transition for old border to new
                          rect2.transition().duration(2000).attr('stroke', 'green')

                          rect2
                          .attr("x", x0)
                          .attr("y", y0)
                          .attr("width", uploaded_img_rect_width)
                          .attr("height",  uploaded_img_rect_height)
                          .style("fill", "#fff")
                          .style("fill", "url(#upload-img-def-id-00b_" + img_index + ")")
                          .attr('stroke', '#2378ae')
                          .attr('stroke-dasharray', '10,5')
                          .attr('stroke-linecap', 'butt')
                          .attr('stroke-width', '3')

                        global_toogle_original_channel = true
                        global_toogle_green_channel = true;
                      }else {

                        var all_rects = d3.selectAll("rect")["_groups"]

                        var p = d3.select(this)
                        var clicked_id = p.attr("id")
                        var img_index = parseInt(clicked_id.split('_')[1])

                        var clicked_img_data = global_uploaded_image_data[img_index];

                        var drect = all_rects.filter(function(d){
                             var id =  d[0].getAttribute("id")
                              let index = parseInt(id.split("_")[1])
                             return index == img_index
                        })

                        var all_defs = d3.selectAll('defs')["_groups"]
                        var ddef = all_defs.filter(function(d){
                        var id = d[0].firstChild.getAttribute("id")

                        let  index = parseInt( id.split("_")[1])
                             return index == img_index
                        })

                        d3.select("#d3-rect-obj-index_"+ img_index).lower();
                        d3.select("#d3-def-obj-index_"+ img_index).lower();
                        //d3.select("upload-img-red-id_" + img_index).lower();

                        var defs3 =  defs.append("svg:pattern")
                          .attr("id", "upload-img-def-id-000b_" + img_index)
                          .attr("width", uploaded_img_rect_width)
                          .attr("height", uploaded_img_rect_height)
                          .attr("patternUnits", "userSpaceOnUse")
                          .append("svg:image")
                          .attr("xlink:href", "/media/" + obj['img_file_path'])
                          .attr("width", global_uploaded_image_data[img_index]['current_img_width'])
                          .attr("height", global_uploaded_image_data[img_index]['current_img_height'])
                          .attr("x", x0 + parseInt(uploaded_img_rect_width - global_uploaded_image_data[img_index]['current_img_width'])/2)
                          .attr("y", icon_y0 + parseInt(uploaded_img_rect_height - global_uploaded_image_data[img_index]['current_img_height'])/2);



                          var rect3 = d3.select("#d3-rect-obj-index_"+ img_index)

                            //transition for old border to new
                          rect3.transition().duration(200).attr('stroke', '#633974')



                          rect3
                          .attr("x", x0)
                          .attr("y", y0)
                          .attr("width", uploaded_img_rect_width)
                          .attr("height",  uploaded_img_rect_height)
                          .style("fill", "#fff")
                          .style("fill", "url(#upload-img-def-id-000b_" + img_index + ")")
                          .attr('stroke', '#2378ae')
                          .attr('stroke-dasharray', '10,5')
                          .attr('stroke-linecap', 'butt')
                          .attr('stroke-width', '3')


                          global_toogle_original_channel = false
                          global_toogle_green_channel = false;
                      }
                    })//on click green channel

//......................................................................................
//                        blue channel button
//.....................................................................................

var blue_circle = group1.append('circle')
                      .attr('cx', icon_x0 + 3 * icon_inter_space)
                      .attr('cy', icon_y0)
                      .attr('r',10)
                      .attr('stroke', 'blue')
                      .attr('fill', 'blue')
                      .attr('class', 'upload-image-menu_' + obj_index)
                      .attr('id', 'upload-img-blue-id_' + obj_index)
                      .on("mouseover", function(){
                          d3.select(this)
                              .attr("r", 12)
                              .attr("stroke", 'purple')
                              .style("cursor", "pointer");

                      })
                      .on("mouseout", function(){
                            d3.select(this)
                                    .attr("r", 10)
                                    .attr("stroke", 'blue')


                      })
                      .on("click", function(){

                         d3.event.preventDefault();
                         d3.select(this).raise()
                        global_toogle_green_channel = false
                        global_toogle_red_channel = false
                        global_toogle_grey_channel = false;


                          if (!global_toogle_blue_channel){

                             d3.select("#d3-rect-obj-index_"+ img_index).raise();
                             d3.select("upload-img-def-id_" + img_index).raise();
                             //d3.select("upload-img-red-id_" + img_index).raise();
                          //stylize clicked rect
                          var all_rects = d3.selectAll("rect")["_groups"]

                          var p = d3.select(this)
                          var clicked_id = p.attr("id")
                          var img_index = parseInt(clicked_id.split('_')[1])

                          var clicked_img_data = global_uploaded_image_data[img_index];

                          var drect = all_rects.filter(function(d){
                               var id =  d[0].getAttribute("id")
                                let index = parseInt(id.split("_")[1])
                               return index == img_index
                          })

                          var all_defs = d3.selectAll('defs')["_groups"]
                          var ddef = all_defs.filter(function(d){
                          var id = d[0].firstChild.getAttribute("id")

                          let  index = parseInt( id.split("_")[1])
                               return index == img_index
                          })



                var defs2 =  defs.append("svg:pattern")
                            .attr("id", "upload-img-def-id-00c_" + img_index)
                            .attr("width", uploaded_img_rect_width)
                            .attr("height", uploaded_img_rect_height)
                            .attr("patternUnits", "userSpaceOnUse")
                            .append("svg:image")
                            .attr("xlink:href", "/" + clicked_img_data['blue_channel'])
                            .attr("width", global_uploaded_image_data[img_index]['current_img_width'])
                            .attr("height", global_uploaded_image_data[img_index]['current_img_height'])
                            .attr("x", x0 + parseInt(uploaded_img_rect_width - global_uploaded_image_data[img_index]['current_img_width'])/2)
                            .attr("y", icon_y0 + parseInt(uploaded_img_rect_height - global_uploaded_image_data[img_index]['current_img_height'])/2);



                //var rect2 = d3.select("#d3-rect-obj-index_"+ img_index) ||
                var rect2 = d3.select("#d3-rect-obj-index_"+ img_index)

                            //transition for old border to new
                            rect2.transition().duration(2000).attr('stroke', 'blue')


                            rect2
                            .attr("x", x0)
                            .attr("y", y0)
                            .attr("width", uploaded_img_rect_width)
                            .attr("height",  uploaded_img_rect_height)
                            .style("fill", "#fff")
                            .style("fill", "url(#upload-img-def-id-00c_" + img_index + ")")
                            .attr('stroke', '#2378ae')
                            .attr('stroke-dasharray', '10,5')
                            .attr('stroke-linecap', 'butt')
                            .attr('stroke-width', '3')

                          global_toogle_original_channel = true
                          global_toogle_blue_channel = true; //..........................
                        }else {

                          var all_rects = d3.selectAll("rect")["_groups"]

                          var p = d3.select(this)
                          var clicked_id = p.attr("id")
                          var img_index = parseInt(clicked_id.split('_')[1])

                          var clicked_img_data = global_uploaded_image_data[img_index];

                          var drect = all_rects.filter(function(d){
                               var id =  d[0].getAttribute("id")
                                let index = parseInt(id.split("_")[1])
                               return index == img_index
                          })

                          var all_defs = d3.selectAll('defs')["_groups"]
                          var ddef = all_defs.filter(function(d){
                          var id = d[0].firstChild.getAttribute("id")

                          let  index = parseInt( id.split("_")[1])
                               return index == img_index
                          })

                          d3.select("#d3-rect-obj-index_"+ img_index).lower();
                          d3.select("#d3-def-obj-index_"+ img_index).lower();
                          //d3.select("upload-img-red-id_" + img_index).lower();

                var defs3 =  defs.append("svg:pattern")
                            .attr("id", "upload-img-def-id-000c_" + img_index)
                            .attr("width", uploaded_img_rect_width)
                            .attr("height", uploaded_img_rect_height)
                            .attr("patternUnits", "userSpaceOnUse")
                            .append("svg:image")
                            .attr("xlink:href", "/media/" + obj['img_file_path'])
                            .attr("width", global_uploaded_image_data[img_index]['current_img_width'])
                            .attr("height", global_uploaded_image_data[img_index]['current_img_height'])
                            .attr("x", x0 + parseInt(uploaded_img_rect_width - global_uploaded_image_data[img_index]['current_img_width'])/2)
                            .attr("y", icon_y0 + parseInt(uploaded_img_rect_height - global_uploaded_image_data[img_index]['current_img_height'])/2);


                var rect3 = d3.select("#d3-rect-obj-index_"+ img_index)

                              //transition for old border to new
                            rect3.transition().duration(200).attr('stroke', '#633974')

                            rect3
                            .attr("x", x0)
                            .attr("y", y0)
                            .attr("width", uploaded_img_rect_width)
                            .attr("height",  uploaded_img_rect_height)
                            .style("fill", "#fff")
                            .style("fill", "url(#upload-img-def-id-000c_" + img_index + ")")
                            .attr('stroke', '#2378ae')
                            .attr('stroke-dasharray', '10,5')
                            .attr('stroke-linecap', 'butt')
                            .attr('stroke-width', '3')


                            global_toogle_original_channel = false
                            global_toogle_blue_channel = false;
                        }
                      })//on click blue channel

  //......................................................................................
  //                        grey channel button
  //.....................................................................................

    var grey_circle = group1.append('circle')
                      .attr('cx', icon_x0 + 4 * icon_inter_space)
                      .attr('cy', icon_y0)
                      .attr('r',10)
                      .attr('stroke', 'grey')
                      .attr('fill', 'grey')
                      .attr('class', 'upload-image-menu_' + obj_index)
                      .attr('id', 'upload-img-grey-id_' + obj_index)
                      .on("mouseover", function(){
                          d3.select(this)
                              .attr("r", 12)
                              .attr("stroke", 'purple')
                              .style("cursor", "pointer");

                      })
                      .on("mouseout", function(){
                            d3.select(this)
                                    .attr("r", 10)
                                    .attr("stroke", 'grey')


                      })
                      .on("click", function(){
                         d3.event.preventDefault();

                        global_toogle_green_channel = false
                        global_toogle_red_channel = false
                        global_toogle_blue_channel = false


                          if (!global_toogle_grey_channel){

                             d3.select("#d3-rect-obj-index_"+ img_index).raise();
                             d3.select("upload-img-def-id_" + img_index).raise();
                             //d3.select("upload-img-red-id_" + img_index).raise();

                          //stylize clicked rect
                          var all_rects = d3.selectAll("rect")["_groups"]

                          var p = d3.select(this)
                          var clicked_id = p.attr("id")
                          var img_index = parseInt(clicked_id.split('_')[1])

                          var clicked_img_data = global_uploaded_image_data[img_index];

                          var drect = all_rects.filter(function(d){
                               var id =  d[0].getAttribute("id")
                                let index = parseInt(id.split("_")[1])
                               return index == img_index
                          })

                          var all_defs = d3.selectAll('defs')["_groups"]
                          var ddef = all_defs.filter(function(d){
                          var id = d[0].firstChild.getAttribute("id")

                          let  index = parseInt( id.split("_")[1])
                               return index == img_index
                          })

                var defs2 =  defs.append("svg:pattern")
                            .attr("id", "upload-img-def-id-00d_" + img_index)
                            .attr("width", uploaded_img_rect_width)
                            .attr("height", uploaded_img_rect_height)
                            .attr("patternUnits", "userSpaceOnUse")
                            .append("svg:image")
                            .attr("xlink:href", "/" + clicked_img_data['grey_channel'])
                            .attr("width", global_uploaded_image_data[img_index]['current_img_width'])
                            .attr("height", global_uploaded_image_data[img_index]['current_img_height'])
                            .attr("x", x0 + parseInt(uploaded_img_rect_width - global_uploaded_image_data[img_index]['current_img_width'])/2)
                            .attr("y", icon_y0 + parseInt(uploaded_img_rect_height - global_uploaded_image_data[img_index]['current_img_height'])/2);

                //var rect2 = d3.select("#d3-rect-obj-index_"+ img_index) ||
                var rect2 = d3.select("#d3-rect-obj-index_"+ img_index)

                            //transition for old border to new
                            rect2.transition().duration(2000).attr('stroke', 'grey')


                            rect2
                            .attr("x", x0)
                            .attr("y", y0)
                            .attr("width", uploaded_img_rect_width)
                            .attr("height",  uploaded_img_rect_height)
                            .style("fill", "#fff")
                            .style("fill", "url(#upload-img-def-id-00d_" + img_index + ")")
                            .attr('stroke', '#2378ae')
                            .attr('stroke-dasharray', '10,5')
                            .attr('stroke-linecap', 'butt')
                            .attr('stroke-width', '3')

                          global_toogle_original_channel = true
                          global_toogle_grey_channel = true; //..........................
                        }else {

                          var all_rects = d3.selectAll("rect")["_groups"]

                          var p = d3.select(this)
                          var clicked_id = p.attr("id")
                          var img_index = parseInt(clicked_id.split('_')[1])

                          var clicked_img_data = global_uploaded_image_data[img_index];

                          var drect = all_rects.filter(function(d){
                               var id =  d[0].getAttribute("id")
                                let index = parseInt(id.split("_")[1])
                               return index == img_index
                          })

                          var all_defs = d3.selectAll('defs')["_groups"]
                          var ddef = all_defs.filter(function(d){
                          var id = d[0].firstChild.getAttribute("id")

                          let  index = parseInt( id.split("_")[1])
                               return index == img_index
                          })

                          d3.select("#d3-rect-obj-index_"+ img_index).lower();
                          d3.select("#d3-def-obj-index_"+ img_index).lower();
                          //d3.select("upload-img-red-id_" + img_index).lower();


                var defs3 =  defs.append("svg:pattern")
                            .attr("id", "upload-img-def-id-000d_" + img_index)
                            .attr("width", uploaded_img_rect_width)
                            .attr("height", uploaded_img_rect_height)
                            .attr("patternUnits", "userSpaceOnUse")
                            .append("svg:image")
                            .attr("xlink:href", "/media/" + obj['img_file_path'])
                            .attr("width", global_uploaded_image_data[img_index]['current_img_width'])
                            .attr("height", global_uploaded_image_data[img_index]['current_img_height'])
                            .attr("x", x0 + parseInt(uploaded_img_rect_width - global_uploaded_image_data[img_index]['current_img_width'])/2)
                            .attr("y", icon_y0 + parseInt(uploaded_img_rect_height - global_uploaded_image_data[img_index]['current_img_height'])/2);


                var rect3 = d3.select("#d3-rect-obj-index_"+ img_index)
                              //transition for old border to new
                            rect3.transition().duration(200).attr('stroke', '#633974')

                            rect3
                            .attr("x", x0)
                            .attr("y", y0)
                            .attr("width", uploaded_img_rect_width)
                            .attr("height",  uploaded_img_rect_height)
                            .style("fill", "#fff")
                            .style("fill", "url(#upload-img-def-id-000d_" + img_index + ")")
                            .attr('stroke', '#2378ae')
                            .attr('stroke-dasharray', '10,5')
                            .attr('stroke-linecap', 'butt')
                            .attr('stroke-width', '3')

                            global_toogle_original_channel = false
                            global_toogle_grey_channel = false;
                        }
                      })//on click grey channel
//......................................................................................
//                ZOOM OUT
//.....................................................................................

    var zoom_out = group1.append("text")
                  .attr('x', icon_x0 + 5 * icon_inter_space)
                  .attr('y', icon_y0)
                  .attr("dy", ".35em")
                  .text("Z-")
                  .attr('stroke', 'purple')
                  .attr('stroke-width', '2')
                  .attr('class', 'upload-image-menu_' + obj_index)
                  .attr('id', 'upload-img-text-zoom-out-id_' + obj_index)
                  .on("mouseover", function(){
                      d3.select(this)
                          .attr("dy", ".47em")
                          .attr("stroke", 'black')
                          .style("cursor", "pointer");
                  })
                  .on("mouseout", function(){
                        d3.select(this)
                                .attr("dy", ".35em")
                                .attr("stroke", 'purple')
                  })
                  .on("click", function(){
                     d3.event.preventDefault();

                    var all_rects = d3.selectAll("rect")["_groups"]

                    var p = d3.select(this)
                    var clicked_id = p.attr("id")

                    var img_index = parseInt(clicked_id.split('_')[1])

                    var clicked_img_data = global_uploaded_image_data[img_index];

                    var drect = all_rects.filter(function(d){
                         var id =  d[0].getAttribute("id")
                          let index = parseInt(id.split("_")[1])
                         return index == img_index
                    })
                    //remove old image:

                    var all_defs = d3.selectAll('defs')["_groups"]
                    var ddef = []
                    for(let k=0; k<all_defs.length;k++){
                        var d = all_defs[k]

                        for (let v=0; v<d.length;v++){

                            var id = d[v].firstChild.getAttribute("id")

                            let  index = parseInt( id.split("_")[1])
                            if(index == img_index){ddef.push(d[v])}
                        }

                    }

                var ddef_id = ddef[0].firstChild.getAttribute("id")
                d3.select("#" + ddef_id).remove()
                var def4 = d3.select("#" + ddef_id)

                //uploaded_img_rect_width = parseInt(uploaded_img_rect_width/1.1)
                //uploaded_img_rect_height = parseInt(uploaded_img_rect_height/1.1)

                global_uploaded_image_data[img_index]['current_img_width'] = parseInt(global_uploaded_image_data[img_index]['current_img_width']/1.1)

                  global_uploaded_image_data[img_index]['current_img_height'] = parseInt(global_uploaded_image_data[img_index]['current_img_height']/1.1)

                //remove old image before redraw
                if(d3.select("#upload-img-id-zoom-out_" + img_index)){
                  d3.select("#upload-img-id-zoom-out_" + img_index).remove()
                }

        var index = parseInt(ddef_id.split("_")[1])
        var data = global_uploaded_image_data[index]

        var current_image = "/media/" + data['img_file_path']
              if(global_toogle_red_channel){  current_image = "/" + data['red_channel']}
              else if(global_toogle_green_channel){  current_image = "/" + data['green_channel']}
              else if(global_toogle_blue_channel){  current_image = "/" + data['blue_channel']}
              else if(global_toogle_grey_channel){  current_image = "/" + data['grey_channel']}



        var zoom_out_def = svg.append('svg:defs')
                    .append("svg:pattern")
                    .attr("width", uploaded_img_rect_width)
                    .attr("height", uploaded_img_rect_height)
                    .attr("patternUnits", "userSpaceOnUse")
                    .attr("id", "upload-img-id-zoom-out_" + img_index)
                    .append("svg:image")
                    .attr("xlink:href",  current_image)
                    .attr("width",   global_uploaded_image_data[img_index]['current_img_width'])
                    .attr("height", global_uploaded_image_data[img_index]['current_img_height'])
                    .attr("x", x0 + parseInt(uploaded_img_rect_width - global_uploaded_image_data[img_index]['current_img_width'])/2)
                    .attr("y", icon_y0 + parseInt(uploaded_img_rect_height - global_uploaded_image_data[img_index]['current_img_height'])/2);


            var drect_id = drect[0][0].getAttribute("id")
            var drect_width = drect[0][0].getAttribute("width")
            var drect_height = drect[0][0].getAttribute("height")
            var homethetie_rapport =  global_uploaded_image_data[img_index]['current_img_height'] > global_uploaded_image_data[img_index]['current_img_width'] ?   global_uploaded_image_data[img_index]['current_img_height']/global_uploaded_image_data[img_index]['current_img_width'] : global_uploaded_image_data[img_index]['current_img_width'] / global_uploaded_image_data[img_index]['current_img_height']


             var rect4 = d3.select("#"+ drect_id)
                .attr("width", uploaded_img_rect_width)
                .attr("height",  uploaded_img_rect_height)
                .style("fill", "#fff")
                .style("fill", "url(#upload-img-id-zoom-out_" + img_index + ")")
                .attr('stroke', '#2378ae')
                .attr('stroke-dasharray', '10,5')
                .attr('stroke-linecap', 'butt')
                .attr('stroke-width', '3')

                global_toogle_original_channel = true;

                  })//on click zoom out

//......................................................................................
//                ZOOM IN
//.....................................................................................

    var zoom_in = group1.append("text")
                  .attr('x', icon_x0 + 6 * icon_inter_space)
                  .attr('y', icon_y0)
                  .attr("dy", ".35em")
                  .text("Z+")
                  .attr('stroke', 'purple')
                  .attr('stroke-width', '2')
                  .attr('class', 'upload-image-menu_' + obj_index)
                  .attr('id', 'upload-img-text-zoom-in-id_' + obj_index)
                  .on("mouseover", function(){
                      d3.select(this)
                          .attr("dy", ".47em")
                          .attr("stroke", 'black')
                          .style("cursor", "pointer");

                  })
                  .on("mouseout", function(){
                        d3.select(this)
                                .attr("dy", ".35em")
                                .attr("stroke", 'purple')

                  })
                  .on("click", function(){
                     d3.event.preventDefault();

                    var all_rects = d3.selectAll("rect")["_groups"]

                    var p = d3.select(this)
                    var clicked_id = p.attr("id")

                    var img_index = parseInt(clicked_id.split('_')[1])

                    var clicked_img_data = global_uploaded_image_data[img_index];

                    var drect = all_rects.filter(function(d){
                         var id =  d[0].getAttribute("id")
                          let index = parseInt(id.split("_")[1])
                         return index == img_index
                    })

                    var all_defs = d3.selectAll('defs')["_groups"]
                    var ddef = all_defs.filter(function(d){
                                  var id = d[0].firstChild.getAttribute("id")
                                  let  index = parseInt( id.split("_")[1])
                                  return index == img_index
                    })

                var ddef_id = ddef[0][0].firstChild.getAttribute("id")
                var def4 = d3.select("#" + ddef_id)

                //uploaded_img_rect_width = parseInt(uploaded_img_rect_width/1.1)
                //uploaded_img_rect_height = parseInt(uploaded_img_rect_height/1.1)

                current_img_width = parseInt(global_uploaded_image_data[img_index]['current_img_width'] * 1.1)
                current_img_height = parseInt(global_uploaded_image_data[img_index]['current_img_height'] * 1.1)

                //remove old image before redraw
                if(d3.select("#upload-img-id-zoom-out_" + img_index)){
                  d3.select("#upload-img-id-zoom-out_" + img_index).remove()
                }

        var index = parseInt(ddef_id.split("_")[1])
        var data = global_uploaded_image_data[index]

        var current_image = "/media/" + data['img_file_path']
              if(global_toogle_red_channel){  current_image = "/" + data['red_channel']}
              else if(global_toogle_green_channel){  current_image = "/" + data['green_channel']}
              else if(global_toogle_blue_channel){  current_image = "/" + data['blue_channel']}
              else if(global_toogle_grey_channel){  current_image = "/" + data['grey_channel']}



        var zoom_out_def = svg.append('svg:defs')
                    .append("svg:pattern")
                    .attr("width", uploaded_img_rect_width)
                    .attr("height", uploaded_img_rect_height)
                    .attr("patternUnits", "userSpaceOnUse")
                    .attr("id", "upload-img-id-zoom-out_" + img_index)
                    .append("svg:image")
                    .attr("xlink:href",  current_image)
                    .attr("width", current_img_width)
                    .attr("height", current_img_height)
                    .attr("x", x0 + parseInt(uploaded_img_rect_width - current_img_width)/2)
                    .attr("y", icon_y0 + parseInt(uploaded_img_rect_height - current_img_height)/2);


            var drect_id = drect[0][0].getAttribute("id")
            var drect_width = drect[0][0].getAttribute("width")
            var drect_height = drect[0][0].getAttribute("height")
            var homethetie_rapport =  current_img_height > current_img_width ?   current_img_height/current_img_width : current_img_width / current_img_height


             var rect4 = d3.select("#"+ drect_id)
                .attr("width", uploaded_img_rect_width)
                .attr("height",  uploaded_img_rect_height)
                .style("fill", "#fff")
                .style("fill", "url(#upload-img-id-zoom-out_" + img_index + ")")
                .attr('stroke', '#2378ae')
                .attr('stroke-dasharray', '10,5')
                .attr('stroke-linecap', 'butt')
                .attr('stroke-width', '3')

                global_toogle_original_channel = true;

              })//on click zoom in
//......................................................................................
//               ORIGINAL IMAGE   (back to original image after zoom )
//.....................................................................................
var original_image_circle = group1.append('circle')
                  .attr('cx', icon_x0 + 7 * icon_inter_space)
                  .attr('cy', icon_y0)
                  .attr('r',10)
                  .attr('stroke', 'purple')
                  .attr('fill', 'purple')
                  .attr('class', 'upload-image-menu_' + obj_index)
                  .attr('id', 'upload-img-original-id_' + obj_index)
                  .on("mouseover", function(){
                      d3.select(this)
                          .attr("r", 12)
                          .attr("stroke", 'yellow')
                          .style("cursor", "pointer");

                  })
                  .on("mouseout", function(){
                        d3.select(this)
                                .attr("r", 10)
                                .attr("stroke", 'purple')


                  })
                  .on("click", function(e){
                     d3.event.preventDefault();


                  if (global_toogle_original_channel){

                   d3.select("#d3-rect-obj-index_"+ img_index).raise();
                         d3.select("upload-img-def-id_" + img_index).raise();
                         //d3.select("upload-img-red-id_" + img_index).raise();

                         // move to front

                         //.....................................................
                      //stylize clicked rect
                      var all_rects = d3.selectAll("rect")["_groups"]

                      var p = d3.select(this)
                      var clicked_id = p.attr("id")
                      var img_index = parseInt(clicked_id.split('_')[1]) //id of text

                      var clicked_img_data = global_uploaded_image_data[img_index];

                      var drect = all_rects.filter(function(d){
                           var id =  d[0].getAttribute("id")
                            let index = parseInt(id.split("_")[1])
                           return index == img_index
                      })

                      var all_defs = d3.selectAll('defs')["_groups"]
                      var ddef = all_defs.filter(function(d){
                            var id = d[0].firstChild.getAttribute("id")

                            let  index = parseInt( id.split("_")[1])
                           return index == img_index
                      })

                      //initial width and height
                      current_img_width = obj['img_width']
                      current_img_height = obj['img_height']

                      //remove zoom image
                      if(d3.select("#upload-img-id-zoom-out_" + img_index)){
                        d3.select("#upload-img-id-zoom-out_" + img_index).remove()
                      }

                      //set current image
                      var ddef_id = ddef[0][0].firstChild.getAttribute("id")
                      var index = parseInt(ddef_id.split("_")[1])
                      var data = global_uploaded_image_data[index]



            var defs2 =  d3.select("#" + ddef_id)
                        .attr("id", "upload-img-def-id-00e_" + img_index)
                        .attr("width", uploaded_img_rect_width)
                        .attr("height", uploaded_img_rect_height)
                        .attr("patternUnits", "userSpaceOnUse")
                        .append("svg:image")
                        .attr("xlink:href", "/media/" + data['img_file_path'])
                        .attr("width", current_img_width)
                        .attr("height", current_img_height)
                        .attr("x", x0 + parseInt(uploaded_img_rect_width - current_img_width)/2)
                        .attr("y", y0 + parseInt(uploaded_img_rect_height - current_img_height)/2);



            //var rect2 = d3.select("#d3-rect-obj-index_"+ img_index) ||
            var drect_id = drect[0][0].getAttribute("id")
            var rect2 = d3.select("#" + drect_id)


                        rect2
                        .attr("x", x0)
                        .attr("y", y0)
                        .attr("width", uploaded_img_rect_width)
                        .attr("height",  uploaded_img_rect_height)
                        .style("fill", "#fff")
                        .style("fill", "url(#upload-img-def-id-00e_" + img_index + ")")
                        .attr('stroke', '#2378ae')
                        .attr('stroke-dasharray', '10,5')
                        .attr('stroke-linecap', 'butt')
                        .attr('stroke-width', '3')

                        global_toogle_original_channel = false

                        //transition for old border to new
                        rect2.transition().duration(100).attr('stroke', "purple")


                        /*global_toogle_green_channel = false
                        global_toogle_red_channel = false
                        global_toogle_blue_channel = false
                        global_toogle_grey_channel = false */

                      }//if global_toogle_original_channel
                  })//on click original image


//......................................................................................
//                CLOSE  ICON   (upload image)
//.....................................................................................
    var close = group1.append("text")
                .attr("x",  icon_x0 + 8 * icon_inter_space)
                .attr('y', icon_y0)
                .attr("dy", ".35em")
                .text("X")
                .attr('stroke', 'purple')
                .attr('stroke-width', '2')
                .attr('class', 'upload-image-menu_' + obj_index)
                .attr('id', 'upload-img-text-close-id_' + obj_index)
                .on("mouseover", function(){
                    d3.select(this)
                        .attr("dy", ".47em")
                        .attr("stroke", 'black')
                        .style("cursor", "pointer");

                })
                .on("mouseout", function(){
                      d3.select(this)
                              .attr("dy", ".35em")
                              .attr("stroke", 'purple')
                })
                .on("click", function(){
                   d3.event.preventDefault();
                   var all_rects = d3.selectAll("rect")["_groups"]
                   var p = d3.select(this)
                   var clicked_id = p.attr("id")
                   var img_index = parseInt(clicked_id.split('_')[1])

                   var a = d3.selectAll('.group1')['_groups'][0]
                   var nodes_afters = []
                   var all_nodes = []
                   var to_delete = []

                   for(let i=0; i<a.length; i++){
                         //console.log(a[i])
                         if(a[i].firstChild){
                            id = a[i].firstChild.getAttribute("id")
                            id_index = parseInt( id.split("_")[1] )

                            if( id_index > img_index){ nodes_afters.push(a[i])   }
                            else if( id_index < img_index){ to_delete.push(a[i])  }
                         }
                         all_nodes.push(a[i])
                   }

                   d3.select("#upload-img-def-id_" + img_index).attr("width", 1e-6)
                   d3.select("#upload-img-def-id_" + img_index).attr("height", 1e-6)

                   d3.select("#d3-rect-obj-index_" + img_index).attr("width", 1e-6)
                   d3.select("#d3-rect-obj-index_" + img_index).attr("height", 1e-6)

                   d3.select('#upload-img-red-id_' + img_index).remove();
                   d3.select('#upload-img-green-id_' + img_index).remove();
                   d3.select('#upload-img-blue-id_' + img_index).remove();
                   d3.select('#upload-img-grey-id_' + img_index).remove();
                   d3.select('#upload-img-original-id_' + img_index).remove();

                   d3.select("#upload-img-text-zoom-in-id_" + img_index).remove();
                   d3.select("#upload-img-text-zoom-out-id_" + img_index).remove();
                   d3.select("#upload-img-text-close-id_" + img_index).remove();

                  d3.selectAll(to_delete).each(function(d, i){  group3.node().appendChild(d3.select(this).node());  })
                  d3.selectAll(nodes_afters).each(function(d, i){  group2.node().appendChild(d3.select(this).node());  })

                   global_shifht_nodes = true

                 })//on click
                 global_current_index = global_current_index + 1
        }});//$("#fileuploader").uploadFile({

})
