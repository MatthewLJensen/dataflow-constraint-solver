class DataflowConstraintVariable {
    constructor(value, equation, valid, dependencies) {
        this.value = value
        this.equation = equation
        this.valid = valid
        this.dependencies = dependencies
        this.stack = []
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
        this.eval(value)
        for (let dependency of this.dependencies) {
            if (dependency.valid) {
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
            this.stack.push(this)
            this.value = this.eval(this.equation)
            this.stack.pop()
        }
        return this.value
    }

    //takes a string of the form "=A1 + B1" or a number, and assigned it to the correct variable
    // should be changed to use this.equation, rather than taking it as a parameter
    parse_equation(equation) {
        let equationVariables = []
        let equationType = null
        let startIndex = 0

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

        return { equationVariables, equationType }
    }

    eval(equation) {

        if (equation == "") {
            this.equation = null
            this.value = 0
            this.userSet = false
        } else {

            this.userSet = true
            this.equation = equation

            if (isNaN(this.equation)) {
                let parsedEquation = this.parse_equation(this.equation)

                if (parsedEquation != null) {
                    let value = 0
                    for (let variable of parsedEquation.equationVariables) {
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
            } else {
                this.value = Number(equation)
                this.userSet = true
            }

        }

        return this.value
    }
}
