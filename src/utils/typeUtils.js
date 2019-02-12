export const isArray = value => value instanceof Array
export const isObject = value => typeof value == 'object' && !isArray(value)
export const isString = value => typeof value == 'string'
export const isNumber = value => typeof value == 'number'
export const isInt = value => isNumber(value) && value.toString().indexOf('.') < 0
