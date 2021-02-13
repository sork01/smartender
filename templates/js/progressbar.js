function pour(item, hard) {
  var xhttp = new XMLHttpRequest();
  var drink = item.id;
  var tar = ""
  var mode = hard
  if (mode == "hard") {
      tar = "/pourhard"
  } else {
      tar = "/pour"
  }
  if (drink == "random") {
    animateRandom(hard);
    return;
  }
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var obj = JSON.parse(this.responseText)
      update(obj.duration, obj.name, obj.ingredients)
    }
  };
  xhttp.open("POST", tar, true);
  xhttp.setRequestHeader("Content-Type", "application/json")
  xhttp.send(JSON.stringify({"drink": drink}));
}

function animateRandom(hard) {
  var scrollUl = document.getElementById('ul-scroll');
  var items = [].slice.call(scrollUl.querySelectorAll('li'));
  var index = Math.floor(Math.random()*items.length)
  var drinkElement = items[index].getElementsByTagName("span")[0];
  while (drinkElement.id == "random" || drinkElement.id == "randoming") {
    index = Math.floor(Math.random()*items.length)
    drinkElement = items[index].getElementsByTagName("span")[0];
  }
  var scrollW = document.getElementById('wrap-scroll');
  

  target = (index - 1)*items[0].clientHeight - scrollW.scrollTop;
  target = target + items.length * items[0].clientHeight;
  var delta = 2;
  var slowDown = false;
  var moved = 0;
  var speed = 20;
  var identity = setInterval(animate, speed);
  function animate() {
    if (delta > speed && !slowDown) {
      if (moved >= target - speed*speed) {
        slowDown = true;
      }
    } else if (slowDown) {
      console.log("Slowing down")
      if (moved >= target) {
        setTimeout(function(){
          pour(drinkElement, hard);
        }, 1000);
        clearInterval(identity);
        return; 
      }
      delta = (target - moved)/10;
      if (delta <= 1) {
        delta = 1;
      }
    } else {     
      delta++;
    }
    scrollW.scrollTop = scrollW.scrollTop + delta;
    moved += delta;
  } 

  // setTimeout(function(){
  //   pour(drinkElement);
  // }, 3000);
  // console.log("random drink")
  return;
}

function update(duration, drink, ingredients) { 
  var element = document.getElementById("myprogressBar");
  var container = document.getElementById("Progress_Status");
  var textContainer = document.getElementById("Progress_Text");
  var menu = document.getElementById("scroll-container");
  var ingContainer = document.getElementById("Ingredient_Text")
  var test = "Ingredienser: <BR>";
  menu.hidden = true;
  container.hidden = false;
  for (x in ingredients) {
      var amount = ingredients[x][0]
      amount /= Math.pow(10, 1);
      amount = Math.round(amount)
      test += ingredients[x][1] + ": " + amount + " cl<BR>";
  }
  ingContainer.innerHTML = test;
  textContainer.innerHTML = drink;
  textContainer.hidden = false;
  ingContainer.hidden = false;
  var width = 1;
  var identity = setInterval(scene, 10); 
  function scene() { 
    width+=100/duration/100;
    if (width >= 100) { 
      clearInterval(identity); 
      element.style.width = '100%'; 
      container.hidden = true;
      textContainer.hidden = true;
      ingContainer.hidden = true;
      menu.hidden = false;
    } else { 
      element.style.width = width + '%';  
    } 
  } 
} 