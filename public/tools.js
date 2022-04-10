let toolsCont = document.querySelector(".tools-cont");
toolsCont.style.display = "none";

let pencilToolCont = document.querySelector(".pencil-tool-cont");
pencilToolCont.style.display = "none";

let eraserToolCont = document.querySelector(".eraser-tool-cont");
eraserToolCont.style.display = "none";

let optionsCont = document.querySelector(".options-cont");
let optionsFlag = false;

let pencilFlag = false;
let eraserFlag = false;

optionsCont.addEventListener("click", (e) => {

    // true -> show tools, false -> hide tools
    optionsFlag = !optionsFlag;
    if (optionsFlag) {
        openTools();
    } else {
        closeTools();
    }

});

function openTools() {
    let iconElem = optionsCont.children[0];

    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-times");

    toolsCont.style.display = "flex";
}
function closeTools() {
    let iconElem = optionsCont.children[0];

    iconElem.classList.remove("fa-times");
    iconElem.classList.add("fa-bars");
    toolsCont.style.display = "none";

    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
    pencilFlag = false;
    eraserFlag = false;
}

toolsCont.children[0].addEventListener("click", (e) => {
    pencilFlag = !pencilFlag;
    if (pencilFlag) {
        pencilToolCont.style.display = "block"
    } else {
        pencilToolCont.style.display = "none"
    }
})

toolsCont.children[1].addEventListener("click", (e) => {
    eraserFlag = !eraserFlag;
    if (eraserFlag) {
        eraserToolCont.style.display = "flex"
    } else {
        eraserToolCont.style.display = "none"
    }
})

// add sticky note
// let sticky = toolsCont.children[4];

{/* <div class="sticky-cont">
    <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
        <textarea></textarea>
    </div>
</div> */}

// let stickyTemplateHTML = `    
//     <div class="header-cont">
//         <div class="minimize"></div>
//         <div class="remove"></div>
//     </div>
//     <div class="note-cont">
//         <textarea></textarea>
//     </div>
// `

// let upload = toolsCont.children[3];
toolsCont.children[3].addEventListener("click", (event) => {

    // open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHTML_ = `    
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <img src = "${url}">
        </div>
        `
        createSticky(stickyTemplateHTML_);

    })
})
toolsCont.children[4].addEventListener("click", (event) => {
    let stickyTemplateHTML = `    
    <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
        <textarea spellcheck="false"></textarea>
    </div>
    `

    createSticky(stickyTemplateHTML);
})

function createSticky(stickyTemplateHTML) {

    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");

    stickyCont.innerHTML = stickyTemplateHTML;
    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");

    noteActions(stickyCont, minimize, remove);

    stickyCont.querySelector(".note-cont").onmousedown = function (event) {
        dragAndDrop(stickyCont, event);
    };

    stickyCont.querySelector(".note-cont").ondragstart = function () {
        return false;
    };

}

function noteActions(stickyCont, minimize, remove) {
    remove.addEventListener('click', (e) => {
        stickyCont.remove();
    })
    minimize.addEventListener('click', (e) => {
        let noteCont = stickyCont.querySelector(".note-cont");
        let display = getComputedStyle(noteCont).getPropertyValue("display");

        if (display == "none") {
            noteCont.style.display = "block";
        } else {
            noteCont.style.display = "none";
        }
    })
}

function dragAndDrop(element, event) {

    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;
    document.body.append(element);

    moveAt(event.pageX, event.pageY);

    // moves the element at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the element on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the element, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };

}