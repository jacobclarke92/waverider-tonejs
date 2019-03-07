import { GenericProps } from '../types'
import { AnyAction } from 'redux'

export interface State extends AnyAction {}

export default (state = { type: null }, action) => action
