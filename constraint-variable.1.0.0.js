class DataflowConstraintVariable {
    constructor(value, equation, valid, dependencies) {
        this.value = value
        this.equation = equation
        this.valid = valid
        this.dependencies = dependencies
        this.stack = []
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
        this.eval(value)
        console.log(this)
        for (let dependency of this.dependencies) {
            if (dependency.valid) {
                console.log("test invalidate")
                this.invalidate(dependency)
            }
        }
    }

    get() {
        if (this.stack.length > 0) {
            this.dependencies.push(this.stack[this.stack.length - 1])
        }

        if (!this.valid) {
            this.valid = true
            console.log("getting")
            this.stack.push(this)
            this.value = this.eval(this.equation)
            this.stack.pop()
        }
        return this.value
    }

    //takes a string of the form "=A1 + B1" or a number, and assigned it to the correct variable
    parse_equation(equation) {
        let equationVariables = []
        let equationType = null
        let startIndex = 0
        let value = 0
        if (isNaN(equation)) {
            equation = equation.substring(1)

            for (let i = 0; i < equation.length; i++) {

                if (equation[i] == '+' || equation[i] == '-' || equation[i] == '*' || equation[i] == '/') {
                    equationVariables.push(equation.substring(startIndex, i))
                    if (i != equation.length - 1) {
                        equationType = equation[i]
                        startIndex = i + 1
                    }
                } else if (i == equation.length - 1) {
                    console.log("equation: " + equation)
                    equationVariables.push(equation.substring(startIndex))
                }
            }

            return { equationVariables, equationType }


        } else {
            this.value = Number(equation)
            //console.log("equation: " + equation)
            //console.log("value" + this.value)
            return null
        }
    }

    eval(equation) {
        this.equation = equation

        let parsedEquation = this.parse_equation(this.equation)

        if (parsedEquation != null) {
            let value = 0
            for (let variable of parsedEquation.equationVariables) {
                console.log(variable)
                //add dependencies
                variables[variable].dependencies.push(this)

                //calculate new value
                if (parsedEquation.equationType == '+') {
                    value += variables[variable].value
                } else if (parsedEquation.equationType == '-') {
                    value -= variables[variable].value
                } else if (parsedEquation.equationType == '*') {
                    value *= variables[variable].value
                } else if (parsedEquation.equationType == '/') {
                    value /= variables[variable].value
                }
            }
            this.value = value
        }

        console.log(this.value)
        return this.value
    }
}
