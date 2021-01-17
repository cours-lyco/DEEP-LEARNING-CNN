$(
  function(){
    window.global_toggle_upload_div = false

    window.global_uploaded_image_data = []
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
    window.global_tile_width_copy = 30

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

    window.global_max_pooling_array = null;

    window.global_max_poll_flatten_array = []
  }
)
