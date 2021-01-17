$(
  function(){
    //.........................................................................
    //                  UPLOAD FILE
    //.........................................................................
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
             "grey_scale_img_path": rdata[5],
             "grey_scale_array": JSON.parse(rdata[6])
         }
          global_uploaded_image_data.push(obj);
var svg = d3.select("body").append("svg")
          .attr("width", 1000)
          .attr("height", 1200)

var defs = svg.append('svg:defs');

    obj_index = global_uploaded_image_data.indexOf(obj);
console.log("obj_index: ", obj_index)
  defs.append("svg:pattern")
    .attr("id", "grump_avatar" + obj_index)
    .attr("width", 300)
    .attr("height", 450)
    .attr("patternUnits", "userSpaceOnUse")
    .append("svg:image")
    .attr("xlink:href", "/media/" + obj['img_file_path'])
    .attr("width", 300)
    .attr("height", 450)
    .attr("x", 50)
    .attr("y", 50);

    var rect = svg.append('rect')
              .attr("transform", "translate(" + 0 + "," + 30 + ")")
              .attr("x", 50)
              .attr("y", 50)
              .attr("width", 300)
              .attr("height", 450)
              .style("fill", "#fff")
              .style("fill", "url(#grump_avatar" + obj_index + ")")
              .style("border", "4px solid purple")

          // Adding a row inside the tbody.
          //console.log(global_uploaded_image_data)
          /*$('#tbody').append(`<tr id="R${global_uploaded_image_data.length}">
          <td class="row-index text-center">
                <p>${global_uploaded_image_data.length}</p>
          </td>
          <td> <a href='#'><img style="display:inline-block;width:250px; height:350px; text-align:center;" src="/media/${global_uploaded_image_data[-1 + global_uploaded_image_data.length]['img_file_path']}"></a>
          </td>
           <td class="text-center">
            <button class="btn btn-danger remove"
                type="button">Remove</button>
            </td>
           </tr>`); */



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

        /* $(".upload-image-container").append( $('<div style= width:79%; text-align:center;"><p style="position:absolute; text-align:center; z-index:10;top:-15%;left:-4%; text-align:center;"><button id="zoom-out">Z-</button><button id="zoom-in">Z+</button><button id="display_original_image">img</button><button id="display_red_channel">Red</button><button id="display_green_channel">Green</button><button id="display_blue_channel">Blue</button><button id="reduce_uploaded_image">-</button><button id="close_upload_file">X</button></p><img id="image-upload" static src= "/media/' + files_path[0] +'" style="display:inline-block; border:1px solid blue; position:absolute;" alt="image-ici"></div>'))  */

         localStorage.setItem('original_image', files_path[0]);
         //localStorage.removeItem('original_image');

         //$(".popup-upload-file-container").hide() //hide input file
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
         //console.log("dimensiosn: ", dimensions)

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
        }// if files_path.length > 0
      },//onSuccess

       onError: function (files, status, message,pd) {},

       onCancel: function(files,pd) {},

       downloadCallback:false,

       deleteCallback: false,

       afterUploadAll: false,

       uploadButtonClass: "ajax-file-upload",

       dragDropStr: "<span><b>Drag &amp; Drop Files</b></span>",

       abortStr: "Abort",

       cancelStr: "Cancel",

       deletelStr: "Delete",

       doneStr: "Done",

       multiDragErrorStr: "Multiple File Drag &amp; Drop is not allowed.",

       extErrorStr: "is not allowed. Allowed extensions: ",

       sizeErrorStr: "is not allowed. Allowed Max size: ",

       uploadErrorStr: "Upload is not allowed",

       maxFileCountErrorStr: " is not allowed. Maximum allowed files are:",

       downloadStr:"Download",

       showQueueDiv:false,

       statusBarWidth:500,

       dragdropWidth:500

  });



    $("#cnn-load-Image").click(function(e){
      e.preventDefault()
      $(".popup-upload-file-container").toggle("slide");

    })

    // Get the add new upload link.
    //$("#upload_file").change(function () {
      $(".popup-upload-file-container button").click(function(e){
        console.log("you select")
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


    //................. end jquery
})
