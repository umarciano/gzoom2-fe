export interface HeadArray {

        head ?, 
        subHead ?, 
        fieldName ?, 
        actionInput ?,
        actionOutput ?, 
        display ?, 
        filter ?,
        width ?,
        colorHeader ?,
        flag?: boolean,
        pathIconFlag ?,
        sortIcon?: boolean
        tooltip?

}

export enum HeadFilter {
        dropdownFilter = "dropdownFilter",
        dropdownFilterCustom = "dropdownFilterCustom",
        textFilter = "textFilter",
        popUpFilter = "popUpFilter",
        globalFilter = "globalFilter",
        null= "null"
    
    }

export enum ActionInput {
        actionEditing = "actionEditing",
        actionDetails = "actionDetails",
        dropdownData = "dropdownData",
        inputLabeldata = "inputLabeldata",
        inputLabelNumber = "inputLabelNumber",
        inputNotes= "inputNotes",
        outputData = "outputData",
        null= "null"
}


export enum ActionOutput {
        outputClickLabelData = "outputClickLabelData",
        outputLabelData = "outputLabelData",
        outputLabelNumber = "outputLabelNumber",
        actionEmoticonCard = "actionEmoticonCard",
        actionAmount = "actionAmount",
        actionGauge = "actionGauge",
        actionDoubleRowString = "actionDoubleRowString",
        actionDoubleRowNumber = "actionDoubleRowNumber",
        actionMultipleRowString = "actionMultipleRowString",
        actionMultipleRowNumber = "actionMultipleRowNumber",
        isEditable = "isEditable",
        null= "null"
}
