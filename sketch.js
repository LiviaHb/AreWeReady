
//fonts
let table;
let lightFont;
let boldFont;
let regularFont;
let pFont;

//BIG NUMBER SIZE
let bigNumberSize = 140;

let angles = [345, 54];
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
  //saeulenDia();
  pop();

  

  push();
  translate(500, 1550);
  scale(0.4);
  masseImVergleich();
  pop();

 
}


function masseImVergleich(){


  textFont(lightFont);
  textSize(60);
  text('Masse im Vergleich', 40, 250);

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
  text("23.000", 650, 600);
  textFont(pFont);
  textSize(34);
  fill("black");
  textWrap(WORD);
  text('-fache aller Fotos, die ein Mensch in seinem Leben gemacht hat', 650, 650, 600);



  noStroke();
  textFont(pFont);
  textSize(25);
  textWrap(WORD);
  textAlign(RIGHT);
  fill("#808080");
  text('Shutterstock Libary', 150, 470 , 50);

  text('Fotos im Laufe eines Lebens', 0, 590 , 200);


  fill("#0101FF");
  noStroke();
  circle(400, 480, 360);
  fill("#FFFFF");
  strokeWeight(2);
  stroke(0);
  circle(410, 480, 80);
  circle(370, 600, 20);


  
  line(250, 480, 360, 480);
  line(250, 600, 360, 600);

  line()

  fill("black");



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

function saeulenDia() {
  let spalte1 = table.getColumn("Spalte1").map(Number);
  let namen = table.getColumn("namen");
  
  
  let margin = 100;
  let startX = margin;
  let startY = height - margin;
  let endX = width - margin;
  let endY = margin;

  let chartWidth = width - margin * 2;
  let chartHeight = height - margin * 2;

  let barWidth = chartWidth / spalte1.length;

  let ySchritte = 7;
  let abstandY = chartHeight / ySchritte;

  noStroke();

  for (let i = 0; i < spalte1.length; i++) {
    let barHeight = map(spalte1[i], 0, 35, 0, chartHeight);
    rect(startX + i * barWidth, startY - barHeight, barWidth * 0.8, barHeight);
    
    let xPos = startX + i * barWidth + barWidth/2;
    textAlign(CENTER, CENTER);
    text(namen[i], xPos, startY + 10);
    
  }

  stroke(20);
  line(startX, startY, endX, startY);
  line(startX, startY, startX, endY);

  for (let i = 1; i < ySchritte; i++) {
    let unterteilungY = startY - i * abstandY;
    let labelWert = i * 5;
    noStroke();
    textAlign(RIGHT, CENTER);
    text(labelWert, startX - 10, unterteilungY);

    stroke(20, 255);
    drawingContext.setLineDash([]);

    line(startX, unterteilungY, startX - 5, unterteilungY);

    drawingContext.setLineDash([2, 15]);
    stroke(20, 100);
    line(startX, unterteilungY, endX, unterteilungY);
    drawingContext.setLineDash([]);
  }
}
