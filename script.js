var character = document.querySelector(".character");
var map2 = document.querySelector(".map2");

//start in the middle of the map
var x = 64;
var y = 66;
//State of which arrow keys we are holding down
var held_directions = [];
//How fast the character moves in pixels per frame
var speed = 1;
//character movement controller
// placeCharacter: 
// if the player is holding any action, 
// reposition the character.
const placeCharacter = () => {
  var pixelSize = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--pixel-size")
  );

  const held_direction = held_directions[0];
  if (held_direction) {
    if (held_direction === directions.right) {
      x += speed;
    }
    if (held_direction === directions.left) {
      x -= speed;
    }
    if (held_direction === directions.down) {
      y += speed;
    }
    if (held_direction === directions.up) {
      y -= speed;
    }
    character.setAttribute("facing", held_direction);
  }
  character.setAttribute("walking", held_direction ? "true" : "false");

  //Limits (gives the illusion of walls)
  var leftLimit = 20;
  var rightLimit = 16 * 11 + 10;
  var topLimit = 40;
  var bottomLimit = 16 * 8 - 10;
  if (x < leftLimit) {
    x = leftLimit;
  }
  if (x > rightLimit) {
    x = rightLimit;
  }
  if (y < topLimit) {
    y = topLimit;
  }
  if (y > bottomLimit) {
    y = bottomLimit;
  }
//camera controller
  // camera_left/top: 
  // offset the character so it’s in the middle of the camera
  var camera_left = pixelSize * 66;
  var camera_top = pixelSize * 42;

  // translate3d: 
  // apply a positional style without asking the browser to repaint every time.
  map2.style.transform = `translate3d( ${-x * pixelSize + camera_left}px, ${-y *
    pixelSize +
    camera_top}px, 0 )`;
  character.style.transform = `translate3d( ${x * pixelSize}px, ${y *
    pixelSize}px, 0 )`;
};

//Steps: distinct jumps | Set up the game loop
// Function Steps: 
// run placeCharacter and refine whenever last action is ready over and over again
const step = () => {
  placeCharacter();
  window.requestAnimationFrame(() => {
    step();
  });
};
step(); 

/* Direction key state */
const directions = {
  up: "up",
  down: "down",
  left: "left",
  right: "right"
};
const keys = {
  38: directions.up,
  37: directions.left,
  39: directions.right,
  40: directions.down
};
document.addEventListener("keydown", e => {
  var dir = keys[e.which];
  if (dir && held_directions.indexOf(dir) === -1) {
    held_directions.unshift(dir);
  }
});

document.addEventListener("keyup", e => {
  var dir = keys[e.which];
  var index = held_directions.indexOf(dir);
  if (index > -1) {
    held_directions.splice(index, 1);
  }
});

// Dpad functionality for mouse and touch
var isPressed = false;
const removePressedAll = () => {
  document.querySelectorAll(".dpad-button").forEach(d => {
    d.classList.remove("pressed");
  });
};
document.body.addEventListener("mousedown", () => {
  console.log("mouse is down");
  isPressed = true;
});
document.body.addEventListener("mouseup", () => {
  console.log("mouse is up");
  isPressed = false;
  held_directions = [];
  removePressedAll();
});

const handleDpadPress = (direction, click) => {
  if (click) {
    isPressed = true;
  }
  // held_direction: 
  // keep track of the order in which the arrows are held down in arrays, 
  // for situation when player is holding conflicting keys. 
  // For example, when left is held when right is pressed then released, 
  // the character would go left, right, then left
  held_directions = isPressed ? [direction] : [];

  if (isPressed) {
    removePressedAll();
    document.querySelector(".dpad-" + direction).classList.add("pressed");
  }
};
//Bind a ton of events for the dpad
document
  .querySelector(".dpad-left")
  .addEventListener("touchstart", e => handleDpadPress(directions.left, true));
document
  .querySelector(".dpad-up")
  .addEventListener("touchstart", e => handleDpadPress(directions.up, true));
document
  .querySelector(".dpad-right")
  .addEventListener("touchstart", e => handleDpadPress(directions.right, true));
document
  .querySelector(".dpad-down")
  .addEventListener("touchstart", e => handleDpadPress(directions.down, true));

document
  .querySelector(".dpad-left")
  .addEventListener("mousedown", e => handleDpadPress(directions.left, true));
document
  .querySelector(".dpad-up")
  .addEventListener("mousedown", e => handleDpadPress(directions.up, true));
document
  .querySelector(".dpad-right")
  .addEventListener("mousedown", e => handleDpadPress(directions.right, true));
document
  .querySelector(".dpad-down")
  .addEventListener("mousedown", e => handleDpadPress(directions.down, true));

document
  .querySelector(".dpad-left")
  .addEventListener("mouseover", e => handleDpadPress(directions.left));
document
  .querySelector(".dpad-up")
  .addEventListener("mouseover", e => handleDpadPress(directions.up));
document
  .querySelector(".dpad-right")
  .addEventListener("mouseover", e => handleDpadPress(directions.right));
document
  .querySelector(".dpad-down")
  .addEventListener("mouseover", e => handleDpadPress(directions.down));

//Track the num of collected bones
let Toynum = 0;
//When collect a bone, the event series will response
var scenarios = [
  {
    required: [],
    bypass: ["OneToy"],
    text: "Take bones!"
  },

  {
    required: ["OneToy"],
    bypass: ["TwoToys"],
    text: "1"
  },
  {
    required: ["TwoToys"],
    bypass: ["ThreeToys"],
    text: "2"
  },

  {
    required: ["ThreeToys"],
    bypass: ["FourToys"],
    text: "3"
  },
  {
    required: ["FourToys"],
    bypass: ["FiveToys"],
    text: "4"
  },
  {
    required: ["FiveToys"],
    bypass: ["SixToys"],
    text: "5,click dog to get more bones!"
  },
  {
    required: ["SixToys"],
    bypass: ["SevenToys"],
    text: "6"
  },
  {
    required: ["SevenToys"],
    bypass: ["EightToys"],
    text: "7"
  },
  {
    required: ["EightToys"],
    bypass: ["NineToys"],
    text: "8"
  },
  {
    required: ["NineToys"],
    bypass: ["TenToys"],
    text: "9"
  },
  {
    required: ["TenToys"],
    bypass: [],
    text: "All 10! Now you can buy a toy!"
  }
];
//event controller
var computedStoryPoints = {
  requires: [
    "Bone1",
    "Bone2",
    "Bone3",
    "Bone4",
    "Bone5",
    "Bone6",
    "Bone7",
    "Bone8",
    "Bone9",
    "Bone10"
  ],
  quantities: [
    [1, "OneToy"],
    [2, "TwoToys"],
    [3, "ThreeToys"],
    [4, "FourToys"],
    [5, "FiveToys"],
    [6, "SixToys"],
    [7, "SevenToys"],
    [8, "EightToys"],
    [9, "NineToys"],
    [10, "TenToys"]
  ]
};

//add toy story point
var toys = document.querySelectorAll(".toy");
toys.forEach(toy => {
  toy.addEventListener("click", () => {
    toy.classList.toggle("rescued");
    toggleStoryPoint(toy.getAttribute("story-point"));

    refreshScenario();
    Toynum++;
  });
});
//add dog story point
var dog = document.querySelectorAll(".dog");
dog.forEach(dog => {
  dog.addEventListener("click", () => {
    toggleStoryPoint(dog.getAttribute("story-point"));
    refreshScenario();
    document.querySelector(".toy1").style.visibility = "visible";
    document.querySelector(".toy2").style.visibility = "visible";
    document.querySelector(".toy3").style.visibility = "visible";
    document.querySelector(".toy4").style.visibility = "visible";
    document.querySelector(".toy5").style.visibility = "visible";
  });
});

//---------------------- Story Points ---------------------------

//Story point state mechanism
var storyPoints = {};

function toggleStoryPoint(incomingStoryPoint) {
  if (storyPoints[incomingStoryPoint]) {
    delete storyPoints[incomingStoryPoint];
  } else {
    storyPoints[incomingStoryPoint] = true;
  }
}

function getAllKnownStoryPoints() {
  //Figure out the computed story points we also own
  var acquiredCount = computedStoryPoints.requires.filter(sp => {
    return storyPoints[sp];
  }).length; 

  var computed = {};
  computedStoryPoints.quantities.forEach(q => {
    if (acquiredCount >= q[0]) {
      computed[q[1]] = true;
    }
  });

  //Combine with all known story points
  return {
    ...storyPoints,
    ...computed
  };
}

//Update the view per frame
function refreshScenario() {
  var known = getAllKnownStoryPoints();
  var scenario = scenarios.find(s => {
    for (var i = 0; i <= s.bypass.length; i++) {
      if (known[s.bypass[i]]) {
        return false;
      }
    }
    return s.required.every(entry => known[entry]);
  });

  document.querySelector(".js-text").textContent = scenario.text;
}

//When player click "buy a toy", the event happens
function buyAToy() {
  if (Toynum <= 9) {
    const remToy = 10 - Toynum;
    const resultsBox = document.getElementById("a");
    resultsBox.innerHTML = "Not Enough! You need " + remToy + " more bones!";
  } else if (Toynum == 10) {
    const resultsBox = document.getElementById("a");
    resultsBox.innerHTML = "New Toy!";
    document.querySelector(".toy11").style.visibility = "visible";
  }
}
