$(function() {
    function PSUControlViewModel(parameters) {
        var self = this;

        self.global_settings = parameters[0];
        self.settings = undefined;
        self.loginState = parameters[1];
        self.isPSUOn = ko.observable(undefined);
        self.psu_indicator = undefined;
        self.poweroff_dialog = undefined;

        self.onAfterBinding = function() {
            self.settings = self.global_settings.settings.plugins.psucontrol;

            self.poweroff_dialog = $("#psucontrol_poweroff_confirmation_dialog");
            self.psu_indicator = $("#psucontrol_indicator");
        };

        self.onDataUpdaterPluginMessage = function(plugin, data) {
            if (plugin != "psucontrol") {
                return;
            }

            self.isPSUOn(data.isPSUOn);

            if (self.isPSUOn()) {
                self.psu_indicator.css('color', '#00FF00');
            } else {
                self.psu_indicator.css('color', '#808080');
            }

        };

        self.togglePSU = function() {
            if (self.isPSUOn()) {
                if (self.settings.enablePowerOffWarningDialog()) {
                    self.showPowerOffDialog();
                } else {
                    self.turnPSUOff();
                }
            } else {
                self.turnPSUOn();
            }
        };

        self.showPowerOffDialog = function() {
            self.poweroff_dialog.modal("show");
        };

        self.turnPSUOn = function() {
            $.ajax({
                url: API_BASEURL + "plugin/psucontrol",
                type: "POST",
                dataType: "json",
                data: JSON.stringify({
                    command: "turnPSUOn"
                }),
                contentType: "application/json; charset=UTF-8"
            })
        };

    	self.turnPSUOff = function() {
            $.ajax({
                url: API_BASEURL + "plugin/psucontrol",
                type: "POST",
                dataType: "json",
                data: JSON.stringify({
                    command: "turnPSUOff"
                }),
                contentType: "application/json; charset=UTF-8"
            })

            self.poweroff_dialog.modal("hide");
        };   
    }

    ADDITIONAL_VIEWMODELS.push([
        PSUControlViewModel,
        ["settingsViewModel", "loginStateViewModel"],
        ["#navbar_plugin_psucontrol"]
    ]);
});
