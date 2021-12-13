# dataflow-constraint-solver
 An application that will record dataflow constraints and maintain the value of an object based on its dependancies. This Constraint Solver API is specifically designed for a spreadsheet-type application.

## How Does a Dataflow Constraint Work?
### Get
### Set
### Evaluate

## Graphical Interface
The spreadsheet closely models an excel spreadsheet. Each cell has an ID corresponding to its column and row. Currently, the spreadsheet size is hardcoded to have A->H columns and 1->8 rows. Giving is an 8X8 grid consisting of 64 cells. Upon an initial load, the spreedsheet looks like the following image.
![image](https://user-images.githubusercontent.com/20911606/145886120-62946531-975e-495f-b180-9d7432a89c3a.png)

## Usage
How does a user interact with this application?
### Navigating
Navigation between cells is similar to how navigation works within Excel. 
1. Arrow keys move between cells in the expected manner.
2. Enter will submit a formula as well as move down a cell.
3. Tab will submit a formula and move to the cell on the right.

### Writing Formulas
1. To signify you are entering a formula, start by typing the equal sign character: "=". This then enables you to click on other cells, which will automatically put the ID of the clicked cell into your formula and bring focus back to the cell receiving the formula.
2. If you want to simply mirror the value in that cell, or if you're coming here from Step 5 with a finished formula, you can end here and simply press enter or tab.
3. Type in the mathematical operator of your choice. Currently tested operators are +,-,*,/.
4. Click another cell.
5. Go to step 2.

See this process in the GIF below:
![entering_formula](https://user-images.githubusercontent.com/20911606/145894183-f3be1acc-f776-4419-bfd1-41b143798af0.gif)

You can also manually enter a formula by typing the IDs of the cell you wish to include in the formula. 

In order to edit a formula later, focus a cell with a formula and press F2 in order to copy the formula from the equation display. Then edit the formula within the cell according the the steps above.

### FAQs
1. How are self referential formulas handled? Self references are allowed. They update every time another cell is changed, which triggers the application to get all of the values for each of the cells.
2. Are there checks for improper input? Not currently. Please be sure to enter the formulas without spaces. This is automatically done when 
3. Order of operations? Single operation formulas are all that are currently accepted. No order of operations required. This may be implemented later.


## Features
###
Formulas can handle any number of variables. Currently only accept an operator of the same type between each variable.
### QOL
1. Column and Row headers are bolded based on the currently selected cell
2. Focusing a cell with a formula highlights the cells on which it depends. This currently only goes back 1 level.
3. Each cell has an innate value of 0. Zero is only displayed if a user has manually entered it.
4. Deleting the value in a cell that is depended on will innately use 0 as its value. This is how excel handles this situation.
### Future Work
1. Handle equations with multiple operators of different types

