"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basic_1 = require("./basic");
/**
 * Custom error to handle invalid domain
 */
class DomainError extends RangeError {
    constructor(given, expected) {
        super(`Number out of domain. Given: ${given}. Expected: ${expected}`);
        this.name = 'DomainError';
    }
}
exports.DomainError = DomainError;
/**
 * Convert other types to BigNumber and normalize it
 */
exports.normalize = (a) => {
    switch (typeof a) {
        case 'number':
            a = String(a);
            return exports.normalize({
                comma: a.indexOf('.') === -1 ? 0 : a.indexOf('.') + 1 - a.length,
                number: BigInt(a.split('.').join('').replace('-', '')),
                sign: a.indexOf('-') > -1
            });
        case 'bigint':
            return {
                comma: 0,
                number: a < 0n ? -a : a,
                sign: a < 0n
            };
        case 'string':
            const s = a.indexOf('-') !== -1;
            return exports.normalize({
                comma: a.indexOf('.') === -1 ? 0 : a.indexOf('.') + 1 - a.length,
                number: BigInt(s ? a.split('.').join('').substr(1) : a.split('.').join('')),
                sign: s
            });
        case 'object':
            let x = a.number;
            if (x === 0n) {
                return {
                    comma: 0,
                    number: 0n,
                    sign: false
                };
            }
            const sign = !(x < 0n === a.sign);
            let comma = a.comma;
            x = x < 0n ? -x : x;
            while (true) {
                if (x % 10n === 0n) {
                    comma += 1;
                    x /= 10n;
                }
                else {
                    break;
                }
            }
            return {
                comma,
                number: x,
                sign
            };
    }
};
/**
 * Stringify given number
 */
exports.stringify = (a) => {
    switch (typeof a) {
        case 'string':
            return a;
        case 'bigint':
        case 'number':
            return String(a);
        default:
            const s = String(a.number);
            if (a.comma < 0) {
                const len = s.length + a.comma;
                if (len > 0) {
                    return `${a.sign ? '-' : ''}${s.substring(0, len)}.${s.substring(len)}`;
                }
                else {
                    return `${a.sign ? '-' : ''}0.${'0'.repeat(-len) + s}`;
                }
            }
            else {
                return `${a.sign ? '-' : ''}${s}${'0'.repeat(a.comma)}`;
            }
    }
};
exports.round = (a) => {
    a = exports.normalize(a);
    if (a.comma < 0) {
        const b = exports.stringify(a).split('.');
        if (a.sign) {
            return Number(b[1][0]) >= 5 ? basic_1.subtract(b[0], 1n) : exports.normalize(b[0]);
        }
        return Number(b[1][0]) >= 5 ? basic_1.add(b[0], 1n) : exports.normalize(b[0]);
    }
    return a;
};
exports.floor = (a) => {
    a = exports.normalize(a);
    if (a.sign) {
        const b = exports.stringify(a).split('.');
        return b[1] ? basic_1.subtract(b[0], 1) : exports.normalize(b[0]);
    }
    return exports.normalize(exports.stringify(a).split('.')[0]);
};
exports.ceil = (a) => {
    a = exports.normalize(a);
    if (!a.sign) {
        const b = exports.stringify(a).split('.');
        return b[1] ? basic_1.add(b[0], 1) : exports.normalize(b[0]);
    }
    return exports.normalize(exports.stringify(a).split('.')[0]);
};
/**
 * @returns Absolute value
 */
exports.abs = (a) => {
    a = exports.normalize(a);
    a.sign = false;
    return a;
};
/**
 * Checks if number is an integer
 */
exports.isInteger = (a) => exports.normalize(a).comma >= 0;
//# sourceMappingURL=util.js.map