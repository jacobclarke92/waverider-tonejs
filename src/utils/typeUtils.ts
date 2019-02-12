export const isArray = (value: any): boolean => value instanceof Array
export const isObject = (value: any): boolean => typeof value == 'object' && !isArray(value)
export const isString = (value: any): boolean => typeof value == 'string'
export const isNumber = (value: any): boolean => typeof value == 'number'
export const isInt = (value: any): boolean => isNumber(value) && value.toString().indexOf('.') < 0
