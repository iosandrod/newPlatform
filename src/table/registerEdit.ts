import * as VTable_editors from '@visactor/vtable-editors';
import { ListTable } from '@visactor/vtable'//
import * as VTable from '@visactor/vtable'

export function registerEdit() {//
    const input_editor = new VTable_editors.InputEditor();
    const date_input_editor = new VTable_editors.DateInputEditor();
    const list_editor = new VTable_editors.ListEditor({ values: ['girl', 'boy'] });
    const textArea_editor = new VTable_editors.TextAreaEditor({ readonly: false });
    VTable.register.editor('input-editor', input_editor);
    VTable.register.editor('date-input-editor', date_input_editor);
    VTable.register.editor('list-editor', list_editor);
    VTable.register.editor('textArea-editor', textArea_editor);
}


export function registerFilter() {
    // VTable.register.icon('filter')
}