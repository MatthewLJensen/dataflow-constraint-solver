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
     * 
     * @param {number} value 
     * @param {string} equation 
     * @param {boolean} valid 
     * @param {array} dependencies 
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
    * @param {DataflowConstraintVariable} variable
    * @return {void}
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
     * @param {number|string} value
     * @return {void}
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
     * Gets the value of the variable. If it is not valid, it will evaluate the equation and update the value.
     * @return {number} value
     * @memberof DataflowConstraintVariable
     * @instance
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
     * @method parse_equation
     * @return {function}
     * @memberof DataflowConstraintVariable
     * @instance
     */ 
    parse_equation() {
        let equationVariables = []
        let equationType = null
        let startIndex = 0
        let functionString = ""
        let equationString = this.equation.substring(1)

        for (let i = 0; i < equation.length; i++) {

            if (equationString[i] == '+' || equationString[i] == '-' || equationString[i] == '*' || equationString[i] == '/') {
                equationVariables.push(equationString.substring(startIndex, i))
                if (i != equation.length - 1) {
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

        console.log(functionString)

        var fn = eval(functionString)

        return fn
    }

    evaluate(equation) {

        if (equation == "") {
            this.equation = null
            this.value = 0
            this.userSet = false
        } else {

            this.userSet = true
            this.equation = equation

            if (isNaN(this.equation)) {

                let equationFunction = this.parse_equation()
                this.value = equationFunction()

            } else {
                this.value = Number(equation)
                this.userSet = true
            }

        }

        return this.value
    }
}
