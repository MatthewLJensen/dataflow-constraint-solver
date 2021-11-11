class DataflowConstraints {
    constructor() {
        this.variables = []
        this.stack = []
    }

    set(variable, value) {
        variable.value = value
        for (let dependency of variable.dependencies) {
            if (dependency.valid) {
                invalidate(dependency)
            }
        }     
    }
    
    invalidate(variable) {
        variable.valid = false
        for (let dependency of variable.dependencies) {
            if (dependency.valid) {
                invalidate(dependency)
            }
        }
        variable.dependencies = []
    }
    
    get(variable) {
        if (this.stack.length > 0) {
            variable.dependencies.push(this.stack[this.stack.length - 1])
        }

        if (!variable.valid) {
            variable.valid = true
            this.stack.push(variable)
            variable.value = variable.eval()
            this.stack.pop()
        }
        return variable.value
    }
}


class Variable {
    constructor(value = null, eval, valid, dependencies) {
        this.value = value
        this.eval = eval
        this.valid = valid
        this.dependencies = dependencies
    }

    eval() {
        return this.eval
    }
}

