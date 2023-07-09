import { createContext } from "react"
import { ViewToggle, InputState } from "./interfaces"

type OptionsContextType = { list: string[][] | [] }

type InputValueContextType = {
  value: string
  dispatch: React.Dispatch<{type: keyof InputState, payload: string}>
  inputBarRef: React.RefObject<HTMLInputElement>
}

export type OutputContainerContextType = {
  scrollRef?: React.RefObject<HTMLDivElement>
  dispatch: React.Dispatch<{type: keyof InputState, payload: string}>
  view: ViewToggle | string
}

export const OptionsContext = createContext<OptionsContextType>(
  {} as OptionsContextType)

export const InputValueContext = createContext<InputValueContextType>(
  {} as InputValueContextType)

export const OutputContainerContext = createContext<OutputContainerContextType>(
  {} as OutputContainerContextType)