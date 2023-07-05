import * as React from 'react'
import { InputBar } from '../InputBar'
import { OutputContainerContext, 
         OutputContainerContextType, DisplayType } from '../../Containers/Main'
import { render, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import user from '@testing-library/user-event'

const customRender = (ui: React.ReactNode, 
                      providerProps: OutputContainerContextType) => {
  return render(
    <OutputContainerContext.Provider value={providerProps}>
      {ui}
    </OutputContainerContext.Provider>
)}

const mockProps = {
  displayType: "rows",
  dispatch: () => null,
  setDisplayType: () => null
}

describe('InputBar', () => {
  test('render input bar', async() => {
    const renderedElement = customRender(<InputBar/>, mockProps);
    const input = await renderedElement.findByPlaceholderText('Search for park');
    expect(input).toBeInTheDocument();
  })

  test('toggle dropdown on multiple clicks', async() => {
    const renderedElement = customRender(<InputBar/>, mockProps);
    const input = await renderedElement.findByPlaceholderText('Search for park');
    const dropdown = await renderedElement.findByTestId('dropdown-element')
                     await user.dblClick(input);
    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveClass("hide");
  })
})
