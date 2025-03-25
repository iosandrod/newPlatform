export type StateType {
    validate: any;
    store: any[];
    selected: Record<string, any>;
    mode: 'edit' | 'view' | 'create'|'preview';
    platform: 'pc' | 'mobile';
    children: any[];
    config: any;
    previewVisible: boolean;
    widthScaleLock: boolean;
    data: Record<string, any>;
    validateStates: any[];
    fields: any[];
    Namespace: string;
    fieldsLogicState?:any
    logic: Record<string, any>;
    othersFiles: Record<string, any>;
}

