/* 
* Base widget for FTUI version 3
*
* Copyright (c) 2019-2020 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
* 
* https://github.com/knowthelist/ftui
*/

export class FtuiWidget extends HTMLElement {
  constructor(defaults) {
    super();

    // put HTML attributes into widget parameters
    const attributes = {};
    [...this.attributes].forEach(attr => {
      const name = attr.name.replace(/-([a-z])/g, (char) => { return char[1].toUpperCase() });
      attributes[name] = attr.value;
    });
    Object.assign(this, defaults, attributes);

    // init HTML template
    if (typeof this.template === 'function') {
      this.insertAdjacentHTML('beforeend', this.template());
    }

    this.delayedSubmitCommand = ftui.delay(this.submitCommand, this.delay);
  }

  sendReadingChange(reading, value) {
    const [, deviceName, readingName] = /^([^-:]*)[-:](.*)$/.exec(reading) || [null, reading, null];
    const cmdl = [this.cmd, deviceName, readingName, value].join(' ');
    if (this.delay) {
      this.delayedSubmitCommand(cmdl);
    } else {
      this.submitCommand(cmdl);
    }
  }

  submitCommand(cmdl) {
    if (ftui.sendFhemCommand(cmdl) ) {
      ftui.toast(cmdl);
    }
  }

  getAllClasses(attribute) {
    const map = ftui.parseObject(attribute);
    return map ?
      Object.values(map).map(value => value).join(' ').split(' ').filter(String) :
      '';
  }

  getMatchingClasses(attribute, value) {
    const matchValue = ftui.getMatchingValue(attribute, value);
    return matchValue ? matchValue.split(' ').filter(String) : [];
  }

  setMatchingClasses(element, classes, value) {
    if (classes) {
      element.classList.remove(...this.getAllClasses(classes));
      element.classList.add(...this.getMatchingClasses(classes, value));
    }
  }
}
