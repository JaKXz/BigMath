interface BigNumber {
    comma: number;
    number: bigint;
    sign: boolean;
}
declare class DomainError extends RangeError {
    constructor(given: string, expected: string);
}
export { DomainError };
declare const _default: {
    acos: (a: string | number | bigint | BigNumber) => BigNumber;
    acosh: (a: string | number | bigint | BigNumber) => BigNumber;
    acot: (a: string | number | bigint | BigNumber) => BigNumber;
    acoth: (a: string | number | bigint | BigNumber) => BigNumber;
    acsc: (a: string | number | bigint | BigNumber) => BigNumber;
    acsch: (a: string | number | bigint | BigNumber) => BigNumber;
    add: (a: string | number | bigint | BigNumber, b: string | number | bigint | BigNumber) => BigNumber;
    asec: (a: string | number | bigint | BigNumber) => BigNumber;
    asech: (a: string | number | bigint | BigNumber) => BigNumber;
    asin: (a: string | number | bigint | BigNumber) => BigNumber;
    asinh: (a: string | number | bigint | BigNumber) => BigNumber;
    atan: (a: string | number | bigint | BigNumber) => BigNumber;
    atanh: (a: string | number | bigint | BigNumber) => BigNumber;
    cos: (a: string | number | bigint | BigNumber) => BigNumber;
    cosh: (a: string | number | bigint | BigNumber) => BigNumber;
    cot: (a: string | number | bigint | BigNumber) => BigNumber;
    coth: (a: string | number | bigint | BigNumber) => BigNumber;
    csc: (a: string | number | bigint | BigNumber) => BigNumber;
    csch: (a: string | number | bigint | BigNumber) => BigNumber;
    divide: (a: string | number | bigint | BigNumber, b: string | number | bigint | BigNumber) => BigNumber;
    exp: (a: string | number | bigint | BigNumber) => BigNumber;
    ln: (a: string | number | bigint | BigNumber) => BigNumber;
    LOG10: BigNumber;
    LOG2: BigNumber;
    multiply: (a: string | number | bigint | BigNumber, b: string | number | bigint | BigNumber) => BigNumber;
    PI: BigNumber;
    PI2: BigNumber;
    power: (a: string | number | bigint | BigNumber, b: string | number | bigint | BigNumber) => BigNumber;
    sec: (a: string | number | bigint | BigNumber) => BigNumber;
    sech: (a: string | number | bigint | BigNumber) => BigNumber;
    sin: (a: string | number | bigint | BigNumber) => BigNumber;
    sinh: (a: string | number | bigint | BigNumber) => BigNumber;
    sqrt: (a: string | number | bigint | BigNumber) => BigNumber;
    stringify: (a: BigNumber) => string;
    subtract: (a: string | number | bigint | BigNumber, b: string | number | bigint | BigNumber) => BigNumber;
    tan: (a: string | number | bigint | BigNumber) => BigNumber;
    tanh: (a: string | number | bigint | BigNumber) => BigNumber;
};
export default _default;
