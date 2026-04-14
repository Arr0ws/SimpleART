//TODO: Add a button so you can use the brush again after pressing the pixel button
//Goodluck!
let thicksize;
let img;
let paintModeActive = false;
let popupsmode;
let w = 50;
let h = 50;
let history = [];
let redoStack = [];
let colorbg = 255;
let mode = "brush";
let brushcolor = "black";
let brushSize;
let canvasLayer;
let prevX, prevY;
let pX, pY;
let hideornahscore = 0

const arraymode = ["rect", "triangle", "circle"];
const randomValue = arraymode[Math.floor(Math.random() * arraymode.length)];

function preload() {
    img = loadImage("tumblr_a1036db59fe9a6705a2a95f9dc95eb92_80fbbcf5_640.webp");
}

function setup() {
    let canvas = createCanvas(900, 505);
    canvas.parent("canvas-wrapper");
    canvasLayer = createGraphics(900, 505);
    canvasLayer.background(colorbg);
    background(colorbg); // white background
    list1();
    list2()
    slider();
    sliderclear();
    canvasLayer.tint(255, 3);
    canvasLayer.image(img, 0, 0, 900, 505);
    canvasLayer.noTint();
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
        stroke(thicksize)
        rect(mouseX, mouseY, brushSize, brushSize);
    }

    if (mode === "circle") {
        noFill();
        stroke(thicksize);
        circle(mouseX, mouseY, brushSize);
    }

    if (mode === "triangle") {
        noFill();
        stroke(thicksize);
        triangle(mouseX, mouseY, mouseX + 50, mouseY, mouseX + 25, mouseY - 50);
    }

    if (mode === "text") {
        textSize(brushSize);
        text(userText, mouseX, mouseY, brushSize);
    }

    if (paintModeActive && mouseIsPressed) {
        canvasLayer.background(colorbg);
        paintModeActive = false;
        canvasLayer.tint(255, 3);
        canvasLayer.image(img, 0, 0, 900, 505);
        canvasLayer.noTint();
    }
}

function mousePressed() {
    if (mode === "rect") {
        canvasLayer.noFill();
        canvasLayer.stroke("black");
        canvasLayer.strokeWeight(thicksize);
        canvasLayer.rect(mouseX, mouseY, brushSize, brushSize);
    }

    if (mode === "circle") {
        canvasLayer.noFill();
        canvasLayer.stroke("black");
        canvasLayer.strokeWeight(thicksize);
        canvasLayer.circle(mouseX, mouseY, brushSize);
    }

    if (mode === "triangle") {
        canvasLayer.noFill();
        canvasLayer.stroke("black");
        canvasLayer.strokeWeight(thicksize);
        canvasLayer.triangle(mouseX, mouseY, mouseX + 50, mouseY, mouseX + 25, mouseY - 50);
    }

    if (mode === "text") {
        canvasLayer.noFill();
        canvasLayer.stroke("black");
        canvasLayer.strokeWeight(thicksize);
        canvasLayer.textSize(brushSize)
        canvasLayer.text(userText, mouseX, mouseY, 24)
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

        case "Z":
        case "z":
            if (keyIsDown(CONTROL)) {
                undo();
            }
            break;

        case "Y":
        case "y":
            if (keyIsDown(CONTROL)) {
                redo();
            }
            break;
        //saved the picture
        case "X":
        case "x":
            if (keyIsDown(CONTROL)) {
                popupsave();
            }
            break;

        case "A":
        case "a":
            shapes()
            break;

        case "1":
            if (keyIsDown(CONTROL)) {
                hideornah()
            }
            break;

        case "m":
            if (keyIsDown(CONTROL)) {
                manualsalert()
            }
            break;

        case "2":
            if (keyIsDown(CONTROL)) {
                showornah()
            }
            break;

        case "9":
            brushSize++
            document.getElementById("score").textContent = brushSize
            document.getElementById("volume").value = brushSize;
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

function hideornah() {
    document.getElementById("hideornah").style.display = "none";
}

function showornah() {
    document.getElementById("hideornah").style.display = "block";
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
    /*
    document.getElementById("favcolor").addEventListener("input", (e) => {
        brushcolor = e.target.value;
    });*/

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

    document.getElementById("text").addEventListener("click", () => {
        let user = prompt("Enter a text and place it randomly!")
        if (user) {
            mode = "text";
            userText = user;
        }
    })

    document.getElementById("shapes").addEventListener("click", () => {
        let user = prompt("which shape?");

        if (user === "rectangle") {
            mode = "rect";
        } else if (user === "triangle") {
            mode = "triangle";
        } else if (user === "circle" || user === "3.14") {
            mode = "circle";
        } else if (user === "random") {
            const arraymode = ["rect", "triangle", "circle"];
            const randomValue = arraymode[Math.floor(Math.random() * arraymode.length)];
            mode = randomValue;
        }
    });

    document.getElementById("brushpickcolor").addEventListener("click", () => {
        document.getElementById("popup-color").style.display = "flex";
    });
    //Eraser
    document.getElementById("Eraser").addEventListener("click", () => {
        brushSize = 20;
        brushcolor = "white";
        document.getElementById("score").textContent = brushSize;
    });
    //Switches back to brush
    document.getElementById("Normal").addEventListener("click", () => {
        brushcolor = "black";
        mode = "brush";
        brushSize = 20;
        document.getElementById("score").textContent = brushSize;
        document.getElementById("volume").value = brushSize;
    });
}
//List of stuff (part 2)


function slider() {
    let user = document.getElementById("volume").value
    brushSize = Number(user)
    document.getElementById("score").textContent = brushSize
}

function sliderclear() {
    let user1 = document.getElementById("volume1").value
    thicksize = Number(user1)
    document.getElementById("scorethick").textContent = thicksize
}

function list2() {
    
}

function manualsalert() {
    alert(`
    - Ctrl z => undo
    - Ctrl y => redo    
    `)
}

function shapes() {
    let user = prompt("which shape?");
    if (user === "rectangle") {
        mode = "rect";
    } else if (user === "triangle") {
        mode = "triangle";
    } else if (user === "circle" || user === "3.14") {
        mode = "circle";
    } else if (user === "random") {
        const arraymode = ["rect", "triangle", "circle"];
        const randomValue = arraymode[Math.floor(Math.random() * arraymode.length)];
        mode = randomValue;
    }    
}

function hide() {

}















