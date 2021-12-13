/**
 * Global variable for determining if a user is entering a formula into a cell
 * @type {boolean}
 */
var enteringFormula = false

/**
 * Global variable for switching back to original cell when clicking on another cell while entering a formula
 * @type {object}
 */
var targetCell = null


/**
 * Initializes a constraint variable for each cell in the spreadsheet. Adds event listeners to all cells for focus, blur, click, keyup, keydown, and input
 * @function initialize
 */

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
        console.log(typeof(targetCell))
      } else {
        enteringFormula = false
        targetCell = null
      }
    })


    inputs[i].addEventListener('keydown', function (e) {
      if (e.key == 'F2') {
        let equationInput = document.getElementById("equationInput")
        this.value = equationInput.value
        this.dispatchEvent(new Event('input'))
      }
    })


    // event listener for keydown (typing) in cell
    inputs[i].addEventListener('input', function (e) {
      // keep equationInput in sync with the normal input cell
      let equationInput = document.getElementById("equationInput")
      equationInput.value = this.value
    })




    // event listener for focus (focus gained) in cell
    inputs[i].addEventListener('focus', function (e) {
      if (!enteringFormula) {
        let equationInput = document.getElementById("equationInput")
        equationInput.value = variables[this.id].equation

        if (variables[this.id].userSet) {
          this.value = variables[this.id].value
        }
        // if this is an equation, we want to highlight the cells that are being referenced
        if (isNaN(equationInput.value)) {
          highlightFormulaCells(equationInput.value)
        }
        boldColumnAndRowHeaders(this.id)
      }
    })


    // event listener for blur (focus lost) in cell
    inputs[i].addEventListener('blur', function (e) {
      let equationInput = document.getElementById("equationInput")

      if (isNaN(equationInput.value)) {
        removeCellHighlights()
      }

      if (!enteringFormula) { // TODO: handle empty cells. Tell when the cell is empty vs when it should display 0.
        variables[this.id].set(equationInput.value)
        reloadCells()
      }

      unBoldColumnAndRowHeaders(this.id)

    })
  }


  // event listener for enter keydown
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


/**
 * Gets the value of each "userSet" cell and updates the cell's value visually
 * @function reloadCells
 */
function reloadCells() {
  inputs = document.getElementsByTagName('input')
  for (let i = 0; i < inputs.length; i++) {
    if (variables[inputs[i].id].userSet) {
      inputs[i].value = variables[inputs[i].id].get()
    } else {
      // if the variable has not been set by a user, its value is technically 0, but we don't want to display that.
      inputs[i].value = ""
    }
  }
}


/**
 * Returns the cell ID of the cell below the current cell
 * @function nextCellDown
 * @param currentCellID the current cell ID
 * @returns {string} the cell ID of the cell below the current cell
 */
function nextCellDown(currentCellID) {
  return currentCellID.charAt(0) + (parseInt(currentCellID.substring(1)) + 1).toString()
}

/**
 * Returns the cell ID of the cell above the current cell
 * @function nextCellUp
 * @param currentCellID the current cell ID
 * @returns {string} the cell ID of the cell below the current cell
 */
function nextCellUp(currentCellID) {
  return currentCellID.charAt(0) + (parseInt(currentCellID.substring(1)) - 1).toString()
}

/**
 * Returns the cell ID of the cell top the right of the current cell
 * @function nextCellRight
 * @param currentCellID the current cell ID
 * @returns {string} the cell ID of the cell below the current cell
 */
function nextCellRight(currentCellID) {
  return String.fromCharCode(currentCellID.charCodeAt(0) + 1) + currentCellID.substring(1)
}

/**
 * Returns the cell ID of the cell to the left of the current cell
 * @function nextCellLeft
 * @param currentCellID the current cell ID
 * @returns {string} the cell ID of the cell below the current cell
 */
function nextCellLeft(currentCellID) {
  return String.fromCharCode(currentCellID.charCodeAt(0) - 1) + currentCellID.substring(1)
}


/**
 * Uses regex to pull cell IDs from a formula and highlight them
 * @function highlightFormulaCells
 * @param {string} formula the formula to be highlighted
 */
function highlightFormulaCells(formula) {
  let formulaCells = formula.match(/[A-Z]+\d+/g)
  if (formulaCells != null) {
    for (let i = 0; i < formulaCells.length; i++) {
      document.getElementById(formulaCells[i]).classList.add('highlighted_cell')
    }
  }
}

/**
 * Removes the highlight from all cells
 * @function removeCellHighlights
 */
function removeCellHighlights() {
  let inputs = document.getElementsByTagName('input')
  for (input of inputs) {
    input.classList.remove('highlighted_cell')
  }
}


/**
 * Makes the column and row headers bold for the selected cell
 * @function boldColumnAndRowHeaders
 * @param {string} cellID the ID of the selected cell
 */
function boldColumnAndRowHeaders(cellID) {
  let columnHeader = document.getElementById(cellID.charAt(0))
  let rowHeader = document.getElementById(cellID.substring(1))
  columnHeader.classList.remove('column_header')
  rowHeader.classList.add('selected_row')
}

/**
 * Unbold the column and row headers for the selected cell
 * @function unBoldColumnAndRowHeaders
 * @param {string} cellID 
 */
function unBoldColumnAndRowHeaders(cellID) {
  let columnHeader = document.getElementById(cellID.charAt(0))
  let rowHeader = document.getElementById(cellID.substring(1))
  columnHeader.classList.add('column_header')
  rowHeader.classList.remove('selected_row')
}


// the lonely function call that does everything.
initialize()