const Employee = require("./employee");
const Util = require("./util");

class Manager extends Employee {
    #bonus = 2000

    get bonus() {
        return Util.formatCurrency(this.#bonus)
    }

    get netPay() {
        const finalValue = Util.unFormatCurrency(super.netPay) + this.#bonus

        return Util.formatCurrency(finalValue)
    }
}

module.exports = Manager