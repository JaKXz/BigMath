"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comparison_1 = require("./comparison");
const constants_1 = require("./constants");
const trigonometry_1 = require("./trigonometry");
const util_1 = require("./util");
/**
 * @domain Real numbers, Real numbers
 * @returns Sum of parameters
 */
exports.add = (a, b) => {
    a = util_1.normalize(a);
    b = util_1.normalize(b);
    if (a.sign !== b.sign) {
        if (a.sign) {
            a.sign = false;
            return exports.subtract(b, a);
        }
        b.sign = false;
        return exports.subtract(a, b);
    }
    const max = Math.max(a.comma, b.comma);
    const min = Math.min(a.comma, b.comma);
    if (a.comma > b.comma) {
        a.number *= 10n ** BigInt(max - min);
    }
    else {
        b.number *= 10n ** BigInt(max - min);
    }
    return util_1.normalize({
        comma: min,
        number: a.number + b.number,
        sign: a.sign
    });
};
/**
 * @domain Real numbers, Real numbers
 * @returns Difference of parameters
 */
exports.subtract = (a, b) => {
    a = util_1.normalize(a);
    b = util_1.normalize(b);
    if (a.sign !== b.sign) {
        if (a.sign) {
            b.sign = true;
            return exports.add(a, b);
        }
        b.sign = false;
        return exports.add(a, b);
    }
    const max = Math.max(a.comma, b.comma);
    const min = Math.min(a.comma, b.comma);
    if (a.comma > b.comma) {
        a.number *= 10n ** BigInt(max - min);
    }
    else {
        b.number *= 10n ** BigInt(max - min);
    }
    return util_1.normalize({
        comma: min,
        number: a.number - b.number,
        sign: a.sign
    });
};
/**
 * @domain Real numbers
 * @returns Product of parameters
 */
exports.multiply = (a, b) => {
    a = util_1.normalize(a);
    b = util_1.normalize(b);
    return util_1.normalize({
        comma: a.comma + b.comma,
        number: a.number * b.number,
        sign: a.sign !== b.sign
    });
};
/**
 * @domain Real numbers, Real numbers other than 0
 * @returns Quotient of parameters
 */
exports.divide = (a, b) => {
    a = util_1.normalize(a);
    b = util_1.normalize(b);
    if (b.number === BigInt(0)) {
        throw new util_1.DomainError('0', 'numbers other than 0');
    }
    const len = String(a.number).length - String(b.number).length;
    if (len > 0) {
        b.number *= 10n ** BigInt(len);
        b.comma -= len;
    }
    else {
        a.number *= 10n ** BigInt(-len);
        a.comma += len;
    }
    const n = a.number / b.number;
    let d = '';
    let c = a.comma - b.comma;
    a.number = (a.number - n * b.number) * 10n;
    while (d.length !== 50) {
        if (a.number === BigInt(0)) {
            break;
        }
        d += String(a.number / b.number);
        a.number = (a.number - (a.number / b.number) * b.number) * BigInt(10);
        c -= 1;
    }
    if (c > 0) {
        return util_1.normalize({
            comma: 0,
            number: BigInt(n + d) * 10n ** BigInt(c),
            sign: a.sign !== b.sign
        });
    }
    return util_1.normalize({
        comma: c,
        number: BigInt(n + d),
        sign: a.sign !== b.sign
    });
};
/**
 * @domain Numbers greater than 0
 * @returns Natural logarithm (base e) of a number
 */
exports.ln = (a) => {
    a = util_1.normalize(a);
    if (a.sign || a.number === 0n) {
        throw new util_1.DomainError(util_1.stringify(a), 'numbers greater than 0');
    }
    const tens = String(a.number).length + a.comma;
    let ten = exports.multiply(tens, constants_1.LOG10);
    a.comma -= tens;
    switch (String(a.number)[0]) {
        case '5':
        case '4':
            ten = exports.subtract(ten, constants_1.LOG2);
            a = exports.multiply(a, 2);
            break;
        case '3':
            ten = exports.subtract(ten, {
                comma: -57,
                number: 1098612288668109691395245236922525704647490557822749451734n,
                sign: false
            });
            a = exports.multiply(a, 3);
            break;
        case '2':
            ten = exports.subtract(ten, exports.multiply(constants_1.LOG2, 2));
            a = exports.multiply(a, 4);
            break;
        case '1':
            if (Number(String(a.number)[1] || 0) > 5) {
                ten = exports.subtract(ten, {
                    comma: -57,
                    number: 1791759469228055000812477358380702272722990692183004705855n,
                    sign: false
                });
                a = exports.multiply(a, 6);
            }
            else {
                ten = exports.subtract(ten, {
                    comma: -57,
                    number: 2079441541679835928251696364374529704226500403080765762362n,
                    sign: false
                });
                a = exports.multiply(a, 8);
            }
    }
    let sum = exports.divide(exports.subtract(a, 1), exports.add(a, 1));
    let p = util_1.normalize(sum);
    const k = exports.multiply(sum, sum);
    for (let i = 1; i < 20; i += 1) {
        p = exports.multiply(p, k);
        sum = exports.add(sum, exports.divide(p, i * 2 + 1));
    }
    return exports.add(ten, exports.multiply(sum, 2));
};
/**
 * @domain Real numbers, Real numbers | both can't be 0 at the same time | not negative ^ non-integer
 * @returns Result of the exponentiation of parameters
 */
exports.power = (a, b) => {
    a = util_1.normalize(a);
    b = util_1.normalize(b);
    if (a.number === 0n && b.number === 0n) {
        throw new util_1.DomainError('0 ^ 0', 'real numbers | both can\'t be 0 at the same time');
    }
    if (b.comma > -1) {
        if (b.sign) {
            a = exports.divide(1, a);
        }
        if (a.sign) {
            a.sign = b.number % 2n === 1n;
        }
        a.comma = a.comma * Number(b.number);
        a.number = a.number ** BigInt(b.number);
        return a;
    }
    if (a.sign) {
        throw new util_1.DomainError(`${util_1.stringify(a)} ^ ${util_1.stringify(b)}`, 'real numbers | not negative ^ non-integer');
    }
    return exports.exp(exports.multiply(b, exports.ln(a)));
};
const gcd = (a, b) => {
    if (a === 0n) {
        return b;
    }
    return gcd(b % a, a);
};
const sqrtInteger = (n) => {
    let prod = 1n;
    for (const prime of constants_1.primes) {
        if (prime > n) {
            break;
        }
        const pow = prime ** 2n;
        while (n % pow === 0n) {
            n /= pow;
            prod *= prime;
        }
    }
    if (n > 1n) {
        return -1n;
    }
    return prod;
};
const sqrtTF = (n) => {
    let prod = 1n;
    while (n % 4n === 0n) {
        n /= 4n;
        prod *= 2n;
    }
    while (n % 25n === 0n) {
        n /= 25n;
        prod *= 5n;
    }
    if (n > 1n) {
        return -1n;
    }
    return prod;
};
/**
 * @domain Numbers greater or equal 0
 * @returns Square root of number
 */
exports.sqrt = (a) => {
    a = util_1.normalize(a);
    if (a.sign) {
        throw new util_1.DomainError(util_1.stringify(a), 'numbers greater or equal 0');
    }
    if (a.number === 0n) {
        return util_1.normalize(0);
    }
    let num = a.number;
    if (num < 2n ** 32n) {
        let denum = 10n ** BigInt(-a.comma);
        const g = gcd(num, denum);
        num /= g;
        denum /= g;
        num = sqrtInteger(num);
        denum = sqrtTF(denum);
        if (num !== -1n && denum !== -1n) {
            return exports.divide(num, denum);
        }
    }
    let aprox = exports.power(10, BigInt(Math.floor((String(a.number).length + a.comma) / 2)));
    for (let i = 0; i < 20; i += 1) {
        aprox = exports.multiply(exports.add(exports.divide(a, aprox), aprox), 0.5);
    }
    return aprox;
};
/**
 * @domain Real numbers
 * @returns Result of the exponentiation of e ^ parameter
 */
exports.exp = (a) => {
    const sh = trigonometry_1.sinh(a);
    return exports.add(sh, exports.sqrt(exports.add(1, exports.multiply(sh, sh))));
};
/**
 * @domain Integers
 * @returns Product of all integers until given number
 */
exports.factorial = (a) => {
    a = util_1.normalize(a);
    if (a.comma !== 0 || a.sign) {
        throw new util_1.DomainError(util_1.stringify(a), 'positive integers');
    }
    let k = 1n;
    for (let i = 2n; i <= a.number; i += 1n) {
        k *= i;
    }
    return util_1.normalize(k);
};
exports.gamma = (a) => {
    /*
      g = 7
      data taken from:
      http://my.fit.edu/~gabdo/gammacoeff.txt
    */
    const p1 = '0.9999999999998099322768470047347829718009602570498980962898849358';
    const p = [
        '676.5203681218850985670091904440190381974449058924722569853678707',
        '-1259.139216722402870471560787552828410476730722910298369550296701',
        '771.3234287776530788486528258894307395627292390168566479072763666',
        '-176.6150291621405990658455135399941244433015398373585840448427972',
        '12.50734327868690481445893685327163629939919667813089937179501692',
        '-0.1385710952657201168955470698506320982416866194189568573645197562',
        '0.000009984369578019570859562668995694018788834042365371027657733820183',
        '0.0000001505632735149311558338355775386439360927036032480858107693939127'
    ];
    a = util_1.normalize(a);
    if (a.sign && a.comma === 0 && a.number % 2n === 0n) {
        throw new util_1.DomainError(util_1.stringify(a), 'not negative multiplications of 2');
    }
    let y;
    if (comparison_1.lte(a, 0.5)) {
        y = exports.divide(constants_1.PI, exports.multiply(trigonometry_1.sin(exports.multiply(constants_1.PI, a)), exports.gamma(exports.subtract(1, a))));
    }
    else {
        a = exports.subtract(a, 1);
        let x = util_1.normalize(p1);
        for (let i = 0; i < p.length; i += 1) {
            x = exports.add(x, exports.divide(p[i], exports.add(a, i + 1)));
        }
        const t = exports.add(a, p.length - 0.5);
        y = exports.multiply(exports.multiply(exports.multiply(exports.sqrt(exports.multiply(constants_1.PI, 2)), exports.power(t, exports.add(a, 0.5))), exports.exp(exports.multiply(t, -1))), x);
    }
    return y;
};
//# sourceMappingURL=basic.js.map