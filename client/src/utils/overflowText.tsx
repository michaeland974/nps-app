export const overflowText = (name: string | undefined, 
                             maxCharValue: number) => {
  if(!name) return ''
  
  let isShort = (name.length < maxCharValue);
  const overflowName = (name.substring(0, maxCharValue))+"..."
  return (isShort ? name : overflowName)
}