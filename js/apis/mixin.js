module.exports = {
  "ajax":function(){
    var options;
    if (arguments[1]) {
      options = arguments[1];
      options.url = arguments[0];
    } else
      options = arguments[0];

    // Replace error handler with custom handler
    if (options.error) {
      var original = options.error;
      options.error = function(jqXHR,status,error){
        if (jqXHR.status >= 500)
          alert("A unexpected problem has occured.");
        original.call(this, jqXHR, status, (jqXHR.responseJSON) ? jqXHR.responseJSON : new Error(error));
      };
    }
    // Call jQuery ajax
    $.ajax(options);
  }
};
