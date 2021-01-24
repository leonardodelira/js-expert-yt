const assert = require('assert');

const Employee = require('./employee');
const Manager = require('./manager');
const Util = require('./util');

const GENDER = {
    male: 'male',
    female: 'female'
}

{
    const employee = new Employee({
        name: 'Leonardo',
        gender: GENDER.male
    })

    assert.throws(() => employee.birthYear, { message: 'you must define age first!!!' })
}

const CURRENT_YEAR = 2021
Date.prototype.getFullYear = () => CURRENT_YEAR

{
    const employee = new Employee({
        name: 'Joi',
        age: 25,
        gender: GENDER.female
    })

    assert.deepStrictEqual(employee.name, "Ms. Joi")
    assert.deepStrictEqual(employee.age, undefined)
    assert.deepStrictEqual(employee.gender, undefined)
    assert.deepStrictEqual(employee.grossPay, Util.formatCurrency(5000.40))
    assert.deepStrictEqual(employee.netPay, Util.formatCurrency(4000.32))

    const expectedBirthYear = 1996
    assert.deepStrictEqual(employee.birthYear, expectedBirthYear)

    employee.age = 80
    assert.deepStrictEqual(employee.birthYear, 1941)
}

{
    const manager = new Manager({
        name: 'Lira',
        age: 25,
        gender: GENDER.male
    })

    assert.deepStrictEqual(manager.name, "Mr. Lira")
    assert.deepStrictEqual(manager.age, undefined)
    assert.deepStrictEqual(manager.gender, undefined)

    const expectedBirthYear = 1996
    assert.deepStrictEqual(manager.birthYear, expectedBirthYear)

    manager.age = 80
    assert.deepStrictEqual(manager.birthYear, 1941)

    assert.deepStrictEqual(manager.grossPay, Util.formatCurrency(5000.40))
    assert.deepStrictEqual(manager.bonus, Util.formatCurrency(2000))
    assert.deepStrictEqual(manager.netPay, Util.formatCurrency(6000.32))
}