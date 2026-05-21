//GESTEN
let isTouchMoved = false;
let touchStartPosition;
let touchPosition;

let touchStartPosition1; //pinch
let touchPosition1; //pinch
let pinchStartDistance, pinchDistance;
let pinchThreshold = 75;
let isPinch = false;

let touchTimestamp;
let tapDurationThreshold = 100;

let swipeHorizontalThreshold = 50;
let swipeVerticalThreshold = 40;
let swipeDurationThreshold = 500;

let gesture = "";

let pinchMidX = 0;
let pinchMidY = 0;
///////////////////////////////

//fonts
let table;
let lightFont;
let boldFont;
let regularFont;
let pFont;
let maxZoom = 3.5;
let qrCode

//BIG NUMBER SIZE
let bigNumberSize = 140;
let displayNumber = 0;

//Pie Chart data
let angles = [345, 54];
let halbeangles = [241,180];
let myArray = ['#E4E4E4', '#0101FF'];

//ZOOM AND PAN data
let sf = 1; // scaleFactor
let offsetX = 0;
let offsetY = 0;

let targetSf = 1;
let targetOffsetX = 0;
let targetOffsetY = 0;
const EASE = 0.2; 

let worldMX, worldMY; //Welt-Koordinaten
let mx, my; //Maus Koordinaten

let shuffleFonts = []; // Array für den Schriften-Wechsel

//3D MODEL
let pg3D;
let myModel;

let xTime = 0;

let lastTapTime = 0;
let doubleTapThreshold = 300;



function preload() {
  table = loadTable("tabelle.csv", "csv", "header");
  tableAI = loadTable("stockData_AI.csv", "csv", "header");
  tableReal = loadTable("stockData_real.csv", "csv", "header");

  lightFont = loadFont('assets/Zodiak-Light.otf');
  boldFont = loadFont('assets/Zodiak-Bold.otf');
  regularFont = loadFont('assets/Zodiak-Regular.otf');
  pFont = loadFont('assets/PlusJakartaSans-Regular.ttf');
  bFont = loadFont('assets/PlusJakartaSans-Bold.ttf');
  c1font = loadFont('assets/ClashDisplay-Bold.otf');
  c2font = loadFont('assets/PlusJakartaSans-SemiBoldItalic.ttf');
  c3font = loadFont('assets/AzeretMono-ExtraLightItalic.ttf');
 
  img1 = loadImage("assets/skizze.png"); //sketch load
  bluetexture = loadImage("assets/Frame 2.png");

  myModel = loadModel('assets/bueste.obj', true); //3D model load 
  
  qrCode = loadImage("assets/QR-Code.png");

}

function setup() {


  createCanvas(1080, 1920);
  shuffleFonts = [pFont, c1font, lightFont, c2font, c3font, regularFont];

  pg3D = createGraphics(1920, 1920, WEBGL);
  pg3D.smooth();

  //GESTEN
  document.body.style.touchAction = "manipulation";
  document.body.style.userSelect = "none";
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  document.addEventListener("selectstart", (event) => event.preventDefault());
  //https://editor.p5js.org/clement.zheng/sketches/X3vjZ5ACh



}



function draw() {
 background(255);

 textSize(100);
  //text(`geste: ${gesture}`, 50, 50);

  sf = lerp(sf, targetSf, EASE);
  offsetX = lerp(offsetX, targetOffsetX, EASE);
  offsetY = lerp(offsetY, targetOffsetY, EASE);

  // NEUE MAUS POSITION FÜR KLICKEN
  worldMX = (mouseX - offsetX) / sf;
  worldMY = (mouseY - offsetY) / sf;

  // Zoom und Pan anwenden


  if (sf >= 1) {
    translate(offsetX, offsetY);
    scale(sf);
  } else {
   
    sf = 1; targetSf = 1;
    offsetX = 0; targetOffsetX = 0;
    offsetY = 0; targetOffsetY = 0;
  }

  // DRAW ELEMENTE AUßEN /////////////////////////////////////



  push();
  draw3D();
  image(pg3D, -450, 0, 1920, 1920);
  pop();
  

  //TITEL ARE WE READY
  push();
  translate(40,70);
  scale(0.8);
  title()
  pop();

  //BIG NUMBER
  push();
  translate(40,-80);
  scale(0.7);
  bigNumber();
  pop();

  //stock
  push();
  translate(675, 40);
  scale(0.28);
  stock();
  pop();

  //Reddit
  push();
  translate(820, 1170);
  scale(0.3);
  reddit();
  pop();

  //Konfidenz
  push();
  translate(870, 550); 
  scale(0.3);
  konfidenz();
  pop();

  //Masse im Vergleich
  push();
  translate(840, 1500);
  scale(0.3);
  masseImVergleich();
  pop();

  //KI Tools
  push();
  translate(80, 1540);
  scale(0.3);
  kitoolsText();
  pop();

  //QUIZ
  push();
  translate(300, -700);
  scale(1.1);
  quiz();
  pop();
  
  //PAN!!!!
  if (mouseIsPressed && sf > 1) {

  offsetX -= pmouseX - mouseX;
  offsetY -= pmouseY - mouseY;

  offsetX = constrain(offsetX, width - width * sf - 300, 200);
  offsetY = constrain(offsetY, height - height * sf - 500, 200);

  targetOffsetX = offsetX;
  targetOffsetY = offsetY;

  } 
}

function touchStarted(e) {
  e.preventDefault();
  let t = touches[0];
  touchStartPosition = createVector(t.x, t.y);

  if (touches.length === 2) {
    let t1 = touches[1];
    touchStartPosition1 = createVector(t1.x, t1.y);
    pinchStartDistance = p5.Vector.dist(
      touchStartPosition,
      touchStartPosition1
    );
    pinchMidX = (touches[0].x + touches[1].x) / 2;
    pinchMidY = (touches[0].y + touches[1].y) / 2;
    isPinch = true;
  }

  touchTimestamp = millis();
}

function touchMoved(e) {
  e.preventDefault();
  
  if (isPinch) {
    let t = touches[0];
    touchPosition = createVector(t.x, t.y);
    let t1 = touches[1];
    touchPosition1 = createVector(t1.x, t1.y);

    pinchDistance = p5.Vector.dist(touchPosition, touchPosition1);
    let delta = pinchDistance - pinchStartDistance;

    // ignore tiny jitter
    if (abs(delta) < 1) {
      pinchStartDistance = pinchDistance;
      return;
    }

    if (delta < 0) {
      gesture = "pinch in";
    } else if (delta > 0) {
      gesture = "pinch out";
    }

    let zoom = delta < 0 ? 0.98 : 1.02;

    let liveMidX = mouseX;
    let liveMidY = mouseY;

    targetOffsetX = liveMidX - (liveMidX - targetOffsetX) * zoom;
    targetOffsetY = liveMidY - (liveMidY - targetOffsetY) * zoom;
    targetSf *= zoom;

    console.log('liveMid:', liveMidX, liveMidY, 'mouse:', mouseX, mouseY);

    pinchStartDistance = pinchDistance;

  } else {
    isTouchMoved = true;
    gesture = "drag";
    let t = touches[0];
    touchPosition = createVector(t.x, t.y);
  }
  
}

function touchEnded(e) {
  e.preventDefault();

  if (isPinch) {
    isPinch = false;
    return;
  } else if (
    !isTouchMoved &&
    millis() - touchTimestamp < tapDurationThreshold
  ) {
    gesture = "tap";

    // double tap detection!!
    if (millis() - lastTapTime < doubleTapThreshold) {
      gesture = "double tap";

        //Welt-Koordinaten
  worldMX = (mouseX - offsetX) / sf;
  worldMY = (mouseY - offsetY) / sf;

  //Reddit Bereich
  //Reddit liegt bei x=760, y=1170. KLickbox 300x400
  if (worldMX > 760 && worldMX < 760 + 300 && worldMY > 1170 && worldMY < 1170 + 400) {
    zoomToTarget(760 + 150, 1170 + 200, maxZoom+0.1); //Zoomt auf die Mitte von Reddit
  }else if (worldMX > 830 && worldMX < 830 + 200 && worldMY > 520 && worldMY < 520 + 400) {
    zoomToTarget(880 + 100, 520 + 200, maxZoom+0.1);  //"Konfidenz" Bereich
    // Konfidenz liegt bei x=830, y=520. KLickbox 200x400 //Zoomt auf die Mitte von Konfidenz
  }else if (worldMX > 850 && worldMX < 850 + 200 && worldMY > 1550 && worldMY < 1550 + 400) {
    zoomToTarget(850 + 90, 1550 + 230, maxZoom+0.1); //Zoomt auf die Mitte von Masse im Vergleich     //"Masse im Vergleich" Bereich
    // Masse im Vergleich liegt bei x=850, y=1550. KLickbox 200x400
    

  }else if (worldMX > 70 && worldMX < 70 + 200 && worldMY > 1550 && worldMY < 1550 + 400) {
    zoomToTarget(70 + 135, 1550 + 260, maxZoom+0.1); //Zoomt auf die Mitte von KI-Tools    //"KI-Tools" Bereich
    // KI-Tools liegt bei x=70, y=1550. KLickbox 200x400
    
  }else if (worldMX > 675 && worldMX < 675 + 400 && worldMY > 40 && worldMY < 40 + 200) {
    zoomToTarget(675 + 142, 40 + 250, maxZoom+0.1); //Zoomt auf die Mitte von Stock       //"Stock" Bereich
    // Stock liegt bei x=675, y=40. KLickbox 400x200
  }else if (worldMX > 40 && worldMX < 40 + 400 && worldMY > 1300 && worldMY < 1300 + 200) {
    zoomToTarget(40 + 150, 1300 + 100, maxZoom+0.1); //Zoomt auf die Mitte von quiz      //"quiz" Bereich
    // Quiz liegt bei x=70, y=1250. KLickbox 400x200
  }else if (worldMX > 40 && worldMX < 40 + 300 && worldMY > 70 && worldMY < 70 + 200) {
    zoomToTarget(40 + 250, 70 + 250, maxZoom-1.5); //Zoomt auf die Mitte von are we ready     
    // are we ready liegt bei x=40, y=40. KLickbox 300x200
   
  }else if (worldMX > 350 && worldMX < 350 + 200 && worldMY > 300 && worldMY < 300 + 200) {
    zoomToTarget(675 + 142, 40 + 250, maxZoom+0.1); //zoom to stock webseiten

  }else {
    
    zoomToTarget(0,0,0);
  
  }

      lastTapTime = 0;
    } else {
      lastTapTime = millis();
    }
    return;
  }

  isTouchMoved = false;
  if (millis() - touchTimestamp < swipeDurationThreshold) {
    let touchDelta = p5.Vector.sub(touchPosition, touchStartPosition);
    if (
      abs(touchDelta.y) < swipeVerticalThreshold &&
      abs(touchDelta.x) > swipeHorizontalThreshold
    ) {
      if (touchDelta.x < 0) {
        gesture = "swipe left";
      } else {
        gesture = "swipe right";
      }
    }
  }
}



//ZOOM!!!!
function mouseWheel(event) {
  

  let zoom = event.delta > 0 ? 0.8 : 1.1;

  targetOffsetX = mouseX - (mouseX - targetOffsetX) * zoom;
  targetOffsetY = mouseY - (mouseY - targetOffsetY) * zoom;
  targetSf *= zoom;

  return false; 
}

function doubleClicked() {
  //Welt-Koordinaten
  worldMX = (mouseX - offsetX) / sf;
  worldMY = (mouseY - offsetY) / sf;

  //Reddit Bereich
  //Reddit liegt bei x=760, y=1170. KLickbox 300x400
  if (worldMX > 760 && worldMX < 760 + 300 && worldMY > 1170 && worldMY < 1170 + 400) {
    zoomToTarget(760 + 150, 1170 + 200, maxZoom+0.1); //Zoomt auf die Mitte von Reddit
  }else if (worldMX > 830 && worldMX < 830 + 200 && worldMY > 520 && worldMY < 520 + 400) {
    zoomToTarget(880 + 100, 520 + 200, maxZoom+0.1);  //"Konfidenz" Bereich
    // Konfidenz liegt bei x=830, y=520. KLickbox 200x400 //Zoomt auf die Mitte von Konfidenz
  }else if (worldMX > 850 && worldMX < 850 + 200 && worldMY > 1550 && worldMY < 1550 + 400) {
    zoomToTarget(850 + 90, 1550 + 230, maxZoom+0.1); //Zoomt auf die Mitte von Masse im Vergleich     //"Masse im Vergleich" Bereich
    // Masse im Vergleich liegt bei x=850, y=1550. KLickbox 200x400
    

  }else if (worldMX > 70 && worldMX < 70 + 200 && worldMY > 1550 && worldMY < 1550 + 400) {
    zoomToTarget(70 + 135, 1550 + 260, maxZoom+0.1); //Zoomt auf die Mitte von KI-Tools    //"KI-Tools" Bereich
    // KI-Tools liegt bei x=70, y=1550. KLickbox 200x400
    
  }else if (worldMX > 675 && worldMX < 675 + 400 && worldMY > 40 && worldMY < 40 + 200) {
    zoomToTarget(675 + 142, 40 + 250, maxZoom+0.1); //Zoomt auf die Mitte von Stock       //"Stock" Bereich
    // Stock liegt bei x=675, y=40. KLickbox 400x200
  }else if (worldMX > 40 && worldMX < 40 + 400 && worldMY > 1300 && worldMY < 1300 + 200) {
    zoomToTarget(40 + 150, 1300 + 100, maxZoom+0.1); //Zoomt auf die Mitte von quiz      //"quiz" Bereich
    // Quiz liegt bei x=70, y=1250. KLickbox 400x200
  }else if (worldMX > 40 && worldMX < 40 + 300 && worldMY > 70 && worldMY < 70 + 200) {
    zoomToTarget(40 + 250, 70 + 250, maxZoom-1.5); //Zoomt auf die Mitte von are we ready     
    // are we ready liegt bei x=40, y=40. KLickbox 300x200
   
  }else if (worldMX > 350 && worldMX < 350 + 200 && worldMY > 300 && worldMY < 300 + 200) {
    zoomToTarget(675 + 142, 40 + 250, maxZoom+0.1); //zoom to stock webseiten

  }else {
    
    zoomToTarget(0,0,0);
  
  
  }

  
}


function zoomToTarget(targetX, targetY, targetScale) {
  targetSf = targetScale;
  targetOffsetX = width / 2 - targetX * targetScale;
  targetOffsetY = height / 2 - targetY * targetScale;
}


function draw3D() {
 
  pg3D.clear();
  pg3D.push();
  pg3D.perspective(PI / 4, 1, 1, 10000);
  pg3D.camera(0, 0, 620,
              0, 0, 0,
              0, 1, 0);

  //blau mit etwas shimmer, passt zum anderen blau, sehr dunkel

/*    pg3D.ambientLight(150);
  pg3D.directionalLight(255, 255, 255, 100, 100, 400);
  pg3D.specularMaterial(0,255,255, 125);
  pg3D.shininess(100);
  pg3D.emissiveMaterial(0,0,60);  */

  //glänzt fast nicht wirkt sehr flat, tiefes blau
  
/*   pg3D.ambientLight(100);
  pg3D.directionalLight(255, 255, 255, -1, 1, -3);
  pg3D.specularMaterial(0,10,255, 100);
  pg3D.shininess(100);
  pg3D.emissiveMaterial(0,0,60);
    */

    //sehr shiny, glänzt stark in cyan, oben ist grau weiß
  
  pg3D.ambientLight(100);
  pg3D.directionalLight(255, 255, 255, -1, 1, -3);
  pg3D.specularMaterial(170,255,50, 0);
  pg3D.shininess(18);
  pg3D.emissiveMaterial(0,0,15);
       

  //sehr blau wenig shiny, oberer teil ist fast eine fläche
 
  /* pg3D.ambientLight(200);
  pg3D.pointLight(255, 255, 255, 10, 100, -50);
  pg3D.specularMaterial(100,255,50, 0);
  pg3D.shininess(5);
  pg3D.emissiveMaterial(0,0,10);
     */

/*   
  pg3D.ambientLight(200);
  pg3D.pointLight(255, 255, 255, 10, 100, -50);
  pg3D.specularMaterial(100,255,50, 0);
  pg3D.shininess(5);
  pg3D.emissiveMaterial(0,0,10);
    */
 
  
  //pg3D.fill(255);
  //frameRate(60);
  //animation
  let deltaX = 0.0005 * deltaTime;
  xTime += deltaX;
  
  pg3D.rotateY(xTime);
  //print(deltaTime);
  pg3D.noStroke(); //mesh stroke entfernen (schwarz)
  pg3D.scale(1.5, -1.5, 1.5);
  pg3D.texture(bluetexture);
  pg3D.model(myModel);

  pg3D.pop();
  
}


// ELEMENTE AUßEN RUM //////////////////////////////////////////

function quiz(){

  let t = frameCount * 0.02; 
  
  
  push();
  translate(30, 80 + sin(t) * 5);
  textFont(lightFont);
  textSize(60);
  fill(0);
  text('Are', 0, 0);
  pop();

 
  push();
  translate(30, 170 + sin(t + 0.5) * 5);
  
  let cycle = frameCount % 260; //280
  let currentFont = boldFont; 

  
  if (cycle > 220 && shuffleFonts.length > 0) { //240
  
    let index = floor(frameCount / 6) % shuffleFonts.length; //8
    currentFont = shuffleFonts[index];
    
    
  } else {
    
    currentFont = boldFont;
  }

  textFont(currentFont);
  textSize(110);
  text('you', 0, -10);
  pop();


  image(qrCode, -230, 10, 240, 240);

  push();
  translate(30, 230 + sin(t + 1) * 5);
  textFont(lightFont);
  textSize(60);
  fill(0);
  text('ready?', 0, 0);
  pop();
  
  textSize(34);
      if (sf > maxZoom) {

    text('Scanne den Qr-Code mit deinem Handy, um dich selber zu testen in einem Quiz!', -230, 270, 510);
 } 


}

function stock(){

  textFont(lightFont);
  textSize(60);
  text('Stock Webseiten', 0, 250);

  textFont(boldFont);
  textSize(bigNumberSize);
  fill("#0101FF");
  text("313", 630, 300);
  textSize(60);
  text("Mio.", 870, 300);
  textFont(pFont);
  textSize(34);
  fill("black");
  textWrap(WORD);
  fill("#A7A7A7");
  text('KI-Generierte Bilder gab es April 2025 auf Adobe Stock.', 630, 350, 350);

  textFont(pFont);
  textSize(23);
  fill("black");
  textWrap(WORD);

    if (sf > maxZoom) {

    text('Seit 2022 wurden rund 15 Milliarden Bilder durch KI generiert. Diese Menge übersteigt klassische Bildquellen wie Shutterstock deutlich und liegt um ein Vielfaches über der Bildproduktion eines Menschenlebens.', 100, 800, 700);

    text("Deshalb verändert sich die visuelle Online-Umgebung grundlegend, da KI-generierte Inhalte zunehmend den digitalen Bildraum prägen und die Unterscheidung zwischen echten und künstlichen Bildern erschweren.", 100, 950, 700);

    text("Das kann langfristig dazu führen, dass visuelle Inhalte zunehmend an Glaubwürdigkeit als Informationsquelle verlieren.", 100, 1100, 700);

 } 
  push();
  translate(20, -800);
  scale(0.8);
  stockDIA();
  pop();
}

function stockDIA(){

  let spalte1StockAI = tableAI.getColumn("Spalte1").map(Number);
  let namenStockAI = tableAI.getColumn("namen");
  let spalte1StockReal = tableReal.getColumn("Spalte1").map(Number);
  let namenStockReal = tableReal.getColumn("zahl");

  let margin = 124;
  let startX = margin;
  let startY = height - margin;

  let chartWidth = width - margin * 4;
  let chartHeight = height - margin * 13;

  let minVal = min(spalte1StockAI);
  let maxVal = max(spalte1StockAI);

  // LINE
  stroke("#0101FF");
  strokeWeight(5);
  noFill();
  beginShape();
  for (let i = 0; i < spalte1StockAI.length; i++) {
    let x = map(i, 0, spalte1StockAI.length - 1, startX, startX + chartWidth);
    let y = map(spalte1StockAI[i], minVal, maxVal, startY, startY - chartHeight);
    vertex(x, y);
  }
  endShape();

  function setLineDash(list) {
  drawingContext.setLineDash(list);
}

  stroke("#000000");
  beginShape();
  for (let i = 0; i < spalte1StockReal.length; i++) {
    let x = map(i, 0, spalte1StockReal.length - 1, startX, startX + chartWidth);
    let y = map(spalte1StockReal[i], minVal, maxVal, startY, startY - chartHeight);
    vertex(x, y);
  }
  endShape();
  stroke("#1e1e1e");
  strokeWeight(0.5);
  line(startX, startY, startX + chartWidth, startY);
  setLineDash([10, 10]); //longer stitches
  stroke("#A7A7A7");
  line(startX, startY-100, startX + chartWidth, startY-100);
  line(startX, startY-200, startX + chartWidth, startY-200);
  line(startX, startY-300, startX + chartWidth, startY-300);
  line(startX, startY-400, startX + chartWidth, startY-400);
  //line(startX, startY, startX, startY - chartHeight);

  // LABELS
  textFont(bFont);
  textSize(30);

  for (let i = 0; i < spalte1StockAI.length; i++) {
    let x = map(i, 0, spalte1StockAI.length - 1, startX, startX + chartWidth);
    
    fill("#686868");
    noStroke();
    push();
    translate(x - 15, startY + 15);
    textAlign(LEFT, CENTER);
    text(namenStockAI[i], 0, 15, 200);
    pop();
  }

  fill("#686868");
  noStroke();
  textAlign(RIGHT, CENTER);
  for (let i = 1; i <= 4; i++) {
    text(i * 100 + " Mio.", startX - 20, startY - i * 100 - 13);
  }

}

function konfidenz(){

  push();

  translate(0,250);
  textFont(lightFont);
  textSize(60);
  text('Konfidenz- prüfung', 40, 200, 50);

  // ZAHL
  textFont(boldFont);
  textSize(bigNumberSize);
  fill("#0101FF");
  text('52%', 30, 420);
  
  // Fließtext
  textFont(pFont);
  textSize(34);
  fill("black");
  textWrap(WORD);
  text('von KI generierten Bildern wurden in einem Test richtig erkannt. Das ist ungefähr die Wahrscheinlichkeit eines Münzwurfes.', 30, 470, 385);
  fill("#A7A7A7");
  text('49% der echten Bilder wurden richtig erkannt.', 30, 770, 400);

  pop();

    // Details
  textFont(pFont);
  textSize(23);
  fill("black");
  textWrap(WORD);

  if (sf > maxZoom) {

    text("Die meisten Menschen können echte und KI-generierte Bilder nicht zuverlässig unterscheiden. Ihre Einschätzungen liegen oft kaum über dem Zufallsniveau, obwohl viele Menschen glauben, echte von KI-generierten Bildern unterscheiden zu können.Dadurch sinkt das Vertrauen in die eigene Fähigkeit, KI-Inhalte zu erkennen.", 460, 440, 350);

    text("Gleichzeitig fühlt sich weniger als die Hälfte der Nutzer:innen im Umgang mit solchen Inhalten auf Social Media sicher. Deshalb wünschen sich viele Nutzer:innen klarere Kennzeichnungen für KI-generierten Content. ", 460, 830, 350);

  }

  //PIE CHART
  push();
  translate(200, 120);
  scale(1,-1);
  haelfte(365, angles);
  pop();

  strokeWeight(4);
  stroke(0);
  fill("#000000");
  line(-60,120,460,120);

}

function haelfte(diameter, data) {

  let lastAngle = 0;
 
  for (let i = 0; i < data.length; i++) {

    noStroke();
    fill(myArray[i]); //Farbe
    rotate(100);
    arc(
      0,
      0,
      diameter,
      diameter,
      lastAngle,
      lastAngle + radians(halbeangles[i])
    );
    lastAngle += radians(halbeangles[i]);
  }
}

function masseImVergleich(){

  textFont(lightFont);
  textSize(60);
  text('Masse im Vergleich', 0, 250);

  push();

  translate(-640, 540);

  textFont(boldFont);
  textSize(bigNumberSize);
  fill("#0101FF");
  text("15", 650, 300);
  textSize(60);
  text("Mrd.", 820, 300);
  textFont(pFont);
  textSize(34);
  fill("black");
  textWrap(WORD);
  text('Bilder wurden 2022 von KI generiert.', 650, 350, 350);

  textFont(boldFont);
  textSize(bigNumberSize);
  fill("#0101FF");
  text("23", 1000, 300);
  textFont(pFont);
  textSize(34);
  fill("black");
  textWrap(WORD);
  text('-fache der ganze Shutterstock Libary.', 1000, 350, 350);

  textFont(boldFont);
  textSize(bigNumberSize);
  fill("#0101FF");
  text("23.000", 650, 550);
  textFont(pFont);
  textSize(34);
  fill("black");
  textWrap(WORD);
  text('-fache aller Fotos, die ein Mensch in seinem Leben gemacht hat', 650, 600, 600);
  pop();


  textFont(pFont);
  textSize(23);
  fill("black");
  textWrap(WORD);

     if (sf > maxZoom) {

    text('Seit 2022 wurden rund 15 Milliarden Bilder durch KI generiert. Diese Menge übersteigt klassische Bildquellen wie Shutterstock deutlich und liegt um ein Vielfaches über der Bildproduktion eines Menschenlebens.', 10, 1270, 650);

    text("Deshalb verändert sich die visuelle Online-Umgebung grundlegend, da KI-generierte Inhalte zunehmend den digitalen Bildraum prägen und die Unterscheidung zwischen echten und künstlichen Bildern erschweren.", 10, 1400, 650);


    text("Das kann langfristig dazu führen, dass visuelle Inhalte zunehmend an Glaubwürdigkeit als Informationsquelle verlieren.", 10, 1550, 650);


 }

  noStroke();
  textFont(pFont);
  textSize(25);
  textWrap(WORD);
  textAlign(RIGHT);
  fill("#808080");
  text('Shutterstock Libary', 100, 430 , 50);
  text('Fotos im Laufe eines Lebens', -50, 525 , 200);

 

  fill("#0101FF");
  noStroke();
  circle(400, 480, 360);

  push();

  translate(-70,-50);
  fill("#FFFFF");
  strokeWeight(2);
  stroke(0);
  circle(410, 480, 80);
  circle(370, 580, 20);
  line(250, 480, 360, 480);
  line(250, 580, 360, 580);
  fill("black");

  pop();
}

function reddit(){

  textFont(lightFont);
  textSize(60);
  text('Reddit', 40, 250);

  // ZAHL
  textFont(boldFont);
  textSize(bigNumberSize);
  fill("#0101FF");
  text('15%', 30, 420);
  

  // Fließtext
  textFont(pFont);
  textSize(34);
  fill("black");
  textWrap(WORD);
  text('der Reddit Beiträge wurden in 2025 wahrscheinlich von KI generiert.', 30, 470, 650);
  fill("#A7A7A7");
  text('85% davon sind von Menschen erstellt.', 30, 555, 650);

  // Details
  textFont(pFont);
  textSize(23);
  fill("black");
  textWrap(WORD);
  
  if (sf > maxZoom) {

    text('Eine Studie zu Reddit zeigt, dass etwa 15 Prozent der Beiträge von KI erstellt wurden, was einen leichten Anstieg im Vergleich zum Vorjahr darstellt. Dennoch stammt der Großteil der Inhalte weiterhin von echten Nutzer:innen. Gleichzeitig nimmt der Einsatz von KI in Online-Diskussionen zunehmend zu, wodurch Inhalte schrittweise beeinflusst werden und echte Diskussionen, besonders in großen oder thematischen Communitys, an Klarheit verlieren können.', 30, 630, 600);
    fill("#0101FF");
    text("“AI Slop” auf Social Media", 30, 950, 350);
    fill("black");

    text("Der Begriff „AI-Slop” bezeichnet billige, qualitativ schwache KI-Inhalte, Plattformen überschwemmen. Nutzer:innen sehen diese Inhalte oft als „digitalen Müll“, der den Online-Diskurs verschlechtert. ", 30, 980, 600);


 }

  noStroke();
  //PIE CHART
  push();
  translate(480, 200);
  scale(-1,1);
  pieChart(365, angles);
  pop();

}

function pieChart(diameter, data) {

  let lastAngle = 0;
 
  for (let i = 0; i < data.length; i++) {

    fill(myArray[i]); //Farbe
    noStroke();
    rotate(100);
    arc(
      0,
      0,
      diameter,
      diameter,
      lastAngle,
      lastAngle + radians(angles[i])
    );
    lastAngle += radians(angles[i]);
    
  }
}

function bigNumber(){

  //71
  textFont(regularFont);
  textSize(300);
  fill("#0101FF");
  if (displayNumber < 71) displayNumber += 0.4;
  let numStr = str(floor(displayNumber));

  // pulsieren
  let pulse = 1 + sin(frameCount * 0.02) * 0.015;
  push();
  scale(pulse);

  text(numStr, 30, 800);

  let numWidth = textWidth(numStr);

  textFont(boldFont);
  textSize(140);
  fill("#0101FF");
  text('%', 30 + numWidth + 5, 800);
  

  textFont(pFont);
  textSize(30);
  fill("black");
  textWrap(WORD);
  text('der geteilten Bilder in sozialen Medien weltweit werden mittlerweile von KI generiert', 30, 850, 370);
  pop();

}



function title() {
 
  let t = frameCount * 0.02; 
  
  
  push();
  translate(30, 80 + sin(t) * 5);
  textFont(lightFont);
  textSize(60);
  fill(0);
  text('Are we', 0, 0);
  pop();

 
  push();
  translate(30, 170 + sin(t + 0.5) * 5);
  
  let cycle = frameCount % 280; 
  let currentFont = boldFont; 

  
  if (cycle > 240 && shuffleFonts.length > 0) {
  
    let index = floor(frameCount / 8) % shuffleFonts.length;
    currentFont = shuffleFonts[index];
    
    fill("#0101FF");
  } else {
    fill("#0101FF");
    currentFont = boldFont;
  }

  textFont(currentFont);
  textSize(120);
  text('ready', 0, 0);
  pop();


 
  push();
  translate(30, 235 + sin(t + 1) * 5);
  textFont(lightFont);
  textSize(60);
  fill(0);
  text('for AI?', 0, 0);
  pop();

  if (sf > maxZoom-1.6) {
      

    fill("#0101FF");
    noStroke();
    circle(500, 300, 100);
    fill("white");
    textSize(20);
    text("double tap", 470, 280, 50);

  

  
  }


}

function kitoolsText(){

  push();
  textFont(lightFont);
  textSize(60);
  text('Generative KI-Tools', 40, 200);

  // ZAHL
  textFont(boldFont);
  textSize(bigNumberSize);
  fill("#0101FF");
  text('23.000', 30, 350);
  
  // Fließtext
  textFont(pFont);
  textSize(34);
  fill("black");
  textWrap(WORD);
  text('KI-Generierte Bilder pro Minute in 2024.', 30, 400, 340);
  line(700, 260, 700, 700);

  textFont(pFont);
  textSize(23);
  fill("black");
  textWrap(WORD);


    if (sf > maxZoom) {

      text('Seit 2022 wurde über 15 Milliarden Bilder mit KI erstellt. Jeden Tag kommen Millionen neue Bilder hinzu, sodass KI in kürzester Zeit mehr Inhalte produziert als früher Menschen in Jahrzehnten.Insgesamt wächst die Bildproduktion durch KI rapide an und dominiert den Markt immer stärker.', 30, 1200, 800);
      fill("#0101FF");
      text("Urheberrecht und “Nightshade”", 30, 1380, 900);
      fill("black");

      text("KI-Modelle werden häufig mit Bildern aus dem Internet trainiert, meist ohne die Zustimmung der Urheber:innen. Dadurch entsteht ein Urheberrechtsproblem, da Künstler:innen weder gefragt noch bezahlt werden. Als Reaktion darauf wurden Tools wie Nightshade entwickelt, die versuchen, sich gegen diese Nutzung zu wehren. ", 30, 1420, 800);


 }

  translate(-70, -880);
  kitools();

}

function kitools() {

  fill("#E4E4E4");
  textFont(pFont);
  textSize(20);

  let spalte1 = table.getColumn("Spalte1").map(Number);
  let namen = table.getColumn("namen");
  
  let margin = 100;
  let startX = margin;
  let startY = height - margin;

  let chartWidth = width - margin * 3;
  let chartHeight = height - margin * 13;

  let barWidth = chartWidth / spalte1.length;

  noStroke();

  for (let i = 0; i < spalte1.length; i++) {
    let barHeight = map(spalte1[i], 0, 50, 0, chartHeight);
    rect(startX + i * barWidth, startY - barHeight, barWidth * 0.6, barHeight);
    
    let xPos = startX + i * barWidth + barWidth/2;
    textAlign(LEFT, CENTER);
    fill("#A7A7A7");
    push();
    translate(xPos - 15, startY + 15);
    rotate(radians(90));
    text(namen[i], 0, 0 + 15, 20);
    pop();
    fill("#E4E4E4");

    if (i == 3) {
      fill("#0101FF");
    }
    
  }
 
}
