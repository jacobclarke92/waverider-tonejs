import { GenericProps } from '../types'

export interface State extends GenericProps {}

export default (state = { type: null }, action) => action
