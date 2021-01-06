// When the DOM has loaded, init the form link.
$(
  function(){
//-----------------------------------------------------------------------------------------
//
//-----------------------------------------------------------------------------------------
// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');
$.ajaxSetup({
       headers: { "X-CSRFToken": getCookie("csrftoken") }
  });
console.log("csrftoken: ", csrftoken);
window.global_image_red_channel_path = null; //for channels images path
window.global_image_green_channel_path = null; //for channels images path
window.global_image_blue_channel_path = null; //for channels images path

window.global_images_array = null; //for channels images path
window.global_images_grey_scale_array_path = null
window.global_images_grey_scale_array = null
window.global_reduce_uploaded_image = false; //for channels images path

window.global_grid = true //show grid or not
window.global_image_file_width = null
window.global_image_file_height = null

window.global_image_file_width_copy = null;
window.global_image_file_height_copy = null;
window.is_grey_scale_image_active = false;
window.global_svg_grid = null; //GRID SVG ELEMENT , draw grid, zom in, zoom out

window.global_tile_width = 25
window.global_tile_width_copy = 25

window.global_zoom_in = 1.1
window.global_zoom_out = 1.1

window.global_clicked_pixel = null
window.global_kernel_shape = null  //kernel square
window.global_kernel_shape_show = true //show or hide kernel

window.global_image_xtop_left = null;
window.global_image_ytop_left = null;


window.global_kernel_array = null;
window.global_kernel_file = null;

window.global_user_input_kernel = null;

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


//CONSOLE INPUT
var console_val = document.getElementById("console")

console_val.addEventListener('click', function(e){
      document.getElementById("console").style.color = 'white';
})

//-----------------------------------------------------------------------------------------------------------------------//
//                                                CONSOLE-MANUPULATION
//-----------------------------------------------------------------------------------------------------------------------//
console_val.addEventListener('keypress', function(e){
    if ((e.keyCode == 13 ) && (console_val.value !== "")){
        $.post('/mypostview', {'mydata': console_val.value , 'csrfmiddlewaretoken': '{{ csrf_token }}'}, function(data) {
          // DISPLY RESULT ON BOARD
          //-----------------------------
            if(!data){
                document.getElementById("console").style.color = 'red'
            }
            else {
              mydata = JSON.parse(data)
              console.log(mydata)

              //Create SVG element
              console_data = mydata['console-data']
              console_data_type = mydata['console-data-dtype']
              console_data_shape = mydata['console-data-shape']
              //colors = ['#D9BC50', '#E2ECEC', '#ADE6EA', '#C21D43','#535046', '#2DDBE6', '#CF2DE6', '#DAAAE1', '#9899BE', '#5D5FCA', '#181A9F', '#BDD1D1', '#73BFBF', '#CA9276', '#B05D34']
              margin = { top: 20, right: 20, bottom: 30, left: 40 },

              width = +window.innerWidth - margin.left - margin.right
              height = +window.innerHeight - margin.top - margin.bottom

              var x = d3.scaleBand().rangeRound([0, width/6]);
              var y = d3.scaleBand().rangeRound([0, height/6]);

              y.domain(console_data.map(function(d, i) { return i; }));

              var maxChildLength = d3.max(console_data, function(d) { return d.length; });

              var xArr = Array.apply(null, { length: maxChildLength }).map(Function.call, Number);
              x.domain(xArr);

              var maxNum = d3.max(console_data, function(array) { return d3.max(array); });

              //var colors = d3.scaleLinear().domain([0, width]).range(['#C2271D', '#C21D36']);
              if (  console_data_shape.length == 1 ){
                var colors = d3.scaleLinear().domain([0, console_data.length]).range([0, 1]);}
              else if (  console_data_shape.length == 2 ){
                  var colors = d3.scaleLinear().domain([0, maxNum]).range([0, 1]);}
              else { //to do
                var colors = d3.scaleLinear().domain([0, maxNum]).range([0, 1]);}
              //----------- d3js code -----------------------//

              div = d3.select('#board')
              var local = d3.local();

              svg = div.append('svg')
                .attr('width', width)
                .attr('height', height)

              // Create a group for each row in the data matrix and
              // translate the group vertically


          if (console_data_shape.length == 1){


                        // For each group, create a set of rectangles and bind
                        // them to the inner array (the inner array is already
                        // binded to the group)
                        let grp = svg.selectAll('g')
                          .data(console_data) //use top-level data to join g
                          .enter()
                          .append('g')


                        grp
                       .selectAll('rect')
                       .data(function(d, i) {   local.set(this, i); return d; }) //for each <g>, use the second-level data (return d) to join rect
                       .enter()
                       .append('rect')
                       .attr('x', function(d, i, j) { /*return 20 * i + xstart;*/ return x(i); })
                       .attr('y', function(d) { return y(local.get(this)); })
                       .attr("width", x.bandwidth())
                       .attr("height", y.bandwidth())
                       .attr("fill-opacity", function(d) {

                            if (d < 0){return colors(""+ (-d))}
                            else {return colors(+d) }
                         })

                       svg.append("g")
                       .selectAll("g")
                       .data(console_data)
                       .enter()
                       .append("g")
                       .selectAll("text")
                       .data(function(d, i) { local.set(this, i); return d; })
                       .enter()
                       .append("text")
                       .text(function(d, i, j) {
                         return "" + d.toFixed(1);
                       })
                       .attr("x", function(d, i, j) {
                         // return (i * 20) + 40;
                         return x(i);
                      })
                      .attr("y", function(d) {
                        return y(local.get(this));
                        //return (local.get(this) * 20) + 40;
                      })
                      .style("stroke", "white")
                      .style("fill", "white")
                      .attr("dx", x.bandwidth() / 2)
                      .attr("dy", y.bandwidth() / 2)
                      .attr("text-anchor", "middle")
                      .attr("dominant-baseline", "central")
                      .attr("font-family", "sans-serif")
                      .attr("font-size", "20px")

          }else if(console_data_shape.length == 2){

            console.log(2)
            // For each group, create a set of rectangles and bind
            // them to the inner array (the inner array is already
            // binded to the group)
            let grp = svg.selectAll('g')
              .data(console_data) //use top-level data to join g
              .enter()
              .append('g')


            grp
           .selectAll('rect')
           .data(function(d, i) {   local.set(this, i); return d; }) //for each <g>, use the second-level data (return d) to join rect
           .enter()
           .append('rect')
           .attr('x', function(d, i, j) { /*return 20 * i + xstart;*/ return x(i); })
           .attr('y', function(d) { return y(local.get(this)); })
           .attr("width", x.bandwidth())
           .attr("height", y.bandwidth())
           .attr("fill-opacity", function(d) {

                if (d < 0){return colors(""+ (-d))}
                else {return colors(+d) }
             })

           svg.append("g")
           .selectAll("g")
           .data(console_data)
           .enter()
           .append("g")
           .selectAll("text")
           .data(function(d, i) { local.set(this, i); return d; })
           .enter()
           .append("text")
           .text(function(d, i, j) {
             return "" + d.toFixed(1);
           })
           .attr("x", function(d, i, j) {
             // return (i * 20) + 40;
             return x(i);
          })
          .attr("y", function(d) {
            return y(local.get(this));
            //return (local.get(this) * 20) + 40;
          })
          .style("stroke", "white")
          .style("fill", "white")
          .attr("dx", x.bandwidth() / 2)
          .attr("dy", y.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .attr("font-family", "sans-serif")
          .attr("font-size", "20px")


         }else  if(console_data_shape.length == 3){

         }else if(console_data_shape.length == 4){

         }else {console.error("Shape out of bound")}

      //----------- end d3js code  --------------------
          }//if (data)
      });//end $.post
    }//if (e.keycode)
}, false)

//STYLIZE NAVBAR a-tag
d3.selectAll("a")
      .on("mouseover", function(){
          d3.select(this)
            .style("color", "orange");
            // Get current event info
            //console.log(d3.event);
          // Get x & y co-ordinates
          //console.log(d3.mouse(this));
          d3.select(this.parentNode)
            .style("border", "1px solid orange")
      })
      .on("mouseout", function(){
          d3.select(this)
              .style("color", "rgb(253,254,255)")

          d3.select(this.parentNode)
            .style("border", "1px solid #808080");
      });


//-----------------------------------------------------------------------------------------//
//                                    LOAD IMAGE
//---------------------------------------------------------------------------------------

$("#cnn-load-Image").click(function(e){  $(".popup-upload-file-container").toggle("slide");  })

// Get the add new upload link.
$("#upload_file").change(function () {
  var _URL = window.URL || window.webkitURL;
  var file, img;
   if ((file = this.files[0])) {
       img = new Image();
       var objectUrl = _URL.createObjectURL(file);
       img.onload = function () {
           global_image_file_width = this.width ;
           global_image_file_height =  this.height ;

           global_image_file_width_copy = this.width ;
           global_image_file_height_copy =  this.height ;

           _URL.revokeObjectURL(objectUrl);
       };
       img.src = objectUrl;
   }

  var data = new FormData();
  $.each($("#upload_file")[0].files, function(i, file) {
    data.append("file", file);
  });
  data.append("csrfmiddlewaretoken", $(this).attr("data-csrf-token"));

  $.ajax({
    url: "/upload-cnn-files",
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    type: 'post',
    beforeSend: function () {
      // before send, display loading, etc...
    },
    success: function (data) {

            var rdata = JSON.parse(data)

            global_image_red_channel_path = rdata[0]
            global_image_green_channel_path = rdata[1]
            global_image_blue_channel_path = rdata[2]

            files_path = JSON.parse(rdata[3])
            global_images_array = JSON.parse( rdata[4] )

            global_images_grey_scale_array_path = rdata[5]
            global_images_grey_scale_array = JSON.parse( rdata[6])

            global_tile_width = global_tile_width_copy
            global_image_file_width = global_image_file_width_copy
            global_image_file_height = global_image_file_height_copy

            global_tile_width = global_tile_width_copy

          if (files_path.length > 0){
            var elt = $(".upload-image-container")
            $(".upload-image-container").css('border', '1px solid black;')

            $(".upload-image-container").append( $('<div style= width:79%; text-align:center;"><p style="position:absolute; text-align:center; z-index:10;top:-15%;left:-4%; text-align:center;"><button id="zoom-out">Z-</button><button id="zoom-in">Z+</button><button id="display_original_image">img</button><button id="display_red_channel">Red</button><button id="display_green_channel">Green</button><button id="display_blue_channel">Blue</button><button id="reduce_uploaded_image">-</button><button id="close_upload_file">X</button></p><img id="image-upload" static src= "/media/' + files_path[0] +'" style="display:inline-block; border:1px solid blue; position:absolute;" alt="image-ici"></div>'))

            localStorage.setItem('original_image', files_path[0]);
            //localStorage.removeItem('original_image');

            $(".popup-upload-file-container").hide() //hide input file
            //................... Display Pixel ..........................

            const dimensions = [ global_images_array.length, global_images_array[0].length, global_images_array[0][0].length ]; //[276, 182, 3]


            $('.image-channels').css('font-size', '1.4em');
            $('.image-channels').css('left', '15')
            $('.image-channels').css('width', '97%')
            $('.image-channels').css('z-index', '-1')

            $(".upload-image-container img").css('width', global_image_file_width )
            $(".upload-image-container img").css('height', global_image_file_height )

            //var imag_width = $('#image-upload').width() //0
            //var imag_height = $('#image-upload').height() //0
            console.log("dimensiosn: ", dimensions)

            //var global_tile_width = 25;


            var d = global_images_array;
            var offset_x = parseInt(1.25*global_image_file_width)
            var pixel_array = '<ul class="pixel-array-displayed" style="position:absolute; left:'+ offset_x +'px; padding:">'
            for (let i=0; i< dimensions[0]; i += global_tile_width){
              pixel_array += '<li style="list-style-type:none;">'
              for (let j = 0; j< dimensions[1]; j += global_tile_width){

                  var pixel_id = "rgb_" + i + '_' + j
                  pixel_array += '<span class="rgb_class" id="' + pixel_id +'">'
                  colors = ['red', 'green', 'blue']
                  for (let k=0; k< dimensions[2]; k++ ){
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
                  pixel_array += '</span>'

              }//j
              pixel_array += '</li>'
            }
            pixel_array += '</ul>'
            //$('.image-channels').text(JSON.stringify(JSON.stringify(global_images_array)))
            $('.image-channels').html(pixel_array)
            $(".rgb_class").css("font-size", '1.0em');
            //$('.image-channels').text(JSON.stringify(global_images_array[x_prime][y_prime]))


            //.............................................................
        }// if files_path.length > 0

    },
    error: function (err) {
      console.error(err)
      // error handling...
    }
  });

});//end change

//---------------------------------------------------------------------------------------//
//                                    GREY SCALE
//---------------------------------------------------------------------------------------//
$("#cnn-grey-scale").click(function(e){
      e.preventDefault()

      if(!is_grey_scale_image_active){
        is_grey_scale_image_active = true;
        $(".upload-image-container img").attr('src', "/media/" +localStorage.getItem('original_image'))
        //console.log("get local:", "/media/" +localStorage.getItem('original_image'))
        return false;
      }
      $(".upload-image-container img").empty()
      $(".upload-image-container img").attr('src', '/'+global_images_grey_scale_array_path)

        const grey_scale_dimensions = [   global_images_grey_scale_array.length,   global_images_grey_scale_array[0].length,   global_images_grey_scale_array[0][0].length ]; //[276, 182, 2]

        console.log("grey scale: ",grey_scale_dimensions)

      var d = global_images_grey_scale_array;
      var offset_x = parseInt(1.25*global_image_file_width)
      var pixel_array = '<ul class="pixel-array-displayed" style="position:absolute; left:'+ offset_x +'px; padding:">'
      for (let i=0; i< grey_scale_dimensions[0]; i += global_tile_width){
        pixel_array += '<li style="list-style-type:none;">'
        for (let j = 0; j< grey_scale_dimensions[1]; j += global_tile_width){

            var pixel_id = "rgb_" + i + '_' + j
            pixel_array += '<span class="rgb_class" id="' + pixel_id +'">'
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
      $('.image-channels').html(pixel_array)
      $(".rgb_class").css("font-size", '1.0em');
      //is_grey_scale_image_active = false;
})



//--------------------------------------------------------------------------------------//
//                                             DRAW GRID
//---------------------------------------------------------------------------------------

$('#cnn-image-grid').click(function(e){
      e.preventDefault()

      var width = global_image_file_width;// $('#image-upload').width()
      var height = global_image_file_height; //$('#image-upload').height()
      var elt_position = $('#image-upload').position()
      //var global_tile_width = 25

        global_svg_grid = d3.select('.upload-image-container')
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr('id', 'svg_id')
                .on('click', function(){
                  // get x coord
                  var x = d3.event.pageX - document.getElementById('svg_id').getBoundingClientRect().x
                  var y = d3.event.pageY - document.getElementById('svg_id').getBoundingClientRect().y

                    var y_clicked = parseInt(y/global_tile_width)
                    var x_clicked = parseInt(x/global_tile_width)


                    //console.log("xclicked: "+ x_clicked +", yclicked: " + y_clicked)

                    $(".rgb_class").css('font-size', '1.0em')
                    var norm_xclicked = x_clicked * global_tile_width_copy
                    var norm_yclicked = y_clicked * global_tile_width_copy
                    if(global_clicked_pixel){global_clicked_pixel.remove()}

                    draw_pixel(norm_xclicked ,norm_yclicked);

                    $("#rgb_" + norm_yclicked + '_' + norm_xclicked).css('font-size', '4.2em')
                })
                .style('position', 'absolute')

                // Using for loop to draw multiple horizontal lines
         for (var j=elt_position.top ; j <= elt_position.top + height; j=j+global_tile_width) {
            global_svg_grid.append("line")
                 .attr("x1", elt_position.left)
                 .attr("y1", j )
                 .attr("x2", elt_position.left + width)
                 .attr("y2", j)
                 .attr("class", 'lines')
                 .style("stroke", "rgb(128, 0, 128)")
                 .style("stroke-width", 2);

         };

         // Using for loop to draw multiple vertical lines
         for (var j=elt_position.left ; j <= elt_position.left + width ; j=j+global_tile_width) {
             global_svg_grid.append("line")
                 .attr("x1", j)
                 .attr("y1", elt_position.top)
                 .attr("x2", j)
                 .attr("y2", elt_position.left + height)
                .attr("class", 'lines')
                 .style("stroke", "rgb(128, 0, 128)")
                 .style("stroke-width", 2);
         };

         if(global_grid){global_grid = false;}
         else { $(".lines").remove() ; global_grid = true}
         //console.log(s(".rgb_class"))
})//click

//----------------------------------------------------------------------------------------
//                                 DISPLAY RED CHANNEL
//----------------------------------------------------------------------------------------
//$(".upload-image-container").on('click', '#display_red_channel' ,function(e){
$(document).on('click', "#display_red_channel", function (e) {
    e.preventDefault()


    if(global_image_red_channel_path){
      //global_grid = !global_grid

      //channels_images = JSON.parse(channels_images)
      $(".upload-image-container").empty()
      $(".upload-image-container").append( $('<div style=" width:79%;"><p style="position:absolute; z-index:10;top:-15%;left:-4%;"><button id="zoom-out">Z-</button><button id="zoom-in">Z+</button><button id="display_original_image">img</button><button id="display_red_channel">Red</button><button id="display_green_channel">Green</button><button id="display_blue_channel">Blue</button><button id="reduce_uploaded_image">-</button><button id="close_upload_file">X</button></p><img id="image-upload" static src= "/' + global_image_red_channel_path +'" style="display:inline-block; border:1px solid blue; position:absolute;" alt="image-ici"></div>'))

      //....................................
      $(".upload-image-container img").css('width', global_image_file_width )
      $(".upload-image-container img").css('height', global_image_file_height )

      $(".rgb_red_class").show()
      $(".rgb_green_class").hide()
      $(".rgb_blue_class").hide()
      //...................................
      //....................... DRAW GRID IF ACTIVATED PREVIOUSLY .................
      if(global_grid){
        //......................... ReDraw GRID ....................................
        var width = global_image_file_width;// $('#image-upload').width()
        var height = global_image_file_height; //$('#image-upload').height()
        var elt_position = $('#image-upload').position()
        //var global_tile_width = 25

        if (!global_svg_grid){return false;}
        global_svg_grid.remove() //remove d3js grid

        global_svg_grid = d3.select('.upload-image-container') //redraw grid
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .attr('id', 'svg_id')
                  .on('click', function(){
                    // get x coord
                    var x = d3.event.pageX - document.getElementById('svg_id').getBoundingClientRect().x
                    var y = d3.event.pageY - document.getElementById('svg_id').getBoundingClientRect().y

                      var y_clicked = parseInt(y/global_tile_width)
                      var x_clicked = parseInt(x/global_tile_width)


                      $(".rgb_class").css('font-size', '1.0em')
                      var norm_xclicked = x_clicked * global_tile_width_copy
                      var norm_yclicked = y_clicked * global_tile_width_copy

                      $("#rgb_" + norm_yclicked + '_' + norm_xclicked).css('font-size', '4.2em')
                  })
                  .style('position', 'absolute')

                  // Using for loop to draw multiple horizontal lines
           for (var j=elt_position.top ; j <= elt_position.top + height; j=j+global_tile_width) {
               global_svg_grid.append("line")
                   .attr("x1", elt_position.left)
                   .attr("y1", j )
                   .attr("x2", elt_position.left + width)
                   .attr("y2", j)
                   .attr("class", 'lines')
                   .style("stroke", "rgb(128, 0, 128)")
                   .style("stroke-width", 2);

           };

           // Using for loop to draw multiple vertical lines
           for (var j=30 ; j <= elt_position.left + width ; j=j+global_tile_width) {
               global_svg_grid.append("line")
                   .attr("x1", j)
                   .attr("y1", elt_position.top)
                   .attr("x2", j)
                   .attr("y2", elt_position.left + height)
                  .attr("class", 'lines')
                   .style("stroke", "rgb(128, 0, 128)")
                   .style("stroke-width", 2);
           };

      }//if(global_grid)

      return false;
    }
    else {console.error("cannot display red channel")}
})// $("#display_red_channel")

//----------------------------------------------------------------------------------------
//                                 DISPLAY GREEN CHANNEL
//----------------------------------------------------------------------------------------
$(".upload-image-container").on('click', '#display_green_channel' ,function(e){
    e.preventDefault()
        if(global_image_green_channel_path){
          //global_grid = !global_grid

          $(".upload-image-container").empty()
          $(".upload-image-container").append( $('<div style=" width:79%;"><p style="position:absolute; z-index:10;top:-15%;left:-4%;"><button id="zoom-out">Z-</button><button id="zoom-in">Z+</button><button id="display_original_image">img</button><button id="display_red_channel">Red</button><button id="display_green_channel">Green</button><button id="display_blue_channel">Blue</button><button id="reduce_uploaded_image">-</button><button id="close_upload_file">X</button></p><img id="image-upload" static src= "/' + global_image_green_channel_path +'" style="display:inline-block; border:1px solid blue; position:absolute;" alt="image-ici"></div>'))

          //....................................
          $(".upload-image-container img").css('width', global_image_file_width )
          $(".upload-image-container img").css('height', global_image_file_height )

          $(".rgb_green_class").show()
          $(".rgb_red_class").hide()
          $(".rgb_blue_class").hide()
          //...................................
          //....................... DRAW GRID IF ACTIVATED PREVIOUSLY .................
          if(global_grid){
            //......................... ReDraw GRID ....................................
            var width = global_image_file_width;// $('#image-upload').width()
            var height = global_image_file_height; //$('#image-upload').height()
            var elt_position = $('#image-upload').position()
            //var global_tile_width = 25

            if (!global_svg_grid){return false;}
            global_svg_grid.remove() //remove d3js grid

            global_svg_grid = d3.select('.upload-image-container') //redraw grid
                      .append("svg")
                      .attr("width", width)
                      .attr("height", height)
                      .attr('id', 'svg_id')
                      .on('click', function(){
                        // get x coord
                        var x = d3.event.pageX - document.getElementById('svg_id').getBoundingClientRect().x
                        var y = d3.event.pageY - document.getElementById('svg_id').getBoundingClientRect().y

                          var y_clicked = parseInt(y/global_tile_width)
                          var x_clicked = parseInt(x/global_tile_width)


                          $(".rgb_class").css('font-size', '1.0em')
                          var norm_xclicked = x_clicked * global_tile_width_copy
                          var norm_yclicked = y_clicked * global_tile_width_copy

                          $("#rgb_" + norm_yclicked + '_' + norm_xclicked).css('font-size', '4.2em')
                      })
                      .style('position', 'absolute')

                      // Using for loop to draw multiple horizontal lines
               for (var j=elt_position.top ; j <= elt_position.top + height; j=j+global_tile_width) {
                   global_svg_grid.append("line")
                       .attr("x1", elt_position.left)
                       .attr("y1", j )
                       .attr("x2", elt_position.left + width)
                       .attr("y2", j)
                       .attr("class", 'lines')
                       .style("stroke", "rgb(128, 0, 128)")
                       .style("stroke-width", 2);

               };

               // Using for loop to draw multiple vertical lines
               for (var j=30 ; j <= elt_position.left + width ; j=j+global_tile_width) {
                   global_svg_grid.append("line")
                       .attr("x1", j)
                       .attr("y1", elt_position.top)
                       .attr("x2", j)
                       .attr("y2", elt_position.left + height)
                      .attr("class", 'lines')
                       .style("stroke", "rgb(128, 0, 128)")
                       .style("stroke-width", 2);
               };

          }//if(global_grid)
          return false;
        }
        else {console.error("cannot display green channel")}


})// $("#display_red_channel")

//----------------------------------------------------------------------------------------
//                                 DISPLAY BLUE CHANNEL
//----------------------------------------------------------------------------------------
$(".upload-image-container").on('click', '#display_blue_channel' ,function(e){
    e.preventDefault()


    if(global_image_blue_channel_path){

        //global_grid = !global_grid

      $(".upload-image-container").empty()
      $(".upload-image-container").append( $('<div style=" width:79%;"><p style="position:absolute; z-index:10;top:-15%;left:-4%;"><button id="zoom-out">Z-</button><button id="zoom-in">Z+</button><button id="display_original_image">img</button><button id="display_red_channel">Red</button><button id="display_green_channel">Green</button><button id="display_blue_channel">Blue</button><button id="reduce_uploaded_image">-</button><button id="close_upload_file">X</button></p><img id="image-upload" static src= "/' + global_image_blue_channel_path +'" style="display:inline-block; border:1px solid blue; position:absolute;" alt="image-ici"></div>'))

      //....................................
      $(".upload-image-container img").css('width', global_image_file_width )
      $(".upload-image-container img").css('height', global_image_file_height )

      $(".rgb_blue_class").show()
      $(".rgb_green_class").hide()
      $(".rgb_red_class").hide()
      //...................................
      //....................... DRAW GRID IF ACTIVATED PREVIOUSLY .................
      if(global_grid){
        //......................... ReDraw GRID ....................................
        var width = global_image_file_width;// $('#image-upload').width()
        var height = global_image_file_height; //$('#image-upload').height()
        var elt_position = $('#image-upload').position()
        //var global_tile_width = 25

        if (!global_svg_grid){return false;}
        global_svg_grid.remove() //remove d3js grid

        global_svg_grid = d3.select('.upload-image-container') //redraw grid
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .attr('id', 'svg_id')
                  .on('click', function(){
                    // get x coord
                    var x = d3.event.pageX - document.getElementById('svg_id').getBoundingClientRect().x
                    var y = d3.event.pageY - document.getElementById('svg_id').getBoundingClientRect().y

                      var y_clicked = parseInt(y/global_tile_width)
                      var x_clicked = parseInt(x/global_tile_width)


                      $(".rgb_class").css('font-size', '1.0em')
                      var norm_xclicked = x_clicked * global_tile_width_copy
                      var norm_yclicked = y_clicked * global_tile_width_copy

                      $("#rgb_" + norm_yclicked + '_' + norm_xclicked).css('font-size', '4.2em')
                  })
                  .style('position', 'absolute')

                  // Using for loop to draw multiple horizontal lines
           for (var j=elt_position.top ; j <= elt_position.top + height; j=j+global_tile_width) {
               global_svg_grid.append("line")
                   .attr("x1", elt_position.left)
                   .attr("y1", j )
                   .attr("x2", elt_position.left + width)
                   .attr("y2", j)
                   .attr("class", 'lines')
                   .style("stroke", "rgb(128, 0, 128)")
                   .style("stroke-width", 2);

           };

           // Using for loop to draw multiple vertical lines
           for (var j=30 ; j <= elt_position.left + width ; j=j+global_tile_width) {
               global_svg_grid.append("line")
                   .attr("x1", j)
                   .attr("y1", elt_position.top)
                   .attr("x2", j)
                   .attr("y2", elt_position.left + height)
                  .attr("class", 'lines')
                   .style("stroke", "rgb(128, 0, 128)")
                   .style("stroke-width", 2);
           };

      }//if(global_grid)

      return false;
    }else {console.error("cannot display blue channel")}

})// $("#display_red_channel")

//----------------------------------------------------------------------------------------
//                                 DISPLAY ORIGINAL IMAGE
//----------------------------------------------------------------------------------------
$(".upload-image-container").on('click', '#display_original_image' ,function(e){
    e.preventDefault()
    original_image =  localStorage.getItem('original_image');
    //global_grid = !global_grid
    is_grey_scale_image_active = false;

    $(".upload-image-container").empty()
    $(".upload-image-container").empty()
    $(".upload-image-container").append( $('<div  width:79%;"><p style="position:absolute; z-index:10;top:-15%;left:-4%;"><button id="zoom-out">Z-</button><button id="zoom-in">Z+</button><button id="display_original_image">img</button><button id="display_red_channel">Red</button><button id="display_green_channel">Green</button><button id="display_blue_channel">Blue</button><button id="reduce_uploaded_image">-</button><button id="close_upload_file">X</button></p><img id="image-upload" static src= "/media/' + original_image +'" style="display:inline-block; border:1px solid blue; position:absolute;" alt="image-ici"></div>'))


    $(".rgb_red_class").show()
    $(".rgb_green_class").show()
    $(".rgb_blue_class").show()

  //...................... DRAW GRID IF ACTIVATED PREVIOUSLY .................
    if(!global_grid){

      //......................... ReDraw GRID ....................................
      global_image_file_width = global_image_file_width_copy;
      global_image_file_height = global_image_file_height_copy;
      global_tile_width = global_tile_width_copy;

      var width = global_image_file_width_copy;// $('#image-upload').width()
      var height = global_image_file_height_copy; //$('#image-upload').height()

      var elt_position = $('#image-upload').position()
      //var global_tile_width = 25

      if (!global_svg_grid){return false;}
      global_svg_grid.remove() //remove d3js grid

      global_svg_grid = d3.select('.upload-image-container') //redraw grid
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr('id', 'svg_id')
                .on('click', function(){
                  // get x coord
                  var x = d3.event.pageX - document.getElementById('svg_id').getBoundingClientRect().x
                  var y = d3.event.pageY - document.getElementById('svg_id').getBoundingClientRect().y

                    var y_clicked = parseInt(y/global_tile_width)
                    var x_clicked = parseInt(x/global_tile_width)


                    $(".rgb_class").css('font-size', '1.0em')
                    var norm_xclicked = x_clicked * global_tile_width_copy
                    var norm_yclicked = y_clicked * global_tile_width_copy

                    $("#rgb_" + norm_yclicked + '_' + norm_xclicked).css('font-size', '4.2em')
                })
                .style('position', 'absolute')

                // Using for loop to draw multiple horizontal lines
         for (var j=elt_position.top ; j <= elt_position.top + height; j=j+global_tile_width) {
             global_svg_grid.append("line")
                 .attr("x1", elt_position.left)
                 .attr("y1", j )
                 .attr("x2", elt_position.left + width)
                 .attr("y2", j)
                 .attr("class", 'lines')
                 .style("stroke", "rgb(128, 0, 128)")
                 .style("stroke-width", 2);

         };

         // Using for loop to draw multiple vertical lines
         for (var j=30 ; j <= elt_position.left + width ; j=j+global_tile_width) {
             global_svg_grid.append("line")
                 .attr("x1", j)
                 .attr("y1", elt_position.top)
                 .attr("x2", j)
                 .attr("y2", elt_position.left + height)
                .attr("class", 'lines')
                 .style("stroke", "rgb(128, 0, 128)")
                 .style("stroke-width", 2);
         };

    }//if(global_grid)
    //if(global_grid){global_grid = false;}
    //else { $(".lines").remove() ; global_grid = true}

    return false

})// $("#display_red_channel")


//----------------------------------------------------------------------------------------//
//                                  BUILD KERNEL
//--------------------------------------------------------------------------------------------

$("#build_kernel").click(function( e ){

    e.preventDefault()
    //var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    var uploded_image_url =   $(".upload-image-container img").attr('src')
    console.log(uploded_image_url)
    if ( ! uploded_image_url) {console.error("Please, upload image before")}

    //$('.image-channels .pixel-array-displayed').css({"background-color": "yellow", "font-size": "30%"});
    // get x coord
    if(  $("#myForm").css("display") == 'block'  ){
         $("#myForm").css("display", "none")
    } else {  $("#myForm").css("display", "block")  }

    return false;


})//end click

//---------------------------------------------------------------------------------------
//                                CONVOLUTION
//--------------------------------------------------------------------------------------
$("#convolution").click (function(evt){
    evt.preventDefault()
    console.log("convolution")

    var num_row = parseInt(global_image_file_height/global_tile_width)
    var num_col = parseInt(global_image_file_width/global_tile_width)

    var x_top_left = global_image_xtop_left
    var y_top_left = global_image_ytop_left

    var xx_top_left = global_image_xtop_left
    var yy_top_left = global_image_ytop_left

    var row = 0;
    var col = 0;

    function processData(another_kernel, callback){

    var inte = setInterval(() => {
        x_top_left = xx_top_left + col * global_tile_width
        y_top_left = yy_top_left + row * global_tile_width

        if(global_kernel_shape){global_kernel_shape.remove()}
        //console.log("row: "+row +" ,col: "+col);
        draw_kernel(x_top_left, y_top_left, kernel_array)
        col += 1;

        if(col > num_col - 3){ row = row + 1; col = 0; x_top_left = xx_top_left; y_top_left=yy_top_left + row*global_tile_width }
        if(row > num_row-3){

          if(typeof callback == "function"){
            callback()
          }
          clearInterval(inte);

        }



    }, 150)}

    processData(kernel_array, () => {
        $(".convolution_image_container img").remove()

        var conv_margin_top = parseInt( 1.7*global_image_file_height + 20)
        $(".convolution_image_container").css({
          'position' : 'absolute' ,
          'top': conv_margin_top,
          'left': '6%'
        })

        $(".convolution_image_container").append( $('<div  width:79%;"><p style="position:absolute; z-index:15;top:-25%;left:-4%;"><img id="image-upload" static src= "/' + global_kernel_file +'" style="display:inline-block; border:1px solid blue; position:absolute; top:' + conv_margin_top  + 'left:' + global_image_xtop_left +'" alt="image-ici"></div>'))
    })



    $.ajax({
      url: "/cnn-convolution-kernel",
      data: { "kernel_array": global_user_input_kernel },
      type: 'post',
      success: function (data) {
          data = JSON.parse(data)

          global_kernel_file = data[0]
          global_kernel_array = data[1]
      },
      errr: function(err) {  console.error(err)  }
  })//$.ajax

})//$ on click  */


//----------------------------------------------------------------------------------------------
//                                CLOSE UPLOADED FILES  DIV
//-----------------------------------------------------------------------------------------------
$(".upload-image-container").on('click', '#close_upload_file', function(evt){
    $(".upload-image-container").empty()
    $(".upload-image-container").remove()
})


//----------------------------------------------------------------------------------------------
//                                REDUCE UPLOADED FILES  DIV
//-----------------------------------------------------------------------------------------------
$(".upload-image-container").on('click', '#reduce_uploaded_image', function(evt){
      evt.preventDefault()

      if(!global_reduce_uploaded_image){
          $("#image-upload").css('height', '0.1%')
          $("#image-upload").css('width', '27%')
          $("#image-upload").css('top', '7%')
          $("#image-upload").css('left', '3%')
          global_reduce_uploaded_image = true
      } else {
        original_image =  localStorage.getItem('original_image');
        $(".upload-image-container").empty()
        $(".upload-image-container").empty()
        $(".upload-image-container").append( $('<div style=" width:79%;"><p style="position:absolute; z-index:10;top:-15%;left:-4%;"><button id="display_original_image">img</button><button id="display_red_channel">Red</button><button id="display_green_channel">Green</button><button id="display_blue_channel">Blue</button><button id="reduce_uploaded_image">-</button><button id="close_upload_file">X</button></p><img id="image-upload" static src= "/media/' + original_image +'" style="display:inline-block; border:1px solid blue; position:absolute;" alt="image-ici"></div>'))

          global_reduce_uploaded_image = false
      }
})

//--------------------------------------------------------------------------------------------//
//                                 ZOOM - IN / OUT
//--------------------------------------------------------------------------------------------//
$(".upload-image-container").on('click', '#zoom-in', function(evt){
    evt.preventDefault()

    console.log(" ........ zoom - IN ............")
    global_image_file_width = 1.1*global_image_file_width
    global_image_file_height = 1.1*global_image_file_height

    $(".upload-image-container img").css('width', global_image_file_width )
    $(".upload-image-container img").css('height', global_image_file_height )
    global_tile_width = global_tile_width * 1.1

    //................... Display Data array ..........................
    //$('.image-channels').empty()
    const dimensions = [ global_images_array.length, global_images_array[0].length, global_images_array[0][0].length ]; //[276, 182, 3]


    $('.image-channels').css('font-size', '1.4em');
    $('.image-channels').css('left', '15')
    $('.image-channels').css('width', '97%')
    $('.image-channels').css('z-index', '-1')

    //var imag_width = $('#image-upload').width() //0
    //var imag_height = $('#image-upload').height() //0
    console.log("dimensiosn: ", dimensions)

    //var global_tile_width = 25;

    if(is_grey_scale_image_active){

      $(".upload-image-container img").empty()
      $(".upload-image-container img").attr('src', '/'+global_images_grey_scale_array_path)

      var  grey_scale_dimensions = []
        if(global_images_grey_scale_array[0][0]){
               grey_scale_dimensions = [   global_images_grey_scale_array.length,   global_images_grey_scale_array[0].length ]; //[276, 182, 2]
        }
        else{
         grey_scale_dimensions = [   global_images_grey_scale_array.length,   global_images_grey_scale_array[0].length,   global_images_grey_scale_array[0][0].length ];} //[276, 182, 2]

        console.log("grey scale: ",grey_scale_dimensions)

      var d = global_images_grey_scale_array;
      var offset_x = parseInt(1.25*global_image_file_width)
      var pixel_array = '<ul class="pixel-array-displayed" style="position:absolute; left:'+ offset_x +'px; padding:">'
      for (let i=0; i< grey_scale_dimensions[0]; i += global_tile_width){
        pixel_array += '<li style="list-style-type:none;">'
        for (let j = 0; j< grey_scale_dimensions[1]; j += global_tile_width){

            var pixel_id = "rgb_" + i + '_' + j
            pixel_array += '<span class="rgb_class" id="' + pixel_id +'">'
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
          if(d[i] && d[i][j]){
          var dd = d[i][j];
          if(dd < 100 ){ dd = "&nbsp;&nbsp;" + dd}
          pixel_array += '<span class="rgb_red_class" style="color:rgb(120, 121, 128); list-style-type:none;">'+ dd  +',</span>'}
        }//else
            pixel_array += '</span>'

        }//for let j
        pixel_array += '</li>'
      }//for let i
      pixel_array += '</ul>'
      //$('.image-channels').text(JSON.stringify(JSON.stringify(global_images_array)))
      $('.image-channels').html(pixel_array)
      $(".rgb_class").css("font-size", '1.0em');
      return false;
    }


    var d = global_images_array;

    var offset_x = parseInt(1.25*global_image_file_width)
    var pixel_array = '<ul class="pixel-array-displayed" style="position:absolute; left:'+ offset_x +'px; padding:">'
    for (let i=0; i< dimensions[0]; i += global_tile_width_copy){
      pixel_array += '<li style="list-style-type:none;">'
      for (let j = 0; j< dimensions[1]; j += global_tile_width_copy){

          var pixel_id = "rgb_" + i + '_' + j
          pixel_array += '<span class="rgb_class" id="' + pixel_id +'">'
          colors = ['red', 'green', 'blue']
          for (let k=0; k< dimensions[2]; k++ ){
            if(typeof d[i] === 'undefined' || typeof d[i][j] === 'undefined') {
                break;
            }
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
          pixel_array += '</span>'

      }//j
      pixel_array += '</li>'
    }
    pixel_array += '</ul>'
    //$('.image-channels').text(JSON.stringify(JSON.stringify(global_images_array)))
    $('.image-channels').html(pixel_array)
    $(".rgb_class").css("font-size", '1.0em');
    //$('.image-channels').text(JSON.stringify(global_images_array[x_prime][y_prime]))


    //......................... ReDraw GRID ....................................
    var width = global_image_file_width;// $('#image-upload').width()
    var height = global_image_file_height; //$('#image-upload').height()
    var elt_position = $('#image-upload').position()
    //var global_tile_width = 25

    if (!global_svg_grid){return false;}
    global_svg_grid.remove() //remove d3js grid

    global_svg_grid = d3.select('.upload-image-container') //redraw grid
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .attr('id', 'svg_id')
              .on('click', function(){
                // get x coord
                global_image_xtop_left = d3.event.pageX - document.getElementById('svg_id').getBoundingClientRect().x

                global_image_ytop_left = d3.event.pageY - document.getElementById('svg_id').getBoundingClientRect().y

                  var y_clicked = parseInt(  global_image_ytop_left/global_tile_width)
                  var x_clicked = parseInt(  global_image_xtop_left/global_tile_width)


                  $(".rgb_class").css('font-size', '1.0em')
                  var norm_xclicked = x_clicked * global_tile_width
                  var norm_yclicked = y_clicked * global_tile_width

                  $("#rgb_" + norm_yclicked + '_' + norm_xclicked).css('font-size', '4.2em')
              })
              .style('position', 'absolute')

              // Using for loop to draw multiple horizontal lines
       for (var j=elt_position.top ; j <= elt_position.top + height; j=j+global_tile_width) {
           global_svg_grid.append("line")
               .attr("x1", elt_position.left)
               .attr("y1", j )
               .attr("x2", elt_position.left + width)
               .attr("y2", j)
               .attr("class", 'lines')
               .style("stroke", "rgb(128, 0, 128)")
               .style("stroke-width", 2);

       };

       // Using for loop to draw multiple vertical lines
       for (var j=30 ; j <= elt_position.left + width ; j=j+global_tile_width) {
           global_svg_grid.append("line")
               .attr("x1", j)
               .attr("y1", elt_position.top)
               .attr("x2", j)
               .attr("y2", elt_position.left + height)
              .attr("class", 'lines')
               .style("stroke", "rgb(128, 0, 128)")
               .style("stroke-width", 2);
       };

       //if(global_grid){global_grid = false;}
       //else { $(".lines").remove() ; global_grid = true}
})


$(".upload-image-container").on('click', '#zoom-out', function(evt){
    evt.preventDefault()

    console.log(" ...... zoom - OUT ...........")
    global_image_file_width = global_image_file_width / 1.1
    global_image_file_height = global_image_file_height / 1.1

    $(".upload-image-container img").css('width', global_image_file_width )
    $(".upload-image-container img").css('height', global_image_file_height )
    global_tile_width = global_tile_width / global_zoom_in

    if(is_grey_scale_image_active){

      $(".upload-image-container img").empty()
      $(".upload-image-container img").attr('src', '/'+global_images_grey_scale_array_path)

        const grey_scale_dimensions = [   global_images_grey_scale_array.length,   global_images_grey_scale_array[0].length,   global_images_grey_scale_array[0][0].length ]; //[276, 182, 2]

        console.log("grey scale: ",grey_scale_dimensions)

      var d = global_images_grey_scale_array;
      var offset_x = parseInt(1.25*global_image_file_width)
      var pixel_array = '<ul class="pixel-array-displayed" style="position:absolute; left:'+ offset_x +'px; padding:">'
      for (let i=0; i< grey_scale_dimensions[0]; i += global_tile_width){
        pixel_array += '<li style="list-style-type:none;">'
        for (let j = 0; j< grey_scale_dimensions[1]; j += global_tile_width){

            var pixel_id = "rgb_" + i + '_' + j
            pixel_array += '<span class="rgb_class" id="' + pixel_id +'">'
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
      $('.image-channels').html(pixel_array)
      $(".rgb_class").css("font-size", '1.0em');
      return false;
    }


    //................... Display Data array ..........................
    //$('.image-channels').empty()
    const dimensions = [ global_images_array.length, global_images_array[0].length, global_images_array[0][0].length ]; //[276, 182, 3]


    $('.image-channels').css('font-size', '1.4em');
    $('.image-channels').css('left', '15')
    $('.image-channels').css('width', '97%')
    $('.image-channels').css('z-index', '-1')

    //var imag_width = $('#image-upload').width() //0
    //var imag_height = $('#image-upload').height() //0
    //console.log("dimensiosn: ", dimensions)

    //var global_tile_width = 25;


    var d = global_images_array;

    var offset_x = parseInt(1.25*global_image_file_width)
    var pixel_array = '<ul class="pixel-array-displayed" style="position:absolute; left:'+ offset_x +'px; padding:">'
    for (let i=0; i< dimensions[0]; i += global_tile_width_copy){
      pixel_array += '<li style="list-style-type:none;">'
      for (let j = 0; j< dimensions[1]; j += global_tile_width_copy){

          var pixel_id = "rgb_" + i + '_' + j
          pixel_array += '<span class="rgb_class" id="' + pixel_id +'">'
          colors = ['red', 'green', 'blue']
          for (let k=0; k< dimensions[2]; k++ ){
            if(typeof d[i] === 'undefined' || typeof d[i][j] === 'undefined') {
                break;
            }
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
          pixel_array += '</span>'

      }//j
      pixel_array += '</li>'
    }
    pixel_array += '</ul>'
    //$('.image-channels').text(JSON.stringify(JSON.stringify(global_images_array)))
    $('.image-channels').html(pixel_array)
    $(".rgb_class").css("font-size", '1.0em');
    //$('.image-channels').text(JSON.stringify(global_images_array[x_prime][y_prime]))


    //......................... ReDraw GRID ....................................
    var width = global_image_file_width;// $('#image-upload').width()
    var height = global_image_file_height; //$('#image-upload').height()
    var elt_position = $('#image-upload').position()
    //var global_tile_width = 25

    if (!global_svg_grid){return false;}
    global_svg_grid.remove() //remove d3js grid

    global_svg_grid = d3.select('.upload-image-container') //redraw grid
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .attr('id', 'svg_id')
              .on('click', function(){
                // get x coord
                var x = d3.event.pageX - document.getElementById('svg_id').getBoundingClientRect().x
                var y = d3.event.pageY - document.getElementById('svg_id').getBoundingClientRect().y

                  var y_clicked = parseInt(y/global_tile_width)
                  var x_clicked = parseInt(x/global_tile_width)


                  $(".rgb_class").css('font-size', '1.0em')
                  var norm_xclicked = x_clicked * global_tile_width
                  var norm_yclicked = y_clicked * global_tile_width

                  $("#rgb_" + norm_yclicked + '_' + norm_xclicked).css('font-size', '4.2em')
              })
              .style('position', 'absolute')

              // Using for loop to draw multiple horizontal lines
       for (var j=elt_position.top ; j <= elt_position.top + height; j=j+global_tile_width) {
           global_svg_grid.append("line")
               .attr("x1", elt_position.left)
               .attr("y1", j )
               .attr("x2", elt_position.left + width)
               .attr("y2", j)
               .attr("class", 'lines')
               .style("stroke", "rgb(128, 0, 128)")
               .style("stroke-width", 2);

       };

       // Using for loop to draw multiple vertical lines
       for (var j=30 ; j <= elt_position.left + width ; j=j+global_tile_width) {
           global_svg_grid.append("line")
               .attr("x1", j)
               .attr("y1", elt_position.top)
               .attr("x2", j)
               .attr("y2", elt_position.left + height)
              .attr("class", 'lines')
               .style("stroke", "rgb(128, 0, 128)")
               .style("stroke-width", 2);
       };

       //if(global_grid){global_grid = false;}
       //else { $(".lines").remove() ; global_grid = true}
})


//---------------------------------------------------------------------------------------//
//
//                                    MAX POOLING
//---------------------------------------------------------------------------------------/
$("#max-pooling").click(function(e){
      e.preventDefault()
      console.log("max pooling")

      $.ajax({
        url: "/max-poll-cnn-files",
        data: {'kernel_file': global_kernel_file},
        cache: false,
        contentType: false,
        processData: false,
        type: 'post',
        success: function (data) {
          var rdata = JSON.parse(data)
          //console.log(data)
            $(".upload-image-container img").empty()
            $(".upload-image-container img").attr('src', '/'+rdata[0])
        },
        error: function(err){console.log(err)}
      })
})


//---------------------------------------------------------------------------------------//
//
//                                    FULLY CONNECTED
//---------------------------------------------------------------------------------------/
$("#fully-conn").click(function(e){
      e.preventDefault()
      console.log("fully connected")

      $.ajax({
        url: "/fully-conn-cnn",
        data: {'kernel_file': "ok"},
        cache: false,
        contentType: false,
        processData: false,
        type: 'post',
        success: function (data) {
          var rdata = JSON.parse(data)
          //console.log(data)
            $(".upload-image-container img").empty()
            $(".upload-image-container img").attr('src', '/'+rdata[0])
        },
        error: function(err){console.log(err)}
      })
})


//---------------------------------------------------------------------------------------//
//
//                                    TRAINING MODEL
//---------------------------------------------------------------------------------------/
$("#training-cnn").click(function(e){
      e.preventDefault()
      console.log("ftrainning-model")

      $.ajax({
        url: "/trainning-cnn",
        data: {'kernel_file': "ok"},
        cache: false,
        contentType: false,
        processData: false,
        type: 'post',
        success: function (data) {
          var rdata = JSON.parse(data)
          //console.log(data)
            $(".upload-image-container img").empty()
            $(".upload-image-container img").attr('src', '/'+rdata[0])
        },
        error: function(err){console.log(err)}
      })
})


//---------------------------------------------------------------------------------------//
//
//                                    PREDICTION
//---------------------------------------------------------------------------------------/
$("#predict-cnn").click(function(e){
      e.preventDefault()
      console.log("ftrainning-model")

      $.ajax({
        url: "/trainning-cnn",
        data: {'kernel_file': "ok"},
        cache: false,
        contentType: false,
        processData: false,
        type: 'post',
        success: function (data) {
          var rdata = JSON.parse(data)
          //console.log(data)
            $(".upload-image-container img").empty()
            $(".upload-image-container img").attr('src', '/'+rdata[0])
        },
        error: function(err){console.log(err)}
      })
})

//---------------------------------------------------------------------------------------
//                          POPUP KERNEL
//---------------------------------------------------------------------------------------
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
                draw_kernel(  global_image_xtop_left ,   global_image_ytop_left ,kernel_array)
                global_kernel_shape_show = false
             } else {
               draw_kernel(  global_image_xtop_left ,   global_image_ytop_left ,global_user_input_kernel)
                  global_kernel_shape.remove()
                  global_kernel_shape_show = true;
              }

      }
      if(  e.target.name == 'reset-filter') {
         $(this).remove()
         //$(this).hide()
      }
})

$(".form-container input[name='reset-filter']").on('click', function(e){
      e.preventDefault()
      alert("second child")
})

//----------------------------------------------------------------------------------------
//                                            FUNCTIONS - UTILS
//-----------------------------------------------------------------------------------------
function draw_pixel(x_top_left, y_top_left){

      global_clicked_pixel = global_svg_grid.append("rect")
      .attr("x", x_top_left)
      .attr("y", y_top_left)
      .attr("width", global_tile_width)
      .attr("height", global_tile_width)
      .attr("fill", "rgba(128, 128, 128, 0.4)")
}

function draw_kernel(x_top_left, y_top_left, kernel_data){

  var data_obj = [
    [{x:x_top_left, y: y_top_left, t:kernel_data[0][0]}, {x:x_top_left + global_tile_width, y: y_top_left, t:kernel_data[0][1]}, {x:x_top_left + 2*global_tile_width, y: y_top_left, t:kernel_data[0][2]}],

    [{x:x_top_left, y: y_top_left + global_tile_width, t:kernel_data[1][0]}, {x:x_top_left + global_tile_width, y: y_top_left + global_tile_width, t:kernel_data[1][1]}, {x:x_top_left + 2*global_tile_width, y: y_top_left + global_tile_width, t:kernel_data[1][2]}],

    [{x:x_top_left, y: y_top_left + 2*global_tile_width, t:kernel_data[2][0]}, {x:x_top_left + global_tile_width, y: y_top_left + 2*global_tile_width, t:kernel_data[2][1]}, {x:x_top_left + 2*global_tile_width, y: y_top_left + 2*global_tile_width, t:kernel_data[2][2]}]
  ]

  var num_row = parseInt(global_image_file_height/global_tile_width)
  var num_col = parseInt(global_image_file_width/global_tile_width)

  global_kernel_shape = d3.select('.upload-image-container')
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
  .style("stroke-width", 4)

  var texts = global_kernel_shape.selectAll('text')
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
  })

}

//------------------------------------------------------------------------------------------//
//                                            END END
//-----------------------------------------------------------------------------------------
//LIBRAY  3D





})//$ document ready
