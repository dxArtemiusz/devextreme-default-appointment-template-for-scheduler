import { NgModule, Component, Input, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';  
import { DxButtonModule } from 'devextreme-angular';
import { ClickEvent } from 'devextreme/ui/button';
import { dxSchedulerAppointment } from 'devextreme/ui/scheduler';

@Component({
    selector: "Tooltip",
    templateUrl: "./tooltip.component.html"
})
export class TooltipComponent {
    @Input() appointmentData: dxSchedulerAppointment;
    @Input() markerColor: string;
    @Input() isDeleteButtonExist: boolean;
    @Output() onDeleteButtonClick = new EventEmitter<ClickEvent>();
}

@NgModule({
imports: [DxButtonModule, CommonModule],
        declarations: [TooltipComponent],
        exports: [TooltipComponent]
})
export class TooltipModule { }