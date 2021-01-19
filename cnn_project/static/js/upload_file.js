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

    uploaded_img_rect_width = 400
    uploaded_img_rect_height = 400
    x0 = 50
    y0 = 50

    d3.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };


    var svg = d3.select("body").append("svg")
              .attr("width", 1000)
              .attr("height", 4000)
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
             "img_shape": JSON.parse(rdata[9])
         }

          global_uploaded_image_data.push(obj);
          current_img_width = obj['img_width']
          current_img_height = obj['img_height']


var defs = svg.append('svg:defs');

    obj_index = global_uploaded_image_data.indexOf(obj);
    var offsety = obj_index * uploaded_img_rect_height + 30

    //Center uploaded image
  if(current_img_width > uploaded_img_rect_width){current_img_width = uploaded_img_rect_width}
    if(current_img_height > uploaded_img_rect_height){current_img_height = uploaded_img_rect_height}

  defs.append("svg:pattern")
    .attr("id", "upload-img-def-id_" + obj_index)
    .attr("width", uploaded_img_rect_width)
    .attr("height", uploaded_img_rect_height)
    .attr("patternUnits", "userSpaceOnUse")
    .append("svg:image")
    .attr("xlink:href", "/media/" + obj['img_file_path'])
    .attr("width", current_img_width)
    .attr("height", current_img_height)
    .attr("x", 50 + parseInt(uploaded_img_rect_width - current_img_width)/2)
    .attr("y", 50 + parseInt(uploaded_img_rect_height - current_img_height)/2);

    var group = svg.append("g")
                .attr("id", "mygroup_" + obj_index)
                .attr("class", "all_group_class")
                .attr("transform", "translate(" + 0 + "," + offsety + ")")

    var rect = group.append('rect')
              .attr("x", x0)
              .attr("y", y0)
              .attr("width", uploaded_img_rect_width)
              .attr("height", uploaded_img_rect_height)
              .attr("id", "d3-rect-obj-index_"+ obj_index)
              .style("fill", "#fff")
              .style("fill", "url(#upload-img-def-id_" + obj_index + ")")
              .attr('stroke', '#633974')
              .attr('stroke-dasharray', '10,5')
              .attr('stroke-linecap', 'butt')
              .attr('stroke-width', '3')

//......................................................................................
//                        red channel button
//.....................................................................................
    var red_circle = group.append('circle')
              .attr('cx',150)
              .attr('cy', 60)
              .attr('r',10)
              .attr('stroke', 'red')
              .attr('fill', 'red')
              .attr('class', 'upload-image-menu_')
              .attr('id', 'upload-img-red-id_' + obj_index)
              .on("mouseover", function(){
                  d3.select(this)
                      .attr("r", 12)
                      .attr("stroke", 'purple')
                      .style("cursor", "pointer");

              })
              .on("mouseout", function(){
                    d3.select(this)
                            .attr("r", 10)
                            .attr("stroke", 'red')


              })
              .on("click", function(e){
                 d3.event.preventDefault();

                global_toogle_green_channel = false
                global_toogle_blue_channel = false
                global_toogle_grey_channel = false;
                //global_toogle_original_channel = false

                  if (!global_toogle_red_channel){
                     d3.select("#d3-rect-obj-index_"+ img_index).raise();
                     d3.select("upload-img-def-id_" + img_index).raise();
                     //d3.select("upload-img-red-id_" + img_index).raise();

                     // move to front

                     //.....................................................
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
                    .attr("id", "upload-img-def-id-00a_" + img_index)
                    .attr("width", uploaded_img_rect_width)
                    .attr("height", uploaded_img_rect_height)
                    .attr("patternUnits", "userSpaceOnUse")
                    .append("svg:image")
                    .attr("xlink:href", "/" + clicked_img_data['red_channel'])
                    .attr("width", current_img_width)
                    .attr("height", current_img_height)
                    .attr("x", x0 + parseInt(uploaded_img_rect_width - current_img_width)/2)
                    .attr("y", y0 + parseInt(uploaded_img_rect_height - current_img_height)/2);
        //var rect2 = d3.select("#d3-rect-obj-index_"+ img_index) ||
        var rect2 = d3.select("#d3-rect-obj-index_"+ img_index)

                    //transition for old border to new
                    rect2.transition().duration(2000).attr('stroke', 'red')


                    rect2
                    .attr("x", x0)
                    .attr("y",y0)
                    .attr("width", uploaded_img_rect_width)
                    .attr("height",  uploaded_img_rect_height)
                    .style("fill", "#fff")
                    .style("fill", "url(#upload-img-def-id-00a_" + img_index + ")")
                    .attr('stroke', '#2378ae')
                    .attr('stroke-dasharray', '10,5')
                    .attr('stroke-linecap', 'butt')
                    .attr('stroke-width', '3')



                  global_toogle_red_channel = true; //..........................
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
                    .attr("id", "upload-img-def-id-000a_" + img_index)
                    .attr("width", uploaded_img_rect_width)
                    .attr("height", uploaded_img_rect_height)
                    .attr("patternUnits", "userSpaceOnUse")
                    .append("svg:image")
                    .attr("xlink:href", "/media/" + obj['img_file_path'])
                    .attr("width", current_img_width)
                    .attr("height", current_img_height)
                    .attr("x", x0 + parseInt(uploaded_img_rect_width - current_img_width)/2)
                    .attr("y", y0 + parseInt(uploaded_img_rect_height - current_img_height)/2);


        var rect3 = d3.select("#d3-rect-obj-index_"+ img_index)

                      //transition for old border to new
                    rect3.transition().duration(200).attr('stroke', '#633974')

                    rect3
                    .attr("x", x0)
                    .attr("y",y0)
                    .attr("width", uploaded_img_rect_width)
                    .attr("height",  uploaded_img_rect_height)
                    .style("fill", "#fff")
                    .style("fill", "url(#upload-img-def-id-000a_" + img_index + ")")
                    .attr('stroke', '#2378ae')
                    .attr('stroke-dasharray', '10,5')
                    .attr('stroke-linecap', 'butt')
                    .attr('stroke-width', '3')



                    global_toogle_red_channel = false;
                }
              })//on click red channel

//......................................................................................
//                        green channel button
//.....................................................................................
    var green_circle = group.append('circle')
                    .attr('cx',180)
                    .attr('cy', 60)
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
                      //global_toogle_original_channel = false

                        if (!global_toogle_green_channel){

                           d3.select("#d3-rect-obj-index_"+ img_index).raise();
                           d3.select("upload-img-def-id_" + img_index).raise();
                           //d3.select("upload-img-red-id_" + img_index).raise();

                           // move to front

                           //.....................................................
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
                          .attr("width", current_img_width)
                          .attr("height", current_img_height)
                          .attr("x", x0 + parseInt(uploaded_img_rect_width - current_img_width)/2)
                          .attr("y", y0 + parseInt(uploaded_img_rect_height - current_img_height)/2);


              //var rect2 = d3.select("#d3-rect-obj-index_"+ img_index) ||
              var rect2 = d3.select("#d3-rect-obj-index_"+ img_index)

                          //transition for old border to new
                          rect2.transition().duration(2000).attr('stroke', 'green')


                          rect2
                          .attr("x", x0)
                          .attr("y",y0)
                          .attr("width", uploaded_img_rect_width)
                          .attr("height",  uploaded_img_rect_height)
                          .style("fill", "#fff")
                          .style("fill", "url(#upload-img-def-id-00b_" + img_index + ")")
                          .attr('stroke', '#2378ae')
                          .attr('stroke-dasharray', '10,5')
                          .attr('stroke-linecap', 'butt')
                          .attr('stroke-width', '3')



                        global_toogle_green_channel = true; //..........................
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
                          .attr("width", current_img_width)
                          .attr("height", current_img_height)
                          .attr("x", x0 + parseInt(uploaded_img_rect_width - current_img_width)/2)
                          .attr("y", y0 + parseInt(uploaded_img_rect_height - current_img_height)/2);


              var rect3 = d3.select("#d3-rect-obj-index_"+ img_index)

                            //transition for old border to new
                          rect3.transition().duration(200).attr('stroke', '#633974')

                          rect3
                          .attr("x", x0)
                          .attr("y",y0)
                          .attr("width", uploaded_img_rect_width)
                          .attr("height",  uploaded_img_rect_height)
                          .style("fill", "#fff")
                          .style("fill", "url(#upload-img-def-id-000b_" + img_index + ")")
                          .attr('stroke', '#2378ae')
                          .attr('stroke-dasharray', '10,5')
                          .attr('stroke-linecap', 'butt')
                          .attr('stroke-width', '3')



                          global_toogle_green_channel = false;
                      }
                    })//on click green channel

//......................................................................................
//                        blue channel button
//.....................................................................................

var blue_circle = group.append('circle')
                      .attr('cx',210)
                      .attr('cy', 60)
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
                        global_toogle_green_channel = false
                        global_toogle_red_channel = false
                        global_toogle_grey_channel = false;
                        //global_toogle_original_channel = false

                          if (!global_toogle_blue_channel){

                             d3.select("#d3-rect-obj-index_"+ img_index).raise();
                             d3.select("upload-img-def-id_" + img_index).raise();
                             //d3.select("upload-img-red-id_" + img_index).raise();

                             // move to front

                             //.....................................................
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
                            .attr("width", current_img_width)
                            .attr("height", current_img_height)
                            .attr("x", x0 + parseInt(uploaded_img_rect_width - current_img_width)/2)
                            .attr("y", y0 + parseInt(uploaded_img_rect_height - current_img_height)/2);


                //var rect2 = d3.select("#d3-rect-obj-index_"+ img_index) ||
                var rect2 = d3.select("#d3-rect-obj-index_"+ img_index)

                            //transition for old border to new
                            rect2.transition().duration(2000).attr('stroke', 'blue')


                            rect2
                            .attr("x", x0)
                            .attr("y",y0)
                            .attr("width", uploaded_img_rect_width)
                            .attr("height",  uploaded_img_rect_height)
                            .style("fill", "#fff")
                            .style("fill", "url(#upload-img-def-id-00c_" + img_index + ")")
                            .attr('stroke', '#2378ae')
                            .attr('stroke-dasharray', '10,5')
                            .attr('stroke-linecap', 'butt')
                            .attr('stroke-width', '3')



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
                            .attr("width", current_img_width)
                            .attr("height", current_img_height)
                            .attr("x", x0 + parseInt(uploaded_img_rect_width - current_img_width)/2)
                            .attr("y", y0 + parseInt(uploaded_img_rect_height - current_img_height)/2);


                var rect3 = d3.select("#d3-rect-obj-index_"+ img_index)

                              //transition for old border to new
                            rect3.transition().duration(200).attr('stroke', '#633974')

                            rect3
                            .attr("x", x0)
                            .attr("y",y0)
                            .attr("width", uploaded_img_rect_width)
                            .attr("height",  uploaded_img_rect_height)
                            .style("fill", "#fff")
                            .style("fill", "url(#upload-img-def-id-000c_" + img_index + ")")
                            .attr('stroke', '#2378ae')
                            .attr('stroke-dasharray', '10,5')
                            .attr('stroke-linecap', 'butt')
                            .attr('stroke-width', '3')



                            global_toogle_blue_channel = false;
                        }
                      })//on click blue channel

  //......................................................................................
  //                        grey channel button
  //.....................................................................................

    var grey_circle = group.append('circle')
                      .attr('cx',240)
                      .attr('cy', 60)
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
                        //global_toogle_original_channel = false

                          if (!global_toogle_grey_channel){

                             d3.select("#d3-rect-obj-index_"+ img_index).raise();
                             d3.select("upload-img-def-id_" + img_index).raise();
                             //d3.select("upload-img-red-id_" + img_index).raise();

                             // move to front

                             //.....................................................
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
                            .attr("width", current_img_width)
                            .attr("height", current_img_height)
                            .attr("x", x0 + parseInt(uploaded_img_rect_width - current_img_width)/2)
                            .attr("y", y0 + parseInt(uploaded_img_rect_height - current_img_height)/2);


                //var rect2 = d3.select("#d3-rect-obj-index_"+ img_index) ||
                var rect2 = d3.select("#d3-rect-obj-index_"+ img_index)

                            //transition for old border to new
                            rect2.transition().duration(2000).attr('stroke', 'grey')


                            rect2
                            .attr("x", x0)
                            .attr("y",y0)
                            .attr("width", uploaded_img_rect_width)
                            .attr("height",  uploaded_img_rect_height)
                            .style("fill", "#fff")
                            .style("fill", "url(#upload-img-def-id-00d_" + img_index + ")")
                            .attr('stroke', '#2378ae')
                            .attr('stroke-dasharray', '10,5')
                            .attr('stroke-linecap', 'butt')
                            .attr('stroke-width', '3')



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
                            .attr("width", current_img_width)
                            .attr("height", current_img_height)
                            .attr("x", x0 + parseInt(uploaded_img_rect_width - current_img_width)/2)
                            .attr("y", y0 + parseInt(uploaded_img_rect_height - current_img_height)/2);



                var rect3 = d3.select("#d3-rect-obj-index_"+ img_index)

                              //transition for old border to new
                            rect3.transition().duration(200).attr('stroke', '#633974')

                            rect3
                            .attr("x", x0)
                            .attr("y",y0)
                            .attr("width", uploaded_img_rect_width)
                            .attr("height",  uploaded_img_rect_height)
                            .style("fill", "#fff")
                            .style("fill", "url(#upload-img-def-id-000d_" + img_index + ")")
                            .attr('stroke', '#2378ae')
                            .attr('stroke-dasharray', '10,5')
                            .attr('stroke-linecap', 'butt')
                            .attr('stroke-width', '3')



                            global_toogle_grey_channel = false;
                        }
                      })//on click grey channel
//......................................................................................
//                ZOOM OUT
//.....................................................................................

    var zoom_out = group.append("text")
                  .attr("x", 260)
                  .attr("y", 60)
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

                current_img_width = parseInt(current_img_width/1.1)
                current_img_height = parseInt(current_img_height/1.1)

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
                    .attr("y", y0 + parseInt(uploaded_img_rect_height - current_img_height)/2);


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

                  })//on click zoom out

//......................................................................................
//                ZOOM IN
//.....................................................................................

    var zoom_in = group.append("text")
                  .attr("x", 290)
                  .attr("y", 60)
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

                current_img_width = parseInt(current_img_width * 1.1)
                current_img_height = parseInt(current_img_height * 1.1)

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
                    .attr("y", y0 + parseInt(uploaded_img_rect_height - current_img_height)/2);


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
var original_image_circle = group.append('circle')
                  .attr('cx',330)
                  .attr('cy', 60)
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

            var current_image = "/media/" + data['img_file_path']
            var border_transition_color = "purple"
                  if(global_toogle_red_channel){  current_image = "/" + data['red_channel']; border_transition_color = "red";}
                  else if(global_toogle_green_channel){  current_image = "/" + data['green_channel'];border_transition_color = "green";}
                  else if(global_toogle_blue_channel){  current_image = "/" + data['blue_channel'];border_transition_color = "blue";}
                  else if(global_toogle_grey_channel){  current_image = "/" + data['grey_channel'];border_transition_color = "grey";}


            var defs2 =  d3.select("#" + ddef_id)
                        .attr("id", "upload-img-def-id-00e_" + img_index)
                        .attr("width", uploaded_img_rect_width)
                        .attr("height", uploaded_img_rect_height)
                        .attr("patternUnits", "userSpaceOnUse")
                        .append("svg:image")
                        .attr("xlink:href", current_image)
                        .attr("width", current_img_width)
                        .attr("height", current_img_height)
                        .attr("x", x0 + parseInt(uploaded_img_rect_width - current_img_width)/2)
                        .attr("y", y0 + parseInt(uploaded_img_rect_height - current_img_height)/2);


            //var rect2 = d3.select("#d3-rect-obj-index_"+ img_index) ||
            var drect_id = drect[0][0].getAttribute("id")
            var rect2 = d3.select("#" + drect_id)


                        rect2
                        .attr("x", x0)
                        .attr("y",y0)
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
                        rect2.transition().duration(100).attr('stroke', border_transition_color)


                        /*global_toogle_green_channel = false
                        global_toogle_red_channel = false
                        global_toogle_blue_channel = false
                        global_toogle_grey_channel = false */

                      }//if global_toogle_original_channel
                  })//on click original image


//......................................................................................
//                CLOSE  ICON   (upload image)
//.....................................................................................
    var close = group.append("text")
                .attr("x", 360)
                .attr("y", 60)
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

                  var rest_nodes = []
                  var to_delete = []
                  for(let k=0;k<d3.selectAll(".all_group_class")["_groups"].length;k++){
                       let val = d3.selectAll(".all_group_class")["_groups"][k]
                       for(let n = 0; n<val.length; n++){
                           if(n > img_index){rest_nodes.push(val[n])}
                           else to_delete.push(val[n])
                       }
                  }

                   // <== Get all circle elements
                   var grouped_elements = d3.select("#mygroup_" + img_index)
                   //var grouped_nodes = grouped_elements[0].childNodes
                   var grouped_nodes = grouped_elements['_groups'][0][0].childNodes
                   d3.selectAll(grouped_nodes).remove()

                   d3.select("#upload-img-red-id_" + img_index).remove()
                   d3.select("#upload-img-green-id_" + img_index).remove()
                   d3.select("#upload-img-blue-id_" + img_index).remove()
                   d3.select("#upload-img-grey-id_" + img_index).remove()
                   d3.select("#upload-img-original-id_" + img_index).remove()
                   d3.select("#upload-img-text-zoom-in-id_" + img_index).remove()
                   d3.select("#upload-img-text-zoom-out-id_" + img_index).remove()
                   //d3.selectAll(grouped_nodes).remove()

                   global_uploaded_image_data.splice(img_index, 1)


                                 //get x, y of element to delete
                                 del_x = d3.select(to_delete[0].childNodes[0]).attr("x")
                                  console.log("del: ", del_x)

                                  transale_vector = -offsety + 40;
                                  var num = -1
                                  for(let m=0;m<rest_nodes.length;m++){
                                      var all_nodes_to_translate = rest_nodes[m].childNodes


                                      for(let z=0; z<all_nodes_to_translate.length;z++){

                                         if (z == 0){
                                       num = d3.select(all_nodes_to_translate[z]).attr('id').split('_')[1]

                                     }
                                          //rect
                                         d3.select("#d3-rect-obj-index_" + num)
                                         .attr("id", "d3-rect-obj-index-trans_" + num)
                                         .attr("transform", "translate(" + 0 + "," + transale_vector + ")");
                                         //text close
                                           d3.select("#upload-img-text-close-id_" + num)
                                           .attr("id", "#upload-img-text-close-trans-id_" + num)
                                           .attr("transform", "translate(" + 0 + "," + transale_vector + ")");

                                         //original
                                         d3.select("#upload-img-original-id_" + num)
                                         .attr("id", "#upload-img-original-trans-id_" + num)
                                         .attr("transform", "translate(" + 0 + "," + transale_vector + ")");

                                         //zoom in
                                         d3.select("#upload-img-text-zoom-in-id_" + num)
                                         .attr("id", "#upload-img-text-zoom-in-trans-id_" + num)
                                         .attr("transform", "translate(" + 0 + "," + transale_vector + ")");

                                         //zoom out
                                         d3.select("#upload-img-text-zoom-out-id_" + num)
                                         .attr("id", "#upload-img-text-zoom-out-trans-id_" + num)
                                         .attr("transform", "translate(" + 0 + "," + transale_vector + ")");

                                         //grey
                                         d3.select("#upload-img-grey-id_" + num)
                                         .attr("id", "#upload-img-grey-trans-id_" + num)
                                         .attr("transform", "translate(" + 0 + "," + transale_vector + ")");

                                         //blue
                                         d3.select("#upload-img-blue-id_" + num)
                                         .attr("id", "#upload-img-blue-trans-id_" + num)
                                         .attr("transform", "translate(" + 0 + "," + transale_vector + ")");

                                         //green
                                         d3.select("#upload-img-green-id_" + num)
                                         .attr("id", "#upload-img-green-trans-id_" + num)
                                         .attr("transform", "translate(" + 0 + "," + transale_vector + ")");

                                         //red
                                         d3.select("#upload-img-red-id_" + num)
                                         .attr("id", "#upload-img-red-trans-id_" + num)
                                         .attr("transform", "translate(" + 0 + "," + transale_vector + ")");

                                      }
                                  }



                /*  console.log( d3.select("#d3-rect-obj-index_" + img_index).attr("x") )
                  console.log( d3.select("#upload-img-red-id_" + img_index).attr("cx") ) //red circle
                  console.log(d3.select("#upload-img-green-id_" + img_index).attr("cx"))
                  console.log(d3.select("#upload-img-blue-id_" + img_index).attr("cx"))
                  console.log(d3.select("#upload-img-grey-id_" + img_index).attr("cx"))
                  console.log(d3.select("#upload-img-original-id_" + img_index).attr("cx"))
                  console.log(d3.select("#upload-img-text-zoom-in-id_" + img_index).attr("x"))
                  console.log(d3.select("#upload-img-text-zoom-out-id_" + img_index).attr("x"))
                  console.log(d3.select("#upload-img-def-id_" + img_index).attr("x")) */


    })//on close

  }});

    //................. end jquery
})
