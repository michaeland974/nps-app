export const renderDate = (releaseDate: string | undefined): string => {
  if(!releaseDate) return ''
  
  const date = new Date(releaseDate).toLocaleString('en-us',{dateStyle: 'full'})
  const parsedDate = date.substring(date.indexOf(' ') + 1)
  return parsedDate
}