let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



// pencil tool options
let pencilColors = document.querySelectorAll(".pencil-color");
let pencilWidthEle = document.querySelector(".pencil-width");
let eraseWidthEle = document.querySelector(".eraser-width");

let pencilColor = "red";
let eraseColor = "white";
let pencilWidth = pencilWidthEle.value;
let eraserWidth = eraseWidthEle.value;

let tool = canvas.getContext("2d");

let isMouseDown = false;

tool.strokeStyle = pencilColor;
tool.lineWidth = pencilWidth;

let undoRedoTracker = [];
let tracker = 0;

// mousedown -> start new path, mousemove -> path fill 
canvas.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    // beginStroke({
    //     x: e.clientX,
    //     y: e.clientY
    // })
    let data = {
        x: e.clientX,
        y: e.clientY
    }
    socket.emit("beginPath", data);

})
canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {

        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraseColor : pencilColor,
            width: eraserFlag ? eraserWidth : pencilWidth
        }
        socket.emit("drawStroke", data);

        // drawStroke({
        //     x: e.clientX,
        //     y: e.clientY,
        //     color: eraserFlag ? eraseColor : pencilColor,
        //     width: eraserFlag ? eraserWidth : pencilWidth
        // })
    }
})
canvas.addEventListener("mouseup", (e) => {
    isMouseDown = false;

    // store the state of canvas in tracker
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    tracker = undoRedoTracker.length - 1;

    console.log(tracker);
})

function beginStroke(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}
function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}
pencilColors.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        pencilColor = color;
        tool.strokeStyle = pencilColor;
    })
})
pencilWidthEle.addEventListener("change", (e) => {
    pencilWidth = pencilWidthEle.value;
    tool.lineWidth = pencilWidth;
})
eraseWidthEle.addEventListener("change", (e) => {
    eraserWidth = eraseWidthEle.value;
    tool.lineWidth = eraserWidth;
})

// canvas.js is below tools.js, so we can
// access the eraser element which is in tools.js
// from here
toolsCont.children[1].addEventListener("click", (e) => {

    if (eraserFlag) {
        tool.strokeStyle = eraseColor;
        tool.lineWidth = eraserWidth;
    } else {
        tool.strokeStyle = pencilColor;
        tool.lineWidth = pencilWidth;
    }

})

let download = toolsCont.children[2];
download.addEventListener("click", (e) => {

    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board";
    a.click();

})

let redo = toolsCont.children[5];
redo.addEventListener("click", (e) => {

    if (tracker < undoRedoTracker.length - 1) {
        tracker++;
        let trackObj = {
            trackValue: tracker,
            undoRedoTracker: undoRedoTracker
        }
        socket.emit("redoUndo", trackObj);
        // undoRedoCanvas(trackObj);
    }

})

let undo = toolsCont.children[6];
undo.addEventListener("click", (e) => {

    if (tracker >= 0) {
        tracker--;
        let trackObj = {
            trackValue: tracker,
            undoRedoTracker: undoRedoTracker
        }
        socket.emit("redoUndo", trackObj);
        // undoRedoCanvas(trackObj);
    }

})

function undoRedoCanvas(trackObj) {
    tracker = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let img = new Image();
    img.src = undoRedoTracker[tracker];
    img.onload = (e) => {
        tool.clearRect(0, 0, canvas.width, canvas.height);
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

socket.on("beginPath", (data) => {
    // data from server
    beginStroke(data);
})
socket.on("drawStroke", (data) => {
    drawStroke(data);
})
socket.on("redoUndo", (data) => {
    undoRedoCanvas(data);
})