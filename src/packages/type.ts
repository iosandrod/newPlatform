export type FormEditorContext = {
    state: any;  // 根据 `state` 具体的结构替换 `any`
    setSelection: (selection: any) => void;  // 具体的参数类型替换 `any`
    props: Record<string, any>;  // 如果 `props` 是一个对象
    wrapElement: (element: any, index?: number, flag?: boolean, isBlock?: boolean) => any;
    delField: (fieldId: string) => void;
    addField: (field: any) => void;
    switchPlatform: (platform: string) => void;
    addFieldData: (data: any) => void;
    canvesScrollRef: HTMLDivElement; // 适用于 React 项目
    fireEvent: (eventName: string, payload?: any) => void;
    getData: () => any;
    form: any; // 根据 `form` 结构替换 `any`
    setValue: (field: any, value?: any) => void
};


export type LayoutColumn = {
    type: string;
    label?: string;
    icon?: string;
    key?: string;
    id: string;
    style?: Record<string, any>;
    options?: Record<string, any>;
    columns?: LayoutColumn[];
    list?: LayoutColumn[];
    rows?: LayoutRow[];
};

export type LayoutRow = {
    type: string;
    columns: LayoutColumn[];
    style?: Record<string, any>;
    id: string;
    key: string;
};

export type FormFieldOptions = {
    clearable?: boolean;
    renderType?: number;
    disabled?: boolean;
    showPassword?: boolean;
    defaultValue?: string;
    placeholder?: string;
    labelWidth?: number;
    isShowLabel?: boolean;
    required?: boolean;
    min?: number | null;
    max?: number | null;
    dataKey?: string;
    filterable?: boolean;
    multiple?: boolean;
    checkStrictly?: boolean;
    startTime?: string | null;
    endTime?: string | null;
    format?: string;
    type?: string;
};

export type FormField = {
    type: string;
    label: string;
    icon: string;
    key: string;
    id: string;
    options: FormFieldOptions;
    style: Record<string, any>;
};

export type FormLayout = {
    list: LayoutColumn[];
    config: {
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
    fields: FormField[];
};
//