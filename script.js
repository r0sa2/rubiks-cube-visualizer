var scene = document.getElementsByClassName("scene")[0];
var cube = document.getElementsByClassName("cube")[0];
var pieces = document.getElementsByClassName("piece");
var leftFaces = document.getElementsByClassName("face-left");
var rightFaces = document.getElementsByClassName("face-right");
var topFaces = document.getElementsByClassName("face-top");
var bottomFaces = document.getElementsByClassName("face-bottom");
var backFaces = document.getElementsByClassName("face-back");
var frontFaces = document.getElementsByClassName("face-front");
var faceAnchors = document.getElementsByClassName("face-anchor");
var pieceIndicesX1 = [0, 9, 18, 3, 12, 21, 6, 15, 24];
var pieceIndicesX2 = [1, 10, 19, 4, 13, 22, 7, 16, 25];
var pieceIndicesX3 = [2, 11, 20, 5, 14, 23, 8, 17, 26];
var pieceIndicesY1 = [0, 1, 2, 9, 10, 11, 18, 19, 20];
var pieceIndicesY2 = [3, 4, 5, 12, 13, 14, 21, 22, 23];
var pieceIndicesY3 = [6, 7, 8, 15, 16, 17, 24, 25, 26];
var pieceIndicesZ1 = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var pieceIndicesZ2 = [9, 10, 11, 12, 13, 14, 15, 16, 17];
var pieceIndicesZ3 = [18, 19, 20, 21, 22, 23, 24, 25, 26];
var pieceIndicesClockwiseSwaps = [[0, 2], [0, 6], [6, 8], [1, 5], [1, 3], [3, 7]];
var pieceIndicesAnticlockwiseSwaps = [[6, 8], [0, 6], [0, 2], [3, 7], [1, 3], [1, 5]];
var faceIndicesZSwaps = [[5, 5], [4, 4], [2, 0], [2, 1], [3, 0], [3, 1], [0, 2], [0, 3], [1, 2], [1, 3]];
var faceIndicesXSwaps = [[0, 0], [1, 1], [2, 5], [2, 4], [3, 5], [3, 4], [5, 2], [5, 3], [4, 2], [4, 3]];
var faceIndicesYSwaps = [[2, 2], [3, 3], [5, 0], [5, 1], [4, 0], [4, 1], [0, 5], [0, 4], [1, 5], [1, 4]];
var scramble = [];
var canMove = true;

// Align piece faces
for (let i = 0; i < pieces.length; i++) {
  leftFaces[i].style.transform = "rotateY(-90deg) translateZ(50px)";
  rightFaces[i].style.transform = "rotateY(90deg) translateZ(50px)";
  topFaces[i].style.transform = "rotateX(90deg) translateZ(50px)";
  bottomFaces[i].style.transform = "rotateX(-90deg) translateZ(50px)";
  backFaces[i].style.transform = "rotateY(180deg) translateZ(50px)";
  frontFaces[i].style.transform = "rotateY(0deg) translateZ(50px)";
}

// Align pieces
pieces[0].style.transform =  "translate3d(0px, 0px, 100px) rotateX(0deg)";
pieces[1].style.transform =  "translate3d(100px, 0px, 100px) rotateX(0deg)";
pieces[2].style.transform =  "translate3d(200px, 0px, 100px) rotateX(0deg)";
pieces[3].style.transform =  "translate3d(0px, 100px, 100px) rotateX(0deg)";
pieces[4].style.transform =  "translate3d(100px, 100px, 100px) rotateX(0deg)";
pieces[5].style.transform =  "translate3d(200px, 100px, 100px) rotateX(0deg)";
pieces[6].style.transform =  "translate3d(0px, 200px, 100px) rotateX(0deg)";
pieces[7].style.transform =  "translate3d(100px, 200px, 100px) rotateX(0deg)";
pieces[8].style.transform =  "translate3d(200px, 200px, 100px) rotateX(0deg)";
pieces[9].style.transform =  "translate3d(0px, 0px, 0px) rotateX(0deg)";
pieces[10].style.transform = "translate3d(100px, 0px, 0px) rotateX(0deg)";
pieces[11].style.transform = "translate3d(200px, 0px, 0px) rotateX(0deg)";
pieces[12].style.transform = "translate3d(0px, 100px, 0px) rotateX(0deg)";
pieces[13].style.transform = "translate3d(100px, 100px, 0px) rotateX(0deg)";
pieces[14].style.transform = "translate3d(200px, 100px, 0px) rotateX(0deg)";
pieces[15].style.transform = "translate3d(0px, 200px, 0px) rotateX(0deg)";
pieces[16].style.transform = "translate3d(100px, 200px, 0px) rotateX(0deg)";
pieces[17].style.transform = "translate3d(200px, 200px, 0px) rotateX(0deg)";
pieces[18].style.transform = "translate3d(0px, 0px, -100px) rotateX(0deg)";
pieces[19].style.transform = "translate3d(100px, 0px, -100px) rotateX(0deg)";
pieces[20].style.transform = "translate3d(200px, 0px, -100px) rotateX(0deg)";
pieces[21].style.transform = "translate3d(0px, 100px, -100px) rotateX(0deg)";
pieces[22].style.transform = "translate3d(100px, 100px, -100px) rotateX(0deg)";
pieces[23].style.transform = "translate3d(200px, 100px, -100px) rotateX(0deg)";
pieces[24].style.transform = "translate3d(0px, 200px, -100px) rotateX(0deg)";
pieces[25].style.transform = "translate3d(100px, 200px, -100px) rotateX(0deg)";
pieces[26].style.transform = "translate3d(200px, 200px, -100px) rotateX(0deg)";

// Set piece transform origin to cube center
for (let i = 0; i < pieces.length; i++) {
    [_, tx, ty, tz, _] = pieces[i].style.transform.match(/-?\d+\.?\d*/g).map(Number);
    
    pieces[i].style.transformOrigin =  (-tx + 150) + "px " + (-ty + 150) + "px " + (-tz) + "px";   
}

// Set face overlays
let cases = [
  [pieceIndicesX1, "rgb(183, 18, 52)", "rgb(165, 16, 47)", ".face-left"],
  [pieceIndicesX3, "rgb(255, 88, 0)", "rgb(230, 79, 0)", ".face-right"],
  [pieceIndicesY1, "rgb(255, 213, 0)", "rgb(230, 192, 0)", ".face-top"],
  [pieceIndicesY3, "rgb(255, 255, 255)", "rgb(230, 230, 230)", ".face-bottom"],
  [pieceIndicesZ3, "rgb(0, 70, 173)", "rgb(0, 63, 156)", ".face-back"],
  [pieceIndicesZ1, "rgb(0, 155, 72)", "rgb(0, 140, 65)", ".face-front"]
];

for (let i = 0; i < cases.length; i++) {
  for (let j = 0; j < cases[i][0].length; j++) {
    let faceOverlay = document.createElement("div");
    faceOverlay.classList.add("face-overlay");
    faceOverlay.style.background = cases[i][1];
    faceOverlay.style.boxShadow = "0 0 5px 10px " + cases[i][2] + " inset";
    faceOverlay.style.transform = "translateZ(1px)";
    
    pieces[cases[i][0][j]].querySelector(cases[i][3]).appendChild(faceOverlay);
  }
}

function getRotationAxis(face, faceAnchor) {
  if (["face-front", "face-back", "face-top", "face-bottom"].includes(face) && ["face-anchor-up", "face-anchor-down"].includes(faceAnchor)) {
    return "X";
  } else if (["face-front", "face-back", "face-left", "face-right"].includes(face) && ["face-anchor-left", "face-anchor-right"].includes(faceAnchor)) {
    return "Y";
  } else {
    return "Z";
  }
}

function isClockwiseRotation(face, faceAnchor) {
  if ((face === "face-front" && ["face-anchor-up", "face-anchor-right"].includes(faceAnchor)) || 
      (face === "face-back" && ["face-anchor-down", "face-anchor-right"].includes(faceAnchor)) || 
      (face === "face-left" && ["face-anchor-up", "face-anchor-right"].includes(faceAnchor)) || 
      (face === "face-right" && ["face-anchor-down", "face-anchor-right"].includes(faceAnchor)) || 
      (face === "face-top" && ["face-anchor-up", "face-anchor-right"].includes(faceAnchor)) || 
      (face === "face-bottom" && ["face-anchor-up", "face-anchor-left"].includes(faceAnchor))) {
    return true;
  } else {
    return false;
  }
}

function swapFaceOverlays(pieceIndices, axis, isClockwise) {
  let pieceIndicesSwaps = isClockwise ? pieceIndicesClockwiseSwaps : pieceIndicesAnticlockwiseSwaps;
  
  let faceIndicesSwaps;
  if (axis === "Z") { faceIndicesSwaps = faceIndicesZSwaps; }
  else if (axis === "X") { faceIndicesSwaps = faceIndicesXSwaps; }
  else { faceIndicesSwaps = faceIndicesYSwaps; }
  
  let p1, p2;
  for (let i = 0; i < pieceIndicesSwaps.length; i++) {
    p1 = pieces[pieceIndices[pieceIndicesSwaps[i][0]]];
    p2 = pieces[pieceIndices[pieceIndicesSwaps[i][1]]];
    
    for (let j = 0; j < faceIndicesSwaps.length; j++) {
      let [k, l] = faceIndicesSwaps[j];
      k = 2 * k + 1;
      l = 2 * l + 1;
      
      if (p1.childNodes[k].hasChildNodes() && p2.childNodes[l].hasChildNodes()) {       
        let c1 = p1.childNodes[k].removeChild(p1.childNodes[k].childNodes[0]);
        let c2 = p2.childNodes[l].removeChild(p2.childNodes[l].childNodes[0]);
        p1.childNodes[k].appendChild(c2);
        p2.childNodes[l].appendChild(c1);
      }
    }
  }
}

function rotate(leftIndex, rightIndex, forward) {
  canMove = false;
  if (leftIndex > rightIndex) {
    if (!forward) {
      scramble = [];
    }
    canMove = true;
    return;
  };

  let pieceIndices, axis, isClockwise;

  if (forward) {
    pieceIndices = scramble[leftIndex][0];
    axis = scramble[leftIndex][1];
    isClockwise = scramble[leftIndex][2];
  } else {
    pieceIndices = scramble[rightIndex][0];
    axis = scramble[rightIndex][1];
    isClockwise = !scramble[rightIndex][2];    
  }

  let rotationDuration = 400;
  let startTime = Date.now();
  
  (function helper() {
    let elapsed = Date.now() - startTime;
    let newRotationStyle = "rotate" + axis + "(" + (isClockwise ? "" : "-") + ((elapsed <= rotationDuration) * 90 * elapsed / rotationDuration) + "deg)";
    
    for (let i = 0; i < pieceIndices.length; i++) {
      pieces[pieceIndices[i]].style.transform = pieces[pieceIndices[i]].style.transform.replace(/rotate.\(\S+\)/, newRotationStyle);
    }

    if (elapsed <= rotationDuration) {
      requestAnimationFrame(helper);
    } else {
      swapFaceOverlays(pieceIndices, axis, isClockwise);
      if (forward) {
        rotate(leftIndex + 1, rightIndex, true);
      } else {
        rotate(leftIndex, rightIndex - 1, false);
      }
    }
  })();
}

function mousedown(mdEvent) {
  if (!canMove) return;
  var [_, pX, pY] = cube.style.transform.match(/-?\d+\.?\d*/g).map(Number);
  var piece = mdEvent.target.closest(".piece");
  var face = mdEvent.target.closest(".face");
  
  if (face) {
    faceAnchors[0].style.transform = piece.style.transform + " " + face.style.transform + "translateY(-100px) translateZ(2px)";
    faceAnchors[1].style.transform = piece.style.transform + " " + face.style.transform + "translateY(100px) translateZ(2px)";
    faceAnchors[2].style.transform = piece.style.transform + " " + face.style.transform + "translateX(-100px) translateZ(2px)";
    faceAnchors[3].style.transform = piece.style.transform + " " + face.style.transform + "translateX(100px) translateZ(2px)";
  }
  
  function mousemove(mmEvent) {    
    if (face) {
      let faceAnchor = mmEvent.target.closest(".face-anchor");
      if (faceAnchor) {
        let axis = getRotationAxis(face.classList[1], faceAnchor.classList[1]);
        let isClockwise = isClockwiseRotation(face.classList[1], faceAnchor.classList[1]);
        let pieceIndex = parseInt(piece.id);
        
        let pieceIndices;
        if (axis === "X") {
          if (pieceIndicesX1.includes(pieceIndex)) {
            pieceIndices = pieceIndicesX1;
          } else if (pieceIndicesX2.includes(pieceIndex)) {
            pieceIndices = pieceIndicesX2;
          } else { 
            pieceIndices = pieceIndicesX3;
          }
        } else if (axis === "Y") {
          if (pieceIndicesY1.includes(pieceIndex)) { 
            pieceIndices = pieceIndicesY1;
          } else if (pieceIndicesY2.includes(pieceIndex)) { 
            pieceIndices = pieceIndicesY2; 
          } else { 
            pieceIndices = pieceIndicesY3;
          }          
        } else {
          if (pieceIndicesZ1.includes(pieceIndex)) { 
            pieceIndices = pieceIndicesZ1; 
          } else if (pieceIndicesZ2.includes(pieceIndex)) { 
            pieceIndices = pieceIndicesZ2; 
          } else { 
            pieceIndices = pieceIndicesZ3;
          }          
        }
        
        mouseup();
        scramble.push([pieceIndices, axis, isClockwise]);
        rotate(scramble.length - 1, scramble.length - 1, true);
      }
    } else {
      cube.style.transform =
        "translateZ(-150px) " + 
        "rotateX(" + (pX - (mmEvent.pageY - mdEvent.pageY) / 2) + "deg) " +
			  "rotateY(" + (pY + (mmEvent.pageX - mdEvent.pageX) / 2) + "deg)";
    }
  }
  
  function mouseup(muEvent) {
    faceAnchors[0].style.transform = "translateX(100px) translateY(100px)";
    faceAnchors[1].style.transform = "translateX(100px) translateY(100px)";
    faceAnchors[2].style.transform = "translateX(100px) translateY(100px)";
    faceAnchors[3].style.transform = "translateX(100px) translateY(100px)";
    
    scene.removeEventListener("mousemove", mousemove);
    scene.removeEventListener("mouseup", mouseup);
    scene.addEventListener("mousedown", mousedown);
  }
  
 	scene.addEventListener("mousemove", mousemove);
	scene.addEventListener("mouseup", mouseup);
	scene.removeEventListener("mousedown", mousedown);
}

scene.addEventListener("mousedown", mousedown);

function reset() {    
  let rotationDuration = Math.max(3000, 400 * scramble.length);
  let startTime = Date.now();
  var [_, pX, pY] = cube.style.transform.match(/-?\d+\.?\d*/g).map(Number);
  var dX = (-30 - pX) / rotationDuration;
  var dY = (45 - pY) / rotationDuration;
  
  (function helper() {
    let elapsed = Date.now() - startTime;

    cube.style.transform = 
    "translateZ(-150px)" + 
    "rotateX(" + (pX + dX * elapsed) + "deg) " +
    "rotateY(" + (pY + dY * elapsed) + "deg)";

    if (elapsed <= rotationDuration) {
      requestAnimationFrame(helper);
    } else {
      cube.style.transform = "translateZ(-150px) rotateX(-30deg) rotateY(45deg)";
    }
  })();

  rotate(0, scramble.length - 1, false);
}

function shuffle(shuffleCount = 20) {
  for (let i = 0; i < shuffleCount; i++) {
    rand = Math.floor(Math.random() * 18);
    if (rand === 0) { scramble.push([pieceIndicesX1, "X", true]); }
    else if (rand === 1) { scramble.push([pieceIndicesX2, "X", true]); }
    else if (rand === 2) { scramble.push([pieceIndicesX3, "X", true]); }
    else if (rand === 3) { scramble.push([pieceIndicesY1, "Y", true]); }
    else if (rand === 4) { scramble.push([pieceIndicesY2, "Y", true]); }
    else if (rand === 5) { scramble.push([pieceIndicesY3, "Y", true]); }
    else if (rand === 6) { scramble.push([pieceIndicesZ1, "Z", true]); }
    else if (rand === 7) { scramble.push([pieceIndicesZ2, "Z", true]); }
    else if (rand === 8) { scramble.push([pieceIndicesZ3, "Z", true]); }
    else if (rand === 9) { scramble.push([pieceIndicesX1, "X", false]); }
    else if (rand === 10) { scramble.push([pieceIndicesX2, "X", false]); }
    else if (rand === 11) { scramble.push([pieceIndicesX3, "X", false]); }
    else if (rand === 12) { scramble.push([pieceIndicesY1, "Y", false]); }
    else if (rand === 13) { scramble.push([pieceIndicesY2, "Y", false]); }
    else if (rand === 14) { scramble.push([pieceIndicesY3, "Y", false]); }
    else if (rand === 15) { scramble.push([pieceIndicesZ1, "Z", false]); }
    else if (rand === 16) { scramble.push([pieceIndicesZ2, "Z", false]); }
    else if (rand === 17) { scramble.push([pieceIndicesZ3, "Z", false]); }
  }

  rotate(scramble.length - shuffleCount, scramble.length - 1, true);
}