let currentPressure = 0.5;
let thicksize;
let img;
let paintModeActive = false;
let popupsmode;
let w = 50;
let stuff;
let h = 50;
let history = [];
let redoStack = [];
let colorbg = 255;
let mode = "brush";
let brushcolor = "black";
let brushSize;
let canvasLayer;
let prevX, prevY;
let resolutionW;
let resolutionH;
let pX, pY;
let hideornahscore = 0;
let userText = "";

const arraymode = ["rect", "triangle", "circle"];
const randomValue = arraymode[Math.floor(Math.random() * arraymode.length)];

function preload() {
    img = loadImage("tumblr_a1036db59fe9a6705a2a95f9dc95eb92_80fbbcf5_640.webp");
}

function screen_size() {
    let user = prompt("Choose your pixel dimensions(using numbers next to the shape)\n1. default")
    if (user === "1") {
        resolutionW = '900';
        resolutionH = '505';
    } else if (user === "secret") {
        resolutionW = '100';
        resolutionH = '100';
    }
}

function setup() {
    screen_size();
    let canvas = createCanvas(resolutionW, resolutionH);
    canvas.elt.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'pen' || event.pointerType === 'touch') {
            currentPressure = event.pressure;
        } else {
            currentPressure = 0.5;
        }
    })
    canvas.parent("canvas-wrapper");
    canvasLayer = createGraphics(resolutionW, resolutionH);
    canvasLayer.background(colorbg);
    background(colorbg); // white background
    list1();
    list2()
    slider();
    sliderclear();
    canvasLayer.tint(255, 3);
    canvasLayer.image(img, 0, 0, resolutionW, resolutionH);
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
            let dynamicSize = brushSize * currentPressure
            canvasLayer.stroke(brushcolor);
            canvasLayer.strokeWeight(dynamicSize);
            canvasLayer.line(pmouseX, pmouseY, mouseX, mouseY);
        }

        if (mode === "normal_pen") {
            canvasLayer.stroke(brushcolor);
            canvasLayer.strokeWeight(brushSize);
            canvasLayer.line(pmouseX, pmouseY, mouseX, mouseY);
        }

        if (mode === "airbrush") {
            let airbrushColor = color(brushcolor);
            airbrushColor.setAlpha(100);
            canvasLayer.stroke(airbrushColor);
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


    if (mode === "normal_pen") {
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
        redraw();
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
        redraw();
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

function clear_screen() {
    canvasLayer = createGraphics(resolutionW, resolutionH);
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

    document.getElementById("brushtype").addEventListener("click", () => {
        document.getElementById("popup-brush").style.display = "flex";
    })

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
            thicksize = 1;
            document.getElementById("scorethick").textContent = thicksize
        }
    })

    document.getElementById("shapes").addEventListener("click", () => {
        mode = "none";
        let user = prompt("Choose your shape (using numbers next to the shape)\n1. circle | 2. rectangle | 3. triangle | 4. random");
        switch (user) {

            case "1":
            case "3.14": //easter egg???
                mode = "circle"
                break;

            case "2":
                mode = "rect"
                break;

            case "3":
                mode = "triangle"
                break;

            case "4":
                const arraymode = ['rect', 'triangle', 'circle']; 
                const randomValue = arraymode[Math.floor(Math.random() * arraymode.length)]; 
                mode = randomValue;
                break;

            default:
                break;
        }
    });

    document.getElementById("brushtype").addEventListener("click", () => {
        mode = "none";
        let user = prompt("Choose your type of brush (using numbers next to the shape)\n1. pen | 2. normal | 3. airbrush | 4. pencil");
        switch (user) {

            case "1":
                mode = "normal_pen"
                break;

            case "2":
                mode = "brush"
                break;

            case "3":
                mode = "airbrush"
                break;

            case "4":
                const arraymode = ['rect', 'triangle', 'circle']; 
                const randomValue = arraymode[Math.floor(Math.random() * arraymode.length)]; 
                mode = randomValue;
                break;

            default:
                break;
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
    document.getElementById("popup-manual").style.display = "flex";
}

function hide() {

}

