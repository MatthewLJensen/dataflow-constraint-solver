//global stack and dictionary for variables
var stack = []
var variables = {}
class DataflowConstraintVariable {
    constructor(value, equation, valid, dependencies) {
        this.value = value
        this.equation = equation
        this.valid = valid
        this.dependencies = dependencies
        this.userSet = false
    }

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

    set(value) {
        this.evaluate(value)
        for (let dependency of this.dependencies) {
            if (dependency.valid) {
                this.invalidate(dependency)
            }
        }
    }

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

    //takes a string of the form "=A1 + B1" or a number, and assigned it to the correct variable
    // should be changed to use this.equation, rather than taking it as a parameter
    parse_equation(equation) {
        let equationVariables = []
        let equationType = null
        let startIndex = 0
        let functionString = ""

        equation = equation.substring(1)

        for (let i = 0; i < equation.length; i++) {

            if (equation[i] == '+' || equation[i] == '-' || equation[i] == '*' || equation[i] == '/') {
                equationVariables.push(equation.substring(startIndex, i))
                if (i != equation.length - 1) {
                    equationType = equation[i]
                    startIndex = i + 1
                }
            } else if (i == equation.length - 1) {
                equationVariables.push(equation.substring(startIndex))
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

                let equationFunction = this.parse_equation(this.equation)
                this.value = equationFunction()

            } else {
                this.value = Number(equation)
                this.userSet = true
            }

        }

        return this.value
    }
}
