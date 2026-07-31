function pour(item, hard) {
  console.warn("bananer är inte ätbara");
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

  if (drink == "randoming") {
    const rawIngredients = item.getAttribute("data-ingredients");
    const ingredients = rawIngredients ? rawIngredients.split(',') : [];
    
    showSlotMachine(ingredients);
    pour(drink, hard);
    return;
  }
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var obj = JSON.parse(this.responseText)
	  const ingredients = Object.keys(obj.ingredients);
	  console.log("Ingredients received:", ingredients);
	  if (item.id === "random") {
      if (Array.isArray(ingredients)) {
        showSlotMachine(['vodka', 'orange juice', 'cranberry']);
      } else {
        console.warn("Ingredients is not an array:", obj.ingredients);
      }
    }
      update(obj.duration, obj.name, obj.ingredients)
    }
  };
  xhttp.open("POST", tar, true);
  xhttp.setRequestHeader("Content-Type", "application/json")
  xhttp.send(JSON.stringify({"drink": drink}));
}

function showSlotMachine(ingredients) {
  // Remove existing slot machine if any
  const existing = document.getElementById('slot-machine');
  if (existing) existing.remove();

  // Create container
  const slotContainer = document.createElement('div');
  slotContainer.id = 'slot-machine';
  Object.assign(slotContainer.style, {
    position: 'fixed',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '9999',
    padding: '20px',
    borderRadius: '12px',
    background: 'rgba(10, 10, 30, 0.9)', // dark blueish but transparent
    color: '#0ff',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '2rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    boxShadow: '0 0 20px cyan, 0 0 40px deepskyblue, 0 0 60px #0ff',
    border: '2px solid cyan',
    backdropFilter: 'blur(10px)',
    letterSpacing: '2px',
    textShadow:
      '0 0 5px #0ff, 0 0 10px deepskyblue, 0 0 20px cyan, 0 0 40px #0ff',
  });

  // Create slots
  const slots = [];
  for (let i = 0; i < ingredients.length; i++) {
    const slot = document.createElement('div');
    slot.textContent = '?';
    Object.assign(slot.style, {
      minWidth: '100px',
      textAlign: 'center',
      padding: '15px 0',
      background: 'linear-gradient(135deg, #00ffff, #0066ff)',
      boxShadow: '0 0 10px #00ffff, 0 0 20px #00ccff inset',
      borderRadius: '10px',
      color: '#fff',
      fontWeight: '900',
      userSelect: 'none',
      fontSize: '2.5rem',
      animation: 'spin 1s linear infinite',
      transformStyle: 'preserve-3d',
      perspective: '1000px',
    });
    slots.push(slot);
    slotContainer.appendChild(slot);
  }

  // Add container to body
  document.body.appendChild(slotContainer);

  // Define spin keyframes if not already defined
  if (!document.getElementById('slot-machine-spin-style')) {
    const style = document.createElement('style');
    style.id = 'slot-machine-spin-style';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotateX(0deg); }
        100% { transform: rotateX(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  // Spin logic
  let iterations = 15;
  let counter = 0;

  const interval = setInterval(() => {
    for (let i = 0; i < slots.length; i++) {
      const rand = ingredients[Math.floor(Math.random() * ingredients.length)];
      slots[i].textContent = rand;
    }
    counter++;
    if (counter >= iterations) {
      clearInterval(interval);
      for (let i = 0; i < slots.length; i++) {
        slots[i].textContent = ingredients[i];
        slots[i].style.animation = 'none';
      }
      setTimeout(() => {
        slotContainer.remove();
      }, 2000);
    }
  }, 100);
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
    const rawIngredients = drinkElement.getAttribute("data-ingredients");
    const ingredients = rawIngredients ? rawIngredients.split(',') : [];
    showSlotMachine(ingredients);
    setTimeout(() => {
      pour(drinkElement, hard);
    }, 2000); // wait for slot to finish
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
	  const doneSound = document.getElementById('doneSound');
    if (doneSound) {
      doneSound.currentTime = 0;
      doneSound.play();
    }
    } else { 
      element.style.width = width + '%';  
    } 
  } 
} 