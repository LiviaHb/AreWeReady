
//fonts
let table;
let lightFont;
let boldFont;
let regularFont;
let pFont;

//BIG NUMBER SIZE
let bigNumberSize = 140;

let angles = [345, 54];
let halbeangles = [241,180];
let myArray = ['#E4E4E4', '#0101FF'];

//obj
//let shape;

function preload() {
  table = loadTable("tabelle.csv", "csv", "header");
  lightFont = loadFont('assets/Zodiak-Light.otf');
  boldFont = loadFont('assets/Zodiak-Bold.otf');
  regularFont = loadFont('assets/Zodiak-Regular.otf');
  pFont = loadFont('assets/PlusJakartaSans-Regular.ttf');

  //sketch load
  img1 = loadImage("assets/skizze.png");
 
  //shape = loadModel('assets/airboat.obj');
}

function setup() {
  createCanvas(1080, 1920);
  background(250);


  scale(0.215);
  tint(255,15);
  image(img1, 0, 0);


}


function draw() {

  /*
  //orbitControl();
  //model(shape);
  noStroke();
  noLoop(); // Run once and stop
  
  //TITEL ARE WE READY
  push();
  translate(40,80);
  scale(1.03);
  title()
  pop();

  //BIG NUMBER
  push();
  translate(40,-20);
  scale(0.8);
  bigNumber();
  pop();

  //Reddit Pie Chart
  push();
  translate(760, 1170);
  scale(0.4);
  reddit();
  pop();

  push();
  translate(830, 350);
  scale(0.4);
  konfidenz();
  pop();


  push();
  translate(500, 1550);
  scale(0.4);
  masseImVergleich();
  pop();
   */


  push();
  kitools();
  pop();




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
  text('49% der echten Bilder wurden richtig erkannt..', 30, 770, 400);

  pop();

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

  noStroke();


  let lastAngle = 0;
 
  for (let i = 0; i < data.length; i++) {

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
  text("23.000", 650, 570);
  textFont(pFont);
  textSize(34);
  fill("black");
  textWrap(WORD);
  text('-fache aller Fotos, die ein Mensch in seinem Leben gemacht hat', 650, 620, 600);



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

  line()

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
  text('71', 30, 800);

  textFont(boldFont);
  textSize(140);
  fill("#0101FF");
  text('%', 320, 800);


   
  textFont(pFont);
  textSize(30);
  fill("black");
  textWrap(WORD);
  text('der geteilten Bilder in sozialen Medien weltweit werden mittlerweile von KI generiert', 30, 850, 370);

}

function title(){

  textFont(lightFont);
  textSize(60);
  text('Are we', 30, 80);
  //text(myArray[0], 30, 80);


  textFont(boldFont);
  textSize(120);
  fill("#0101FF");
  text('ready', 30, 170);

  textFont(lightFont);
  textSize(60);
  fill("black");
  text('for AI?', 30, 230);


  textSize(12);

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

  let chartWidth = width - margin * 2;
  let chartHeight = height - margin * 13;

  let barWidth = chartWidth / spalte1.length;

  noStroke();

  for (let i = 0; i < spalte1.length; i++) {
    let barHeight = map(spalte1[i], 0, 35, 0, chartHeight);
    rect(startX + i * barWidth, startY - barHeight, barWidth * 0.6, barHeight);
    
    let xPos = startX + i * barWidth + barWidth/2;
    textAlign(LEFT, CENTER);
    fill("#A7A7A7");
    push();
    translate(xPos - 15, startY + 15);
    rotate(radians(90));
    text(namen[i], 0, 0 + 15);
    print(xPos);
    pop();
    fill("#E4E4E4");

    if (i == 3) {
      fill("#0101FF");
    }
    
  }
 
}
