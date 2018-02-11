/* eslint unicorn/filename-case: "off", func-names: "off", camelcase: "off", no-unused-vars: "off" */

module.exports = function (iface) {
    const {mqttPub, mqttSub, mqttStatus, log, newAccessory, Service, Characteristic} = iface;

    /*
   // Required Characteristics
  this.addCharacteristic(Characteristic.Active);
  this.addCharacteristic(Characteristic.ProgramMode);
  this.addCharacteristic(Characteristic.InUse);

  // Optional Characteristics
  this.addOptionalCharacteristic(Characteristic.Name);
  this.addOptionalCharacteristic(Characteristic.RemainingDuration);
  this.addOptionalCharacteristic(Characteristic.StatusFault);
     */


    return function createAccessory_IrrigationSystem(settings) {
        const irrigation = newAccessory(settings);

        if (typeof settings.payload.activeTrue === 'undefined') {
            settings.payload.activeTrue = true;
        }

        if (typeof settings.payload.inUseTrue === 'undefined') {
            settings.payload.inUseTrue = true;
        }

        if (typeof settings.payload.faultTrue === 'undefined') {
            settings.payload.faultTrue = true;
        }

        if (typeof settings.payload.activeFalse === 'undefined') {
            settings.payload.activeFalse = false;
        }


        irrigation.addService(Service.IrrigationSystem, settings.name)
            .getCharacteristic(Characteristic.Active)
            .on('set', (value, callback) => {
                log.debug('< hap set', settings.name, 'Active', value);
                const active = value ? settings.payload.activeTrue : settings.payload.activeFalse;
                log.debug('> mqtt', settings.topic.setActive, active);
                mqttPub(settings.topic.setActive, active);
                callback();
            });

        /* istanbul ignore else  */
        if (settings.topic.statusActive) {
            mqttSub(settings.topic.statusActive, val => {
                log.debug('< mqtt', settings.topic.statusActive, val);
                const active = mqttStatus[settings.topic.statusActive] === settings.payload.activeTrue ? 1 : 0;
                log.debug('> hap update', settings.name, 'Active', active);
                irrigation.getService(Service.IrrigationSystem)
                    .updateCharacteristic(Characteristic.Active, active);
            });
            irrigation.getService(Service.IrrigationSystem)
                .getCharacteristic(Characteristic.Active)
                .on('get', callback => {
                    log.debug('< hap get', settings.name, 'Active');
                    const active = mqttStatus[settings.topic.statusActive] === settings.payload.activeTrue ? 1 : 0;
                    log.debug('> hap re_get', settings.name, 'Active', active);
                    callback(null, active);
                });
        }

        mqttSub(settings.topic.statusProgramMode, val => {
            log.debug('< mqtt', settings.topic.statusProgramMode, val);
            const mode = mqttStatus[settings.topic.statusProgramMode];
            log.debug('> hap update', settings.name, 'ProgramMode', mode);
            irrigation.getService(Service.IrrigationSystem)
                .updateCharacteristic(Characteristic.ProgramMode, mode);
        });
        irrigation.getService(Service.IrrigationSystem)
            .getCharacteristic(Characteristic.ProgramMode)
            .on('get', callback => {
                log.debug('< hap get', settings.name, 'ProgramMode');
                const mode = mqttStatus[settings.topic.statusProgramMode];
                log.debug('> hap re_get', settings.name, 'ProgramMode', mode);
                callback(null, mode);
            });

        mqttSub(settings.topic.statusInUse, val => {
            log.debug('< mqtt', settings.topic.statusInUse, val);
            const inUse = mqttStatus[settings.topic.statusInUse] === settings.payload.inUseTrue ? 1 : 0;
            log.debug('> hap update', settings.name, 'InUse', inUse);
            irrigation.getService(Service.IrrigationSystem)
                .updateCharacteristic(Characteristic.InUse, inUse);
        });
        irrigation.getService(Service.IrrigationSystem)
            .getCharacteristic(Characteristic.InUse)
            .on('get', callback => {
                log.debug('< hap get', settings.name, 'InUse');
                const inUse = mqttStatus[settings.topic.statusInUse] === settings.payload.inUseTrue ? 1 : 0;
                log.debug('> hap re_get', settings.name, 'InUse', inUse);
                callback(null, inUse);
            });

        /* istanbul ignore else  */
        if (settings.topic.statusRemainingDuration) {
            mqttSub(settings.topic.statusRemainingDuration, val => {
                log.debug('< mqtt', settings.topic.statusRemainingDuration, val);
                const remainingDuration = mqttStatus[settings.topic.statusRemainingDuration];
                log.debug('> hap update', settings.name, 'RemainingDuration', remainingDuration);
                irrigation.getService(Service.IrrigationSystem)
                    .updateCharacteristic(Characteristic.RemainingDuration, remainingDuration);
            });
            irrigation.getService(Service.IrrigationSystem)
                .getCharacteristic(Characteristic.RemainingDuration)
                .on('get', callback => {
                    log.debug('< hap get', settings.name, 'RemainingDuration');
                    const inUse = mqttStatus[settings.topic.statusRemainingDuration];
                    log.debug('> hap re_get', settings.name, 'RemainingDuration', inUse);
                    callback(null, inUse);
                });
        }

        /* istanbul ignore else  */
        if (settings.topic.statusFault) {
            mqttSub(settings.topic.statusFault, val => {
                log.debug('< mqtt', settings.topic.statusFault, val);
                const fault = mqttStatus[settings.topic.statusFault] === settings.payload.faultTrue ? 1 : 0;
                log.debug('> hap update', settings.name, 'StatusFault', fault);
                irrigation.getService(Service.IrrigationSystem)
                    .updateCharacteristic(Characteristic.StatusFault, fault);
            });
            irrigation.getService(Service.IrrigationSystem)
                .getCharacteristic(Characteristic.StatusFault)
                .on('get', callback => {
                    log.debug('< hap get', settings.name, 'StatusFault');
                    const fault = mqttStatus[settings.topic.statusFault] === settings.payload.faultTrue ? 1 : 0;
                    log.debug('> hap re_get', settings.name, 'StatusFault', fault);
                    callback(null, fault);
                });
        }

        return irrigation;
    };
};