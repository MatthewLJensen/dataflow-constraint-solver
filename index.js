var enteringFormula = false
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

    // event listener for blur (focus lost) in cell
    inputs[i].addEventListener('blur', function (e) {
      if (!enteringFormula) { // TODO: handle empty cells. Tell when the cell is empty vs when it should display 0.
        variables[this.id].set(this.value)
        reloadCells()
      }
    })

    // event listener for focus (focus gained) in cell
    inputs[i].addEventListener('focus', function (e) {
      if (!enteringFormula) {
        this.value = variables[this.id].equation
      }
    })

  }


  // event listener for enter key
  document.addEventListener("keydown", function (event) {
    if (event.code == "Enter" || event.code == "NumpadEnter" || event.code == "Tab") {
      enteringFormula = false
      targetCell = null
    }

    if (event.code == "Enter" || event.code == "NumpadEnter") {
      let currentCellID = document.activeElement.id
      document.activeElement.blur()
      let nextCell = document.getElementById(nextCellDown(currentCellID))
      if (nextCell != null) {
        nextCell.focus()
      }
    }
  })
}


function reloadCells() {
  inputs = document.getElementsByTagName('input')
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = variables[inputs[i].id].get()
  }
}

function nextCellDown(currentCellID) {
  return currentCellID.charAt(0) + (parseInt(currentCellID.substring(1)) + 1).toString()
}

function nextCellOver(currentCellID) {
  return String.fromCharCode(currentCellID.charCodeAt(0) + 1) + currentCellID.substring(1)
}


initialize()
//reloadCells()


//console.log(a.eval())

  // render_grid()
// console.log("test")


// function render_grid(){
//     const myDataGrid = new SimpleDataTable(document.querySelector('#example'));
//     console.log("test")
//     myDataGrid.load([
//         {
//           column1: 'Cell 1',
//           column2: 'Cell 2',
//           // more columns here
//         },
//         {
//           column1: 'Cell 1 (row 2)',
//           column2: 'Cell 2 (row 2)',
//           // more columns here
//         }
//       ]);

//       myDataGrid.render()
// }


// app.listen(port);
// console.log('Server started at http://localhost:' + port);