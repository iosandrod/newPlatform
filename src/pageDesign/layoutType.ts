import { FormItem } from "./formitem";

type Style = Record<string, any>;

export type InlineColumn = {
    type: "inline";
    columns: string[];
    style?: Style;
    id?: string;
    key?: string;
    rows?: TableRow[];
};

export type TableCellOptions = {
    colspan: number;
    rowspan: number;
    isMerged: boolean;
};

export type TableCell = {
    type: string;
    options: TableCellOptions;
    list: InlineColumn[];
    style?: Style;
    id: string;
    key: string;
};

export type TableRow = {
    type: string;
    columns: TableCell[];
    style?: Style;
    id: string;
    key: string;
};

export type Table = {
    type: "table";
    label: string;
    icon: string;
    id: string;
    rows: TableRow[];
    options?: {
        width: number;
        widthType: "%" | "px";
    };
    style?: Style;
    key: string;
};

export type LayoutColumn = Table | InlineColumn;

export type Layout = {
    type: "inline";
    columns: LayoutColumn[];
    style?: Style;
    id: string;
    key: string;
};

export type LayoutConfig = {
    pc: Layout[];
    mobile: InlineColumn[];
};

export type FieldOptions = {
    formConfig?: any
    clearable: boolean;
    isShowWordLimit: boolean;
    renderType: number;
    disabled: boolean;
    showPassword: boolean;
    defaultValue: string;
    placeholder: string;
    labelWidth: number;
    isShowLabel: boolean;
    required: boolean;
    min?: number | null;
    max?: number | null;
};

export type Field = {
    span?: number
    type: string;
    label: string;
    icon: string;
    key: string;
    id: string;
    field?: string
    options: FieldOptions;
    style: {
        width: {
            pc: string;
            mobile: string;
        };
    };
};

export type Config = {
    isSync: boolean;
    pc: {
        size: string;
        labelPosition: string;
        completeButton: {
            text: string;
            color: string;
            backgroundColor: string;
        };
    };
    mobile: {
        labelPosition: string;
        completeButton: {
            text: string;
            color: string;
            backgroundColor: string;
        };
    };
};

export type StaticData = {
    layout: LayoutConfig;
    data: Record<string, any>;
    config: Config;
    fields: Field[];
};


export type LayoutOption = {
    type: "inline" | "table" | "tr" | "td";
    label?: string;
    icon?: string;
    id: string;
    key: string;
    columns?: (string | FormItem)[];
    rows?: FormItem[];
    options?: {
        width?: number;
        widthType?: "%" | "px";
        colspan?: number;
        rowspan?: number;
        isMerged?: boolean;
    };
    list?: FormItem[];
    style?: Record<string, any>;
};
