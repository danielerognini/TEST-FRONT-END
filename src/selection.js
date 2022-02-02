import { fetchCompleted } from "./data.js";

function overlaps(rect1, rect2) { //checks if 2 rectangles are overlapping (this is using a simple AABB collision logic which is commonly used in videogames)
    if (rect1.right < rect2.left) return false;
    if (rect1.left > rect2.right) return false;
    if (rect1.bottom < rect2.top) return false;
    if (rect1.top > rect2.bottom) return false;
    return true;
}

let mouseDown = false;
let x, y
let boxes

// watch for values
window.addEventListener('mousedown', event=>{ //listens for mouse click
    if(fetchCompleted) { //checks if data fetching is finished
        if(!boxes) { //calculates boxes only after fetching is complete
            boxes = document.querySelectorAll('.box')
        }

        mouseDown = true

        //console.log("Mouse Down", mouseDown) //used for debugging

        //saves mouse coordinates
        x = event.clientX 
        y = event.clientY

        let selector = `<div class='selector'></div>` //creates a selector variable
        document.querySelector(".holder").innerHTML = selector //places the selector inside the holder div

        //places the selector on mouse coordinates
        document.querySelector('.selector').style.top = `${y}px`
        document.querySelector('.selector').style.left = `${x}px`
    }
})

window.addEventListener('mousemove', event=>{ //listens for mouse move
    let selector = document.querySelector('.selector') //registers the previously created selector

    if(mouseDown){ //happens when mouse button is held down
        //console.log("Mouse Down", mouseDown) //used for debugging

        //stretches the selector to follow the mouse
        selector.style.width = Math.abs( x - event.clientX) + 'px';
        selector.style.height = Math.abs( y - event.clientY) + 'px';
    
        //depending on where the mouse moves we need to move the selector accordingly
        if (event.clientX < x ) {
            selector.style.left = event.clientX + 'px';
        }

        if (event.clientY < y ) {
            selector.style.top = event.clientY + 'px';
        }

        select(selector);
    }   
})

function select(selector) {
    boxes.forEach(box=>{ //for each div:
        //console.log(box.childNodes[7]) //used for debugging
        overlaps(box.getBoundingClientRect(), selector.getBoundingClientRect()) //checks if it's overlapping with the selector
        ? //if yes:
        box.childNodes[7].classList.add('selected') //adds the selected class to the current box
        : //else
        box.childNodes[7].classList.remove('selected'); //removes the selected class from the selected box
    })
}

window.addEventListener("mouseup", event=>{ //listens for mouse button to be released
    let selector = document.querySelector('.selector') //registers the previously created selector

    mouseDown = false
    if(x === event.clientX && y === event.clientY) {
        selector.style.width = 1 + 'px';
        selector.style.height = 1 + 'px';

        select(selector);
    }
    //console.log("Mouse Down", mouseDown) //used for debugging
    document.querySelector(".holder").innerHTML = ''; //sets the holder div to be empty (to delete the selector)
    printData();
})

function printData() {
    let selectedItems = document.getElementsByClassName('selected');

    if(selectedItems.length === 0) {
        document.getElementById('unselected-data').classList.remove('hidden')
        let elementsToHide = document.getElementsByClassName('selected-data')
        for(let i = 0; i < elementsToHide.length; i++) {
            elementsToHide[i].classList.add('hidden')
        }
    } else {
        document.getElementById('unselected-data').classList.add('hidden')
        let elementsToShow = document.getElementsByClassName('selected-data')
        for(let i = 0; i < elementsToShow.length; i++) {
            elementsToShow[i].classList.remove('hidden')
        }

        let selectedMonths = '';
        let docNumber = 0;
        let totalAmount = 0;

        for(let i = 0; i < selectedItems.length; i++) {
            let parent = selectedItems[i].parentNode;
            if(i > 0) {
                selectedMonths += ', ';
            }
            
            selectedMonths += parent.childNodes[1].innerHTML;
    
            docNumber += parseInt(parent.childNodes[3].childNodes[1].childNodes[0].nodeValue);
            totalAmount += parseInt(parent.childNodes[3].childNodes[3].childNodes[0].nodeValue);
        }

        document.getElementById('months').innerHTML = selectedMonths
        document.getElementById('documents').innerHTML = docNumber;
        document.getElementById('total').innerHTML = totalAmount;
    }
}