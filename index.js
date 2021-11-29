//const DFCS = require('./constraint_solver')
// const express = require('express')
// const path = require('path');

// global.document = new JSDOM(html).window.document;

// const app = express()
// const port = 3000

// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname, '/index.html'));
//   });
//import { DataflowConstraints, Variable } from './constraint_solver';

//let a = new DFCS.Variable(5, 5, true, {})
//let b = new DFCS.Variable(0, 5, true, {})
//let c = new DFCS.Variable(0, 5, true, {})
//let d = new DFCS.Variable(0, 5, true, {a,b,c})

enteringFormula = false



function initializeInputs() {
  var myButtons = document.getElementsByTagName('input')
  for (i = 0; i < myButtons.length; ++i) {
    myButtons[i].addEventListener('click', function (e) {
      console.log(this.id)
    })
    myButtons[i].addEventListener('keyup', function (e) {
      console.log(this.value)
      console.log("keypress")
      if (this.value == '=') {
        enteringFormula = true
      } else {
        enteringFormula = false
      }
    })
  }
}

// function inputClicked() {
//   if (enteringFormula) {
//     console.log(this.id)
//     console.log("click")
//   }
// }

// function inputKeypress() {
//   console.log(this.id)
//   console.log("keypress")

//   enteringFormula = true
// }




function reloadCells() {
  inputs = document.getElementsByTagName('input')
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "test"
  }
}

initializeInputs()
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