var enteringFormula = false
//var typing = false
var targetCell = null
var variables = {}



function initialize() {


  let inputs = document.getElementsByTagName('input')
  for (i = 0; i < inputs.length; ++i) {

    // create a variable for each cell and store it in a dictionary
    let cell = new DataflowConstraintVariable(null, null, true, [])
    variables[inputs[i].id] = cell



    // event listener for mouse click in cell
    inputs[i].addEventListener('click', function (e) {
      if (enteringFormula && targetCell != null) {
        let inputCell = this.id
        targetCell.value += inputCell
        targetCell.dispatchEvent(new Event('input'))
        targetCell.focus()
      }
    })

    // event listener for keyup (typing) in cell
    inputs[i].addEventListener('keyup', function (e) {

      if (this.value.charAt(0) == '=') {
        enteringFormula = true
        targetCell = this
      } else {
        enteringFormula = false
        targetCell = null
      }
    })

    // event listener for keydown (typing) in cell
    inputs[i].addEventListener('input', function (e) {
      // keep equation_input in sync with the normal input cell
      let equation_input = document.getElementById("equation_input")
      equation_input.value = this.value
    })


    // event listener for blur (focus lost) in cell
    inputs[i].addEventListener('blur', function (e) {

      if (isNaN(this.value)) {
        removeCellHighlights()
      }

      if (!enteringFormula) { // TODO: handle empty cells. Tell when the cell is empty vs when it should display 0.
        let equation_input = document.getElementById("equation_input")
        variables[this.id].set(equation_input.value)
        reloadCells()
      }


    })

    // event listener for focus (focus gained) in cell
    inputs[i].addEventListener('focus', function (e) {
      if (!enteringFormula) {
        let equation_input = document.getElementById("equation_input")
        equation_input.value = variables[this.id].equation

        if (variables[this.id].userSet) {
          this.value = variables[this.id].value
        }
        // if this is an equation, we want to highlight the cells that are being referenced
        if (isNaN(equation_input.value)) {
          highlightFormulaCells(this.value)
        }

      }
    })

  }


  // event listener for enter key
  document.addEventListener("keydown", function (event) {

    // arrow keys based on event.code
    if (event.code == 'ArrowUp' || event.code == 'ArrowDown' || event.code == 'ArrowLeft' || event.code == 'ArrowRight' || event.code == 'Enter' || event.code == 'NumpadEnter' || event.code == 'Tab') {

      // these event signify the end of a formula entry, so we update the global variables
      enteringFormula = false
      targetCell = null

      let nextCell = null
      let activeCell = document.activeElement.id


      if (event.code == 'ArrowUp') {
        nextCell = document.getElementById(nextCellUp(activeCell))
      } else if (event.code == 'ArrowDown') {
        nextCell = document.getElementById(nextCellDown(activeCell))
      } else if (event.code == 'ArrowLeft') {
        nextCell = document.getElementById(nextCellLeft(activeCell))
      } else if (event.code == 'ArrowRight') {
        nextCell = document.getElementById(nextCellRight(activeCell))
      } else if (event.code == 'Enter' || event.code == 'NumpadEnter') {
        document.activeElement.blur()
        nextCell = document.getElementById(nextCellDown(activeCell))
      }

      if (nextCell != null) {
        document.activeElement.blur()
        nextCell.focus()
      }
    }
  })
}


function reloadCells() {
  inputs = document.getElementsByTagName('input')
  for (let i = 0; i < inputs.length; i++) {
    if (variables[inputs[i].id].userSet) {
      inputs[i].value = variables[inputs[i].id].get()
    } else {
      inputs[i].value = ""
    }
  }
}


// neighbor cellid calculations
function nextCellDown(currentCellID) {
  return currentCellID.charAt(0) + (parseInt(currentCellID.substring(1)) + 1).toString()
}

function nextCellUp(currentCellID) {
  return currentCellID.charAt(0) + (parseInt(currentCellID.substring(1)) - 1).toString()
}

function nextCellRight(currentCellID) {
  return String.fromCharCode(currentCellID.charCodeAt(0) + 1) + currentCellID.substring(1)
}

function nextCellLeft(currentCellID) {
  return String.fromCharCode(currentCellID.charCodeAt(0) - 1) + currentCellID.substring(1)
}


// cell highlighting
function highlightFormulaCells(formula) {
  let formulaCells = formula.match(/[A-Z]+\d+/g)
  if (formulaCells != null) {
    for (let i = 0; i < formulaCells.length; i++) {
      document.getElementById(formulaCells[i]).classList.add('highlighted_cell')
    }
  }
}

// removes highlighting from all cells
function removeCellHighlights() {
  let inputs = document.getElementsByTagName('input')
  for (input of inputs) {
    input.classList.remove('highlighted_cell')
  }
}

initialize()