$(
  function(){

    //.........................................................................
    //                  ON CLICK A  MENU
    //.........................................................................
    $("a").click(function(e){
      e.preventDefault()
      $("a").css({
        "background-position": "bottom",
        "color": "#ffffff;"
      })

       $(this).css({
         "background-position": "top",
     	   "color": "#ffffff;"
       })

       var anchor_text = $(this).text();
       var tag_content = "Upload file";

      var isEqual = anchor_text.localeCompare(tag_content)
      if(!isEqual){
          if (!global_toggle_upload_div){
            $("#fileuploader").css("visibility", "visible")
            global_toggle_upload_div = true;
          } else {
            $(".fileupload-container").css("visibility", "hidden");
            $("#fileuploader").css("visibility", "hidden")
            global_toggle_upload_div = false;
          }
          $(".ajax-file-upload-preview").css("border", "5px solid red");

      }//!isEqual

    })//$("a").click(function(e){

      $("")
    //................. end jquery
})
