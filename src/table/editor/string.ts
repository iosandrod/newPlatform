export interface EditorConfig {
    readonly?: boolean;
}

export interface ReferencePosition {
    rect?: DOMRect;
}

export interface OnStartParams {
    value?: string;
    referencePosition?: ReferencePosition;
    container: HTMLElement;
    endEdit: () => void;
}

export class InputEditor {
    private editorType: string = "Input";
    private editorConfig?: EditorConfig;
    private element?: HTMLInputElement;
    private container!: HTMLElement;
    private successCallback?: () => void;

    constructor(editorConfig?: EditorConfig) {
        this.editorConfig = editorConfig;
    }

    createElement(): void {
        const input = document.createElement("input");
        input.setAttribute("type", "text");

        if (this.editorConfig?.readonly) {
            input.setAttribute("readonly", "true");
        }

        Object.assign(input.style, {
            position: "absolute",
            padding: "4px",
            width: "100%",
            boxSizing: "border-box",
            backgroundColor: "#FFFFFF"
        });

        this.element = input;
        this.container.appendChild(input);

        input.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
                e.stopPropagation();
            }
        });

        input.addEventListener("wheel", (e: WheelEvent) => {
            e.preventDefault();
        });
    }

    setValue(value?: string): void {
        if (this.element) {
            this.element.value = value !== undefined ? value : "";
        }
    }

    getValue(): string {
        return this.element ? this.element.value : "";
    }

    onStart({ value, referencePosition, container, endEdit }: OnStartParams): void {
        this.container = container;
        this.successCallback = endEdit;

        if (!this.element) {
            this.createElement();
            if (value !== undefined) {
                this.setValue(value);
            }
            if (referencePosition?.rect) {
                this.adjustPosition(referencePosition.rect);
            }
        }

        this.element?.focus();
    }

    adjustPosition(rect: DOMRect): void {
        if (this.element) {
            Object.assign(this.element.style, {
                top: `${rect.top}px`,
                left: `${rect.left}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`
            });
        }
    }

    endEditing(): void { }

    onEnd(): void {
        if (this.container?.contains(this.element!)) {
            this.container.removeChild(this.element!);
        }
        this.element = undefined;
    }

    isEditorElement(target: EventTarget | null): boolean {
        return target === this.element;
    }

    validateValue(newValue: string, oldValue: string, position: any, table: any): boolean {
        return true;
    }
}
