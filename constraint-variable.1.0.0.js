/**
 * global stack for constraint variables.
 * @type {Array}
 */
var stack = []

/**
 * Global dictionary object for constraint variables.
 * @type {Object}
 */
var variables = {}

/**
 * Class representing a variable involved in a system of constraint equations.
 */
class DataflowConstraintVariable {
    /**
     * @param {number} value A hard-coded value to set the variable to.
     * @param {string} equation A string of the form "=A1 + B1" or a number.
     * @param {boolean} valid A boolean indicating whether the variable is valid.
     * @param {array} dependencies An array of DataflowConstraintVariable objects that depend on this variable.
     * @memberof DataflowConstraintVariable
     * @instance
     * @method constructor
     * @example
     * var A1 = new DataflowConstraintVariable(2, "", true, [])
     * console.log(A1.equation) // ""
     * console.log(A1.value) // 2
     * console.log(A1.valid) // true
     * console.log(A1.dependencies) // []
     */
    constructor(value, equation, valid, dependencies) {
        this.value = value
        this.equation = equation
        this.valid = valid
        this.dependencies = dependencies
        this.userSet = false
    }



    /**
    * Invalidates the variable and recursively invalidates all of its dependencies.
    * @param {DataflowConstraintVariable} variable The variable to invalidate.
    * @return {void} Nothing is returned from this method.
    * @memberof DataflowConstraintVariable
    * @instance
    * @method invalidate
    * @example
    * var variable = new DataflowConstraintVariable(0, "=A1 + B1", true, [])
    * variable.invalidate(variable)
    * console.log(variable.valid) // false
    */
    invalidate(variable) {
        variable.valid = false
        //console.log(this)
        for (let dependency of variable.dependencies) {
            if (dependency.valid) {
                variable.invalidate(dependency)
            }
        }
        variable.dependencies = []
    }



    /**
     * Sets the value of the variable to a number or equation as well as invalidates all of its dependencies. 
     * @param {number|string} value A number or equation to set the variable to.
     * @return {void} Nothing is returned from this method.
     * @memberof DataflowConstraintVariable
     * @instance
     */
    set(value) {
        this.evaluate(value)
        for (let dependency of this.dependencies) {
            if (dependency.valid) {
                this.invalidate(dependency)
            }
        }
    }



    /**
     * Gets the value of the variable. If it is not valid, it will evaluate the equation and update the value while properly handling the dependency lists.
     * @return {number} The value of the variable.
     * @memberof DataflowConstraintVariable
     * @instance
     * @method get
     * @example
     * stack = []
     * var A1 = new DataflowConstraintVariable(2, "", true, [])
     * var B1 = new DataflowConstraintVariable(3, "", true, [])
     * var variable = new DataflowConstraintVariable(0, "=A1 + B1", false, [])
     * console.log(variable.get()) // 5
     * console.log(A1.dependencies) // [variable]
     * console.log(B1.dependencies) // [variable]
     * console.log(variable.dependencies) // []
     */
    get() {
        if (stack.length > 0) {
            this.dependencies.push(stack[stack.length - 1])
        }

        if (!this.valid) {
            this.valid = true
            stack.push(this)
            this.value = this.evaluate(this.equation)
            stack.pop()
        }
        return this.value
    }


    
    /**
     * Takes a string of the form "=A1 + B1" or a number, and returns a function performing the strings stated operation.
     * @method parse
     * @return {function} A function performing the operation specified by the equation.
     * @memberof DataflowConstraintVariable
     * @instance
     * @example
     * var A1 = new DataflowConstraintVariable(2, "", true, [])
     * var B1 = new DataflowConstraintVariable(3, "", true, [])
     * var variable = new DataflowConstraintVariable(0, "=A1+B1", true, [])
     * console.log(variable.parse()) // ƒ () { return 2+3; }
     */ 
    parse() {
        let equationVariables = []
        let equationType = null
        let startIndex = 0
        let functionString = ""
        let equationString = this.equation.substring(1)

        for (let i = 0; i < this.equation.length; i++) {

            if (equationString[i] == '+' || equationString[i] == '-' || equationString[i] == '*' || equationString[i] == '/') {
                equationVariables.push(equationString.substring(startIndex, i))
                if (i != this.equation.length - 1) {
                    equationType = equationString[i]
                    startIndex = i + 1
                }
            } else if (i == equationString.length - 1) {
                equationVariables.push(equationString.substring(startIndex))
            }
        }


        // set dependencies
        for (let variable of equationVariables) {
            variables[variable].dependencies.push(this)
        }


        functionString += "(function() { return "
        
        for (let i = 0; i < equationVariables.length; i++) {
            functionString += variables[equationVariables[i]].get()
            if (i != equationVariables.length - 1) {
                functionString += equationType
            }
        }

        functionString += "; })"


        var fn = eval(functionString)

        return fn
    }



    /**
     * Evaluates the equation in the variable and returns the value of the variable.
     * @param {string} equation A string of the form "=A1+B1" or a number.
     * @return {number} The value of the variable.
     * @memberof DataflowConstraintVariable
     * @instance
     * @method evaluate
     * @example
     * var A = new DataflowConstraintVariable(2, "", true, [])
     * var B = new DataflowConstraintVariable(3, "", true, [])
     * var variable = new DataflowConstraintVariable(0, "=A1+B1", true, [])
     * console.log(variable.evaluate("=A1+B1")) // 5
     */
    evaluate(equation) {

        if (equation == "") {
            this.equation = null
            this.value = 0
            this.userSet = false
        } else {

            this.userSet = true
            this.equation = equation

            /**
             * if the equation is not a number, parse the equation and set the value equal to the value of the equation
            */
            if (isNaN(this.equation)) {
                let equationFunction = this.parse()
                this.value = equationFunction()
            }
            /**
             * if the equation is a number, set the value equal to the equation
             */
            else {
                this.value = Number(equation)
                this.userSet = true
            }

        }
        return this.value
    }

}
