let spinning = false;
function pour(item, hard) {
  var xhttp = new XMLHttpRequest();
  var drink = item.id;
  var tar = hard === "hard" ? "/pourhard" : "/pour";

  if (drink == "random") {
    animateRandom(hard);
    return;
  }

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var obj = JSON.parse(this.responseText);
      update(obj.duration, obj.name, obj.ingredients);
    }
  };
  xhttp.open("POST", tar, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify({ "drink": drink }));
}

function animateRandom(hard) {
  const scrollUl = document.getElementById('ul-scroll');
  const items = Array.from(scrollUl.querySelectorAll('li'));
  const validItems = items.filter(li => {
    const span = li.querySelector('span');
    return span && span.id !== "random" && span.id !== "randoming";
  });

  if (validItems.length === 0) {
    console.error("No valid drinks to choose from.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * validItems.length);
  const chosen = validItems[randomIndex];
  const span = chosen.querySelector('span');
  const drinkId = span.id;

  const tar = hard === "hard" ? "/pourhard" : "/pour";

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const obj = JSON.parse(this.responseText);
      let ingredients = [];
      spinning = true;
if (Array.isArray(obj.ingredients)) {
  ingredients = obj.ingredients.map(pair => pair[1]);
} else if (typeof obj.ingredients === 'object' && obj.ingredients !== null) {
  ingredients = Object.values(obj.ingredients).map(pair => pair[1]);
} else {
  console.error("Invalid ingredients format:", obj.ingredients);
}


      // Spin the ingredient names
      console.log("Spinning ingredients:", ingredients);
      spin(ingredients);
        update(obj.duration, obj.name, obj.ingredients);

    }
  };
  xhttp.open("POST", tar, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify({ drink: drinkId }));
}



function update(duration, drink, ingredients) { 
  const element = document.getElementById("myprogressBar");
  const container = document.getElementById("Progress_Status");
  const textContainer = document.getElementById("Progress_Text");
  const menu = document.getElementById("scroll-container");
  const ingContainer = document.getElementById("Ingredient_Text");

element.style.width = '0%';

  let test = "Ingredienser: <BR>";
  menu.hidden = true;
  if (spinning == true) {
container.hidden = true;
  ingContainer.hidden = true;
  textContainer.hidden = true;

setTimeout(() => {
container.hidden = false;
  ingContainer.hidden = false;
  textContainer.hidden = false;
 }, 7500);
}
else {
container.hidden = false;
  ingContainer.hidden = false;
  textContainer.hidden = false;
}

  for (let x in ingredients) {
    let amount = ingredients[x][0];
    amount = Math.round(amount / 10);
    test += ingredients[x][1] + ": " + amount + " cl<BR>";
  }

  ingContainer.innerHTML = test;
  textContainer.innerHTML = drink;
  
  

  let width = 1;
  const identity = setInterval(scene, 10);
  function scene() { 
    width += 100 / duration / 100;
    if (width >= 100) { 
      clearInterval(identity); 
      element.style.width = '100%'; 
      container.hidden = true;
      textContainer.hidden = true;
      ingContainer.hidden = true;
      menu.hidden = false;
const machine = document.getElementById("machine");
machine.style.display = "none";

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
// ------- SLOT MACHINE SPIN FUNCTION (dynamic reels) -------- //

const allIngredientNames = [
  "Gin", "Rum", "Vodka", "Tequila", "Licor 43", "Havanna Club",
  "Citronjuice", "Tonic Water", "Triple Sec", "Apple Schnaps",
  "Peach Schnaps", "Coca Cola", "Apelsinjuice", "TranbärsJuice",
  "ÄppelJuice", "AnnanasJuice", "Margarita Mix"
];

function getRandomIngredients(count = 30) {
  const pool = [
    "Gin", "Rum", "Vodka", "Tequila", "Licor 43", "Havanna Club",
    "Citronjuice", "Tonic Water", "Triple Sec", "Apple Schnaps",
    "Peach Schnaps", "Coca Cola", "Apelsinjuice", "TranbärsJuice",
    "ÄppelJuice", "AnnanasJuice", "Margarita Mix", "---", "---"
  ];
  const result = [];
  for (let i = 0; i < count; i++) {
    const rand = Math.floor(Math.random() * pool.length);
    result.push(pool[rand]);
  }
  return result;
}


function spin(ingredients = []) {
  const menu = document.getElementById("scroll-container");
  if (menu) menu.hidden = true;

  const machine = document.getElementById("machine");
  machine.innerHTML = ""; // Clear old reels
  machine.style.display = "flex";

  const spinSound = document.getElementById("spinSound");
  const dingSound = document.getElementById("dingSound");

  if (spinSound) {
    spinSound.currentTime = 0;
    spinSound.play();
  }

  ingredients.forEach((ingredient, i) => {
    const container = document.createElement("div");
    container.className = "reel-container";

    const reel = document.createElement("div");
    reel.className = "reel";
    reel.id = `reel-${i}`;

    const final = ingredient || "---";
    const symbols = getRandomIngredients(29);
    symbols.push(final);

    symbols.forEach(symbol => {
      const el = document.createElement("div");
      el.className = "symbol";
      el.textContent = symbol;
      reel.appendChild(el);
    });

    container.appendChild(reel);
    machine.appendChild(container);

    // Make sure reel is mounted and layout is flushed
    setTimeout(() => {
      const duration = 1500 + i * 2000;
      reel.style.transition = `top ${duration}ms ease-out`;
      reel.style.top = `-${(symbols.length - 1) * 80}px`;

      setTimeout(() => {
        // Reset reel to show only final ingredient
        reel.innerHTML = "";
        const el = document.createElement("div");
        el.className = "symbol";
        el.textContent = final;
        reel.appendChild(el);
        reel.style.transition = "none";
        reel.style.top = "0px";

        if (dingSound) {
          dingSound.currentTime = 0;
          dingSound.play();
        }
      }, duration + 50);
    }, 50); // Give time for layout flush
  });

  const totalSpinTime = 1500 + ingredients.length * 200 + 500;
  setTimeout(() => {
    if (spinSound) {
      spinSound.pause();
      spinSound.currentTime = 0;
    }
  }, totalSpinTime);
}
