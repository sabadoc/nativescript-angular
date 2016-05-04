import {Directive, ElementRef, Renderer, Self, forwardRef, provide} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/common/src/forms/directives/control_value_accessor';
import {isBlank, isNumber} from '@angular/core/src/facade/lang';
import {BaseValueAccessor} from './base-value-accessor';
import {View} from "ui/core/view";

const SELECTED_INDEX_VALUE_ACCESSOR = provide(NG_VALUE_ACCESSOR, { useExisting: forwardRef(() => SelectedIndexValueAccessor), multi: true });

export type SelectableView = {selectedIndex: number} & View;

/**
 * The accessor for setting a selectedIndex and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <SegmentedBar [(ngModel)]='model.test'>
 *  ```
 */
@Directive({
    selector: 'SegmentedBar[ngModel], ListPicker[ngModel], TabView[ngModel]',
    host: { '(selectedIndexChange)': 'onChange($event.value)' },
    bindings: [SELECTED_INDEX_VALUE_ACCESSOR]
})
export class SelectedIndexValueAccessor extends BaseValueAccessor<SelectableView> {
    onTouched = () => { };

    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }
    
    private _normalizedValue: number;
    private viewInitialized: boolean;

    writeValue(value: any): void {
        let normalizedValue;
        if (isBlank(value)) {
            normalizedValue = 0;
        } else {
            if (isNumber(value)) {
                normalizedValue = value;
            } else {
                let parsedValue = parseInt(value);
                normalizedValue = isNaN(parsedValue) ? 0 : parsedValue;
            }
        }
        this._normalizedValue = Math.round(normalizedValue);
        if (this.viewInitialized) {
            this.view.selectedIndex = this._normalizedValue;
        }
    }
    
    ngAfterViewInit() {
        this.viewInitialized = true;
        this.view.selectedIndex = this._normalizedValue;
    }

    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
