function add(item) {
  var xhttp = new XMLHttpRequest();
  var drink = item.id;
  
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      
    }
  };
  
  xhttp.open("POST", "/add", true);
  xhttp.setRequestHeader("Content-Type", "application/json")
  xhttp.send(JSON.stringify({"drink": drink}));
}