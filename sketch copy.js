let sf = 1; // scaleFactor
let x = 0; // pan X
let y = 0; // pan Y

let mx, my; // mouse coords;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  mx = mouseX;
  my = mouseY;

  background(255);

  translate(mx, my);
  scale(sf);
  translate(-mx, -my);
  //translate();

  rect(100, 100, 100, 100);

  if (mouseIsPressed) {
    
    x -= pmouseX - mouseX;
    y -= pmouseY - mouseY;
  }
}

window.addEventListener("wheel", function(e) {
 
  if (e.deltaY > 0)
    sf *= 1.05;
  else
    sf *= 0.95;
});