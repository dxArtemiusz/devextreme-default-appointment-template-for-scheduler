$(() => {
  const scheduler = $('.scheduler').dxScheduler({
    appointmentTooltipTemplate(data, cell) {
      const tooltip = $('<div class="dx-tooltip-appointment-item">');

      // NOTE: You can use data.appointmentData.resouceId to obtain resource color
      let markerColor = employees.find((resource)=>{return resource.id === data.appointmentData.employeeID}).color

      const markerBody = $('<div class="dx-tooltip-appointment-item-marker-body">').css('background', markerColor);
      const marker = $('<div class="dx-tooltip-appointment-item-marker">').append(markerBody);
      const content = $('<div class="dx-tooltip-appointment-item-content">')
          .append($('<div class="dx-tooltip-appointment-item-content-subject">').text(data.appointmentData.text))
          .append($('<div class="dx-tooltip-appointment-item-content-date">').text(data.appointmentData.startDate));

      tooltip.append(marker);
      tooltip.append(content);

      const isAppointmentDisabled = data.appointmentData.disabled;
      const isDeleteAllowed = (scheduler.option('editing') && scheduler.option('editing.allowDeleting') === true)
          || scheduler.option('editing') === true;

      if (!isAppointmentDisabled && isDeleteAllowed) {
          const buttonContainer = $('<div class="dx-tooltip-appointment-item-delete-button-container">');
          const button = $('<div class="dx-tooltip-appointment-item-delete-button">').dxButton({
              icon: 'trash',
              stylingMode: 'text',
              onClick(e) {
                  scheduler.deleteAppointment(data.appointmentData);
                  e.event.stopPropagation();
                  scheduler.hideAppointmentTooltip();
              }
          });

          buttonContainer.append(button);
          tooltip.append(buttonContainer);
      }

      return tooltip;
    },
    timeZone: 'America/Los_Angeles',
    dataSource: data,
    views: ['month'],
    currentView: 'month',
    currentDate: new Date(2021, 5, 2, 11, 30),
    firstDayOfWeek: 1,
    startDayHour: 8,
    endDayHour: 18,
    showAllDayPanel: false,
    height: 600,
    groups: ['employeeID'],
    resources: [
      {
        fieldExpr: 'employeeID',
        allowMultiple: false,
        dataSource: employees,
        label: 'Employee',
      },
    ],
    dataCellTemplate(cellData, index, container) {
      const { employeeID } = cellData.groups;
      const currentTraining = getCurrentTraining(cellData.startDate.getDate(), employeeID);

      const wrapper = $('<div>')
        .toggleClass(`employee-weekend-${employeeID}`, isWeekEnd(cellData.startDate)).appendTo(container)
        .addClass(`employee-${employeeID}`)
        .addClass('dx-template-wrapper');

      wrapper.append($('<div>')
        .text(cellData.text)
        .addClass(currentTraining)
        .addClass('day-cell'));
    },
    resourceCellTemplate(cellData) {
      const name = $('<div>')
        .addClass('name')
        .css({ backgroundColor: cellData.color })
        .append($('<h2>')
          .text(cellData.text));

      const avatar = $('<div>')
        .addClass('avatar')
        .html(`<img src=${cellData.data.avatar}>`)
        .attr('title', cellData.text);

      const info = $('<div>')
        .addClass('info')
        .css({ color: cellData.color })
        .html(`Age: ${cellData.data.age}<br/><b>${cellData.data.discipline}</b>`);

      return $('<div>').append([name, avatar, info]);
    },
  }).dxScheduler('instance');

  function isWeekEnd(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  function getCurrentTraining(date, employeeID) {
    const result = (date + employeeID) % 3;
    const currentTraining = `training-background-${result}`;

    return currentTraining;
  }
});
