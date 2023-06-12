import { NgModule, Component, enableProdMode, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule, DxTemplateModule, DxSchedulerComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { Service, Employee } from './app.service';
import { ApplyPipe } from './pipes';
import { ClickEvent } from 'devextreme/ui/button';
import { dxSchedulerAppointment } from 'devextreme/ui/scheduler';
import { TooltipModule } from './tooltip/tooltip.component';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
})
export class AppComponent {
  @ViewChild('targetScheduler', { static: true })
  scheduler: DxSchedulerComponent;
  dataSource: any;

  currentDate: Date = new Date(2021, 5, 2, 11, 30);

  resourcesDataSource: Employee[];

  constructor(service: Service) {
    this.dataSource = new DataSource({
      store: service.getData(),
    });
    this.resourcesDataSource = service.getEmployees();
  }

  onDeleteButtonClick(e: ClickEvent, appointmentData: dxSchedulerAppointment): void {
    this.scheduler.instance.deleteAppointment(appointmentData);
    console.log('hi')
    e.event.stopPropagation();
    this.scheduler.instance.hideAppointmentTooltip();
  }

  isDeleteButtonExist({ appointmentData }: { appointmentData: dxSchedulerAppointment}): boolean {
      const schedulerInstance = this.scheduler.instance;
      const isAppointmentDisabled = appointmentData.disabled;
      const isDeleteAllowed = (schedulerInstance.option('editing') && schedulerInstance.option('editing.allowDeleting') === true)
          || schedulerInstance.option('editing') === true;

      return !isAppointmentDisabled && isDeleteAllowed;
  }

  markWeekEnd = (cellData) => {
    function isWeekEnd(date) {
      const day = date.getDay();
      return day === 0 || day === 6;
    }

    return {
      [`employee-${cellData.groups.employeeID}`]: true,
      [`employee-weekend-${cellData.groups.employeeID}`]: isWeekEnd(cellData.startDate),
    };
  };

  markTraining = (cellData) => {
    const classObject = {
      'day-cell': true,
    };

    classObject[AppComponent.getCurrentTraining(cellData.startDate.getDate(), cellData.groups.employeeID)] = true;
    return classObject;
  };

  static getCurrentTraining(date, employeeID) {
    const result = (date + employeeID) % 3;
    const currentTraining = `training-background-${result}`;

    return currentTraining;
  }


  getColor = (id) => {
    return this.resourcesDataSource.find((employee) => {
      return employee.id === id;
    }).color;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxSchedulerModule,
    DxTemplateModule,
    TooltipModule
  ],
  declarations: [AppComponent, ApplyPipe],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
