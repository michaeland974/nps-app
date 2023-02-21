import React, { useEffect, useRef, useState} from "react";

export type Props = {
  isOpen: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ref?: React.ForwardedRef<HTMLElement>
}

export const useClickOutside = (
  WrappedComponent: React.ForwardRefExoticComponent<Props & 
                    React.RefAttributes<HTMLElement>> ) => {
  const Component = () => {
    const [isOpen, setOpen] = useState(false)
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
      const handleClick = (e: MouseEvent) => {
          if(!ref.current?.contains(e.target as Node)){
            setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClick)
      return () => document.removeEventListener("mousedown", handleClick)
    }, [ref])

    return(<WrappedComponent isOpen={isOpen} 
                             setOpen={setOpen} 
                             ref={ref}/>);
  }
  return Component
}