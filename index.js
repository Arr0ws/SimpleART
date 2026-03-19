//TODO: Add a button so you can use the brush again after pressing the pixel button
//Goodluck!

let paintModeActive = false;
let popupsmode;
let w = 50;
let h = 50;
let history = [];
let redoStack = [];
let colorbg = 255;
let mode = "brush";
let brushcolor = "black";
let brushSize = 20;
let canvasLayer;
let prevX, prevY;
let pX, pY;

function setup() {
    let canvas = createCanvas(900, 505);
    canvas.parent("canvas-wrapper");
    canvasLayer = createGraphics(900, 505);
    canvasLayer.background(colorbg);
    background(colorbg); // white background
    list1();
    list2();
    history.push(canvasLayer.get());
}

function draw() {
    background(colorbg);
    image(canvasLayer, 0, 0);

    if (mouseIsPressed) {
        if (mode === "brush") {
            //HOW DID I CODE THIS LAST NIGHT???

            /*canvasLayer.stroke(brushcolor)
            canvasLayer.strokeWeight(brushSize)

            if (prevX !== undefined && prevY !== undefined ) {
                canvasLayer.line(prevX, prevY, mouseX, mouseY)
            }

            prevX = mouseX
            prevY = mouseY*/

            canvasLayer.stroke(brushcolor);
            canvasLayer.strokeWeight(brushSize);
            canvasLayer.line(pmouseX, pmouseY, mouseX, mouseY);
        }

        if (mode === "pixel") {
            //HOW???
            canvasLayer.noStroke();
            let x = floor(mouseX / brushSize) * brushSize + brushSize / 2; //Math
            let y = floor(mouseY / brushSize) * brushSize + brushSize / 2;
            canvasLayer.fill(brushcolor);

            if (x !== pX || y !== pY) {
                canvasLayer.rect(x, y, brushSize, brushSize);
            }

            pX = x;
            pY = y;
        }
    } else {
        prevX = undefined;
        prevY = undefined;
        pX = undefined;
        pY = undefined;
    }
    //Basically making a circle following the mouse cursor
    if (mode === "brush") {
        noFill();
        stroke(0);
        circle(mouseX, mouseY, brushSize);
    }
    //Same stuff but box
    if (mode === "pixel") {
        let followX = floor(mouseX / brushSize) * brushSize + brushSize / 2;
        let followY = floor(mouseY / brushSize) * brushSize + brushSize / 2;

        noFill();
        stroke(0);
        rect(followX, followY, brushSize, brushSize);
    }

    if (mode === "paint") {
        noFill();
        stroke(80);
        circle(mouseX, mouseY, 80);
    }

    if (mode === "rect") {
        noFill();
        stroke(0);
        rect(mouseX, mouseY, 80, 80);
    }

    if (mode === "circle") {
        noFill();
        stroke(0);
        circle(mouseX, mouseY, 80);
    }

    if (mode === "triangle") {
        noFill();
        stroke(0);
        triangle(mouseX, mouseY, mouseX + 50, mouseY, mouseX + 25, mouseY - 50);
    }

    if (paintModeActive && mouseIsPressed) {
        canvasLayer.background(colorbg);
        paintModeActive = false;
    }
}

function mousePressed() {
    if (mode === "rect") {
        canvasLayer.noFill();
        canvasLayer.stroke("black");
        canvasLayer.strokeWeight(1);
        canvasLayer.rect(mouseX, mouseY, 80, 80);
    }

    if (mode === "circle") {
        canvasLayer.noFill();
        canvasLayer.stroke("black");
        canvasLayer.strokeWeight(1);
        canvasLayer.circle(mouseX, mouseY, 80);
    }

    if (mode === "triangle") {
        canvasLayer.noFill();
        canvasLayer.stroke("black");
        canvasLayer.strokeWeight(1)
        canvasLayer.triangle(mouseX, mouseY, mouseX + 50, mouseY, mouseX + 25, mouseY - 50);
    }
}

//If the mouse are released it will save the drawing to an array
//idk how to explain it more better
function mouseReleased() {
    history.push(canvasLayer.get());
    redoStack = [];
}
//keys! the only easy thing to code
function keyPressed() {
    switch (key) {
        case "z":
            if (keyIsDown(CONTROL)) {
                undo();
            }
            break;

        case "y":
            if (keyIsDown(CONTROL)) {
                redo();
            }
            break;
        //saved the picture
        case "x":
            if (keyIsDown(CONTROL)) {
                popupsave();
            }
            break;
        //escaped the paint thingy
        case "Escape":
            document.getElementById("popup-color").style.display = "none";
            document.getElementById("popup").style.display = "none";
            break;

        default:
            break;
    }
}
//undo button
//if it's more than two then it will undo it
//it will try to found the most recent image and show it
function undo() {
    if (history.length > 1) {
        redoStack.push(history.pop());
        let img = history[history.length - 1];
        canvasLayer.clear();
        canvasLayer.image(img, 0, 0);
    }
}
//redo button!
//if it's more than one then it will redo it
//opposite of undo
function redo() {
    if (redoStack.length > 0) {
        let img = redoStack.pop();
        history.push(img);
        canvasLayer.clear();
        canvasLayer.image(img, 0, 0);
    }
}

function popupsave() {
    document.getElementById("popup-save").style.display = "flex";
    mode = "none";
}
//List of stuff (part 1)
function list1() {
    //Pixel art
    document.getElementById("pixel").addEventListener("click", () => {
        mode = "pixel";
    });

    document.getElementById("inputsave").addEventListener("click", () => {
        let user = document.getElementById("inputbox").value;
        if (user) {
            saveCanvas(user, "png");
        }
        document.getElementById("popup-save").style.display = "none";
    });

    //Opening the paint pop up
    document.getElementById("Paint").addEventListener("click", () => {
        document.getElementById("popup").style.display = "flex";
        mode = "paint";
    });

    document.getElementById("shapes").addEventListener("click", () => {
        let user = prompt("which shape?");

        if (user === "rectangle") {
            mode = "rect";
        } else if (user === "triangle") {
            mode = "triangle";
        } else if (user === "circle" || "3.14") {
            mode = "circle";
        } 
    });

    document.getElementById("brushpickcolor").addEventListener("click", () => {
        document.getElementById("popup-color").style.display = "flex";
    });
    //Eraser
    document.getElementById("Eraser").addEventListener("click", () => {
        brushSize = 80;
        brushcolor = "white";
        document.getElementById("score").textContent = brushSize;
    });
    //Switches back to brush
    document.getElementById("Normal").addEventListener("click", () => {
        brushcolor = "black";
        mode = "brush";
        brushSize = 20;
        document.getElementById("score").textContent = brushSize;
    });
}
//List of stuff (part 2)
function list2() {
    //Making the brush more smaller
    document.getElementById("-").addEventListener("click", () => {
        brushSize--;
        document.getElementById("score").textContent = brushSize;
    });
    //Making the brush more BIGGERRRR
    document.getElementById("+").addEventListener("click", () => {
        brushSize++;
        document.getElementById("score").textContent = brushSize;
    });

}
