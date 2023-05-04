import { MenuItem } from "primeng/api";

export interface HeadArray {

        head?,
        subHead?,
        fieldName?,
        actionInput?,
        actionOutput?,
        display?,
        filter?,
        width?,
        colorHeader?,
        flag?: boolean,
        pathIconFlag?,
        sortIcon?: boolean,
        content?,
        tooltip?,
        required?: boolean, //if is true set the attribute input required 
        dropdown?: MenuItem[], //This menu item can be used in the case of multiple dropdowns within the table
        dropdownClear?: boolean, // If true, it allows you to clean the dropdown
}

export interface VariableGridArray {
        id?: string,
        updated?: boolean;
        buttonDetails?: boolean;
        dropdownData?: boolean;
        inputLabeldata?: boolean;
        inputLabelNumber?: boolean;
        inputNotes?: boolean;
        outputData?: boolean;
        inputNew?: boolean;
        icon?: { icon: string, value: any }
}

export enum HeadFilter {
        dropdownFilter = "dropdownFilter",
        dropdownFilterCustom = "dropdownFilterCustom",
        textFilter = "textFilter",
        popUpFilter = "popUpFilter",
        globalFilter = "globalFilter",
        null = "null"

}

export enum ActionInput {
        dropdownData = "dropdownData",
        inputLabeldata = "inputLabeldata",
        inputLabelNumber = "inputLabelNumber",
        inputNotes = "inputNotes",
        outputData = "outputData",
        null = "null"
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
        actionDetails = "actionDetails",
        icon = "icon",
        outputNotes = "outputNotes",
        null = "null"
}
