export const classMerger = (toggleCondition: boolean,
                            defaultName: any, //type "any" for css modules
                            toggledName: any) => {

return toggleCondition ? `${defaultName} ${toggledName}` : 
                            defaultName
}