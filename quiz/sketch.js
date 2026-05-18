// ============================================================
//  ARE YOU READY FOR AI? – p5.js Quiz
//  Hochladen: alle 20 Bilder + Zodiak-Regular.otf + Zodiak-Extrabold.otf + PlusJakartaSans-VariableFont_wght.ttf
// ============================================================

const PAIRS = [
    { a:"bild1-echt.jpeg", b:"bild1-ki.jpeg",  aiIsB:true  },
    { a:"bild2-ki.jpeg",   b:"bild2-echt.jpeg", aiIsB:false },
    { a:"bild3-echt.jpeg", b:"bild3-ki.jpeg",  aiIsB:true  },
    { a:"bild4-echt.jpeg", b:"bild4-ki.jpeg",  aiIsB:true  },
    { a:"bild5-echt.jpeg", b:"bild5-ki.jpeg",  aiIsB:true  },
    { a:"bild6-echt.jpeg", b:"bild6-ki.jpeg",  aiIsB:true  },
    { a:"bild7-echt.jpeg", b:"bild7-ki.jpeg",  aiIsB:true  },
    { a:"bild8-ki.jpeg",   b:"bild8-echt.jpeg", aiIsB:false },
    { a:"bild9-echt.jpeg", b:"bild9-ki.jpeg",  aiIsB:true  },
    { a:"bild10-echt.jpeg",b:"bild10-ki.jpeg", aiIsB:true  }
  ];
  
  function getCorrectChoice(i) { return PAIRS[i].aiIsB ? "b" : "a"; }
  
  const C_WHITE  = "#FAF8F5";
  const C_BLACK  = "#111111";
  const C_BLUE   = "#0000EE";
  const C_LIGHT  = "#E8E8E8";
  const C_GREEN  = "#1DB954";
  const C_RED    = "#E8193C";
  const C_GREY   = "#999999";
  
  let imgs        = [];
  let loadedCount = 0;
  let totalImgs;
  let pairIndex   = 0;
  let chosen      = null;
  let phase       = "title";
  let score       = 0;
  let btnArea     = { x:0, y:0, w:0, h:0 };
  let imgAreas    = [];
  let pairOrder   = [];
  
  let resultReveal  = 0;
  let resultStarted = false;
  let inputLocked   = false;
  
  let fThin, fBold, fBody;
  
  let imgBueste;
  
  function preload() {
    fThin = loadFont("Zodiak-Regular.otf");
    fBold = loadFont("Zodiak-Extrabold.otf");
    fBody = loadFont("PlusJakartaSans-VariableFont_wght.ttf");
    imgBueste = loadImage("bueste-3.png");
    totalImgs = PAIRS.length * 2;
    for (let i = 0; i < PAIRS.length; i++) {
      imgs.push([
        loadImage(PAIRS[i].a, () => loadedCount++, () => loadedCount++),
        loadImage(PAIRS[i].b, () => loadedCount++, () => loadedCount++)
      ]);
    }
  }
  
  function setup() {
    let cw = min(windowWidth, 430);
    let ch = cw * (16 / 9);
    if (ch > windowHeight) { ch = windowHeight; cw = ch * (9/16); }
    createCanvas(cw, ch);
    for (let i = 0; i < PAIRS.length; i++) pairOrder.push(random() > 0.5);
  
    let cnv = document.querySelector('canvas');
    cnv.addEventListener('touchend', function(e) {
      e.preventDefault();
      let t = e.changedTouches[0];
      let rect = cnv.getBoundingClientRect();
      let tx = (t.clientX - rect.left) * (width / rect.width);
      let ty = (t.clientY - rect.top)  * (height / rect.height);
      handleInput(tx, ty);
    }, { passive: false });
  }
  
  function s(x) { return width * (x / 100); }
  function thin() { if (fThin) textFont(fThin); }
  function bold() { if (fBold) textFont(fBold); }
  function body() { if (fBody) textFont(fBody); }
  
  function draw() {
    background(C_WHITE);
    if (loadedCount < totalImgs) { drawLoading(); return; }
    if      (phase === "title")                          drawTitle();
    else if (phase === "question" || phase === "reveal") drawQuiz();
    else if (phase === "result")                         drawResult();
  }
  
  // ── LOADING ──────────────────────
  function drawLoading() {
    body();
    noStroke(); fill(C_GREY);
    textAlign(CENTER, CENTER); textSize(s(3.5));
    text("Laden ...", width/2, height/2);
    let bw = width*0.5, bh = 1;
    let bx = (width-bw)/2, by = height/2 + s(5);
    stroke(C_LIGHT); strokeWeight(1); noFill(); rect(bx, by, bw, bh);
    noStroke(); fill(C_BLUE); rect(bx, by, bw*(loadedCount/totalImgs), bh);
  }
  
  // ── TITEL ────────────────────────
  function drawTitle() {
    let pad = s(7);
    let y   = s(10);
    noStroke();
  
    // Bueste im Hintergrund
    if (imgBueste) {
      let bh = height * 1.1;
      let bw = bh * (imgBueste.width / imgBueste.height);
      let bx = width / 2 - bw * 0.35;
      let by = -height * 0.05;
      tint(255, 60);
      image(imgBueste, bx, by, bw, bh);
      noTint();
    }
  
    thin(); fill(C_BLACK); textSize(s(12)); textAlign(LEFT, TOP);
    text("Are you", pad, y); y += s(13);
  
    bold(); fill(C_BLUE); textSize(s(16));
    text("ready", pad, y); y += s(18);
  
    thin(); fill(C_BLACK); textSize(s(12));
    text("for AI?", pad, y); y += s(16);
  
    stroke(C_LIGHT); strokeWeight(1);
    line(pad, y, width-pad, y); noStroke(); y += s(6);
  
    body(); fill(C_GREY); textSize(s(3.8)); textAlign(LEFT, TOP);
    textLeading(s(6.5));
    text("Kannst du sehen, welches Bild KI-generiert ist? W\u00e4hle das Bild, das deiner Meinung nach k\u00fcnstlich erstellt wurde.", pad, y, width-pad*2);
    textLeading(s(5));
    y += s(26);
  
    drawBtn("Quiz starten \u2192", y);
  }
  
  // ── QUIZ ─────────────────────────
  function drawQuiz() {
    let p   = PAIRS[pairIndex];
    let pad = s(5);
    let y   = s(3);
    noStroke();
  
    thin(); fill(C_BLACK); textSize(s(7)); textAlign(LEFT, TOP);
    text("Are you", pad, y); y += s(7.8);
  
    bold(); fill(C_BLUE); textSize(s(9.5));
    text("ready", pad, y); y += s(10.8);
  
    thin(); fill(C_BLACK); textSize(s(7));
    text("for AI?", pad, y); y += s(9);
  
    body(); fill(C_GREY); textSize(s(3.2)); textAlign(LEFT, TOP);
    text("Welches Bild ist KI-generiert?", pad, y); y += s(5);
  
    // Fortschrittspunkte
    let r = s(0.7), dg = s(2.2);
    let tw = (PAIRS.length-1)*dg + r*2;
    let sx = (width-tw)/2;
    for (let i = 0; i < PAIRS.length; i++) {
      let dx = sx + i*dg + r, dy = y + r;
      noStroke();
      if      (i < pairIndex)   fill(C_BLUE);
      else if (i === pairIndex) fill(C_BLACK);
      else                      fill(C_LIGHT);
      ellipse(dx, dy, r*2);
    }
    y += s(3.8);
  
    let normal   = pairOrder[pairIndex];
    let topIdx   = normal ? 0 : 1;
    let botIdx   = normal ? 1 : 0;
    let topAB    = normal ? "a" : "b";
    let botAB    = normal ? "b" : "a";
  
    let reserve  = s(12);
    let gap      = s(2);
    let imgH     = (height - y - gap*3 - reserve) / 2;
    let imgW     = width - pad*2;
    let yTop     = y + gap;
    let yBot     = yTop + imgH + gap;
  
    let topStroke = C_LIGHT, botStroke = C_LIGHT;
    let topSW = 1, botSW = 1;
    if (phase === "reveal") {
      if (chosen === topAB) {
        let ai = normal ? !PAIRS[pairIndex].aiIsB : PAIRS[pairIndex].aiIsB;
        topStroke = ai ? C_GREEN : C_RED; topSW = s(1.8);
      }
      if (chosen === botAB) {
        let ai = normal ? PAIRS[pairIndex].aiIsB : !PAIRS[pairIndex].aiIsB;
        botStroke = ai ? C_GREEN : C_RED; botSW = s(1.8);
      }
    }
  
    imgAreas = [];
    drawImgCard(imgs[pairIndex][topIdx], pad, yTop, imgW, imgH, topStroke, topSW);
    imgAreas.push({x:pad, y:yTop, w:imgW, h:imgH, ab:topAB});
    drawImgCard(imgs[pairIndex][botIdx], pad, yBot, imgW, imgH, botStroke, botSW);
    imgAreas.push({x:pad, y:yBot, w:imgW, h:imgH, ab:botAB});
  
    if (phase === "reveal") {
      let label = pairIndex === PAIRS.length-1 ? "Ergebnis \u2192" : "Weiter \u2192";
      drawBtn(label, height - s(7) - s(2));
    }
  }
  
  function drawImgCard(img, x, y, w, h, strokeCol, sw) {
    fill(0,0,0,8); noStroke(); rect(x+2, y+2, w, h, s(1.8));
  
    if (sw > 1) {
      drawingContext.shadowColor = strokeCol;
      drawingContext.shadowBlur  = s(5);
    }
    stroke(strokeCol); strokeWeight(sw); fill(C_WHITE);
    rect(x, y, w, h, s(1.8));
    drawingContext.shadowBlur = 0;
  
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.roundRect(x, y, w, h, s(1.8));
    drawingContext.clip();
    let ratio = img.width / img.height;
    let dw, dh;
    if (w/h > ratio) { dw = w; dh = w/ratio; }
    else             { dh = h; dw = h*ratio; }
    image(img, x+(w-dw)/2, y+(h-dh)/2, dw, dh);
    drawingContext.restore();
  }
  
  // ── ERGEBNIS ─────────────────────
  function drawResult() {
    let pad = s(7);
    let pct = score / PAIRS.length;
  
    resultStarted = true;
    if (resultReveal < pct) {
      resultReveal = min(resultReveal + 0.015, pct);
    }
  
    noStroke();
  
    let y = s(10);
    thin(); fill(C_BLACK); textSize(s(12)); textAlign(LEFT, TOP);
    text("Are you", pad, y); y += s(13);
  
    bold(); fill(C_BLUE); textSize(s(16));
    text("ready", pad, y); y += s(18);
  
    thin(); fill(C_BLACK); textSize(s(12));
    text("for AI?", pad, y);
  
    let cx = width/2, cy = height * 0.58;
    let cr = s(26);
  
    stroke(C_LIGHT); strokeWeight(1); noFill();
    ellipse(cx, cy, cr*2);
  
    stroke(C_BLUE); strokeWeight(s(1.8)); noFill();
    if (resultReveal > 0) {
      arc(cx, cy, cr*2, cr*2, -HALF_PI, -HALF_PI + TWO_PI * resultReveal);
    }
    noStroke();
  
    thin();
    fill(C_BLACK); textAlign(CENTER, CENTER); textSize(s(8));
    text(score + "/" + PAIRS.length, cx, cy - s(0.5));
  
    body();
    fill(C_GREY); textAlign(CENTER, TOP); textSize(s(3));
    text("richtig erkannt", cx, cy + cr + s(2));
  
    textAlign(LEFT, TOP);
    drawOutlineBtn("Nochmal spielen", height - s(8) - s(4));
  }
  
  // ── BUTTONS ──────────────────────
  function drawBtn(label, y) {
    let pad = s(7);
    let bh  = s(7.5), bw = width - pad*2;
    btnArea = { x:pad, y:y, w:bw, h:bh };
    noStroke(); fill(C_BLUE);
    rect(pad, y, bw, bh, bh/2);
    body(); fill(C_WHITE);
    textAlign(CENTER, CENTER); textStyle(NORMAL); textSize(s(3.5));
    text(label, pad + bw/2, y + bh/2 - s(0.8));
    textStyle(NORMAL); textAlign(LEFT, TOP);
  }
  
  function drawOutlineBtn(label, y) {
    let pad = s(7);
    let bh  = s(7.5), bw = width - pad*2;
    btnArea = { x:pad, y:y, w:bw, h:bh };
    stroke(C_BLACK); strokeWeight(1); noFill();
    rect(pad, y, bw, bh, bh/2);
    body(); fill(C_BLACK);
    textAlign(CENTER, CENTER); textStyle(NORMAL); textSize(s(3.5));
    text(label, pad + bw/2, y + bh/2 - s(0.8));
    textStyle(NORMAL); textAlign(LEFT, TOP);
  }
  
  // ── INPUT ────────────────────────
  function lockInput() {
    inputLocked = true;
    setTimeout(function() { inputLocked = false; }, 600);
  }
  
  function inBtn(mx, my) {
    return mx > btnArea.x && mx < btnArea.x + btnArea.w &&
           my > btnArea.y && my < btnArea.y + btnArea.h;
  }
  
  function mousePressed() { handleInput(mouseX, mouseY); }
  
  function handleInput(mx, my) {
    if (loadedCount < totalImgs) return;
    if (inputLocked) return;
  
    if (phase === "title") {
      if (inBtn(mx, my)) { phase = "question"; lockInput(); }
      return;
    }
  
    if (phase === "result") {
      if (inBtn(mx, my)) {
        pairIndex = 0; chosen = null; score = 0;
        resultReveal = 0; resultStarted = false;
        pairOrder = [];
        for (let i = 0; i < PAIRS.length; i++) pairOrder.push(random() > 0.5);
        phase = "title";
      }
      return;
    }
  
    if (phase === "reveal") {
      if (inBtn(mx, my)) {
        if (pairIndex < PAIRS.length-1) {
          pairIndex++; chosen = null; phase = "question"; lockInput();
        } else {
          resultReveal = 0;
          resultStarted = false;
          btnArea = { x:0, y:0, w:0, h:0 };
          lockInput();
          phase = "result";
        }
      }
      return;
    }
  
    if (phase === "question") {
      for (let a of imgAreas) {
        if (mx > a.x && mx < a.x+a.w && my > a.y && my < a.y+a.h) {
          pick(a.ab); break;
        }
      }
    }
  }
  
  function pick(choice) {
    chosen = choice;
    let correct = getCorrectChoice(pairIndex);
    if (choice === correct) score++;
    phase = "reveal";
  }
  
  function touchStarted() {
    if (touches.length > 0) handleInput(touches[0].x, touches[0].y);
    return false;
  }
  function touchMoved() { return false; }
  
  function windowResized() {
    let cw = min(windowWidth, 430), ch = cw*(16/9);
    if (ch > windowHeight) { ch = windowHeight; cw = ch*(9/16); }
    resizeCanvas(cw, ch);
  }