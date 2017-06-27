
document.addEventListener("DOMContentLoaded", function() {
    window.onkeydown = function(event) {
        if ((event.ctrlKey || event.metaKey) && event.keyCode == 70) {
            //alert('hi');
            event.preventDefault();
            $("#searchbox").show().select().focus();
            setTimeout(function(){
                $("#searchbox2").show().select().focus();
            }, 10);
            return;
        } 
    };
    
    $("#searchbox").keydown(function(event) {
        if ((event.ctrlKey || event.metaKey) && event.keyCode == 70) {
            //alert('bye');    
            event.preventDefault();
            $("#searchbox").show().select().focus();
            return false;
        }
    });
});  
