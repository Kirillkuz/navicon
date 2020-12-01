var Navicon = Navicon || {};

Navicon.nav_model = function () {
    var CheckUserRole = function () {
        var roles = Xrm.Utility.getGlobalContext().userSettings.roles;
        if (roles === null) return true;
        var IsNotAdmin = true;
        roles.forEach(function (item) {
            if (item.name.toLowerCase() === "системный администратор") {
                IsNotAdmin = false;
            }
        });
        return IsNotAdmin;
    }
    var ChangeDisabledSetting = function(context){
        let formContext = context.getFormContext();
        let brandIdControl = formContext.getControl("nav_brandid");
        let volumeControl = formContext.getControl("nav_volume");
        let yearControl = formContext.getControl("nav_year");
        let kpControl = formContext.getControl("nav_kp");
        let colorControl = formContext.getControl("nav_color");
        let detailsControl = formContext.getControl("nav_details");
        let recommendedamountControl = formContext.getControl("nav_recommendedamount");

        brandIdControl.setDisabled(true);
        volumeControl.setDisabled(true);
        yearControl.setDisabled(true);
        kpControl.setDisabled(true);
        colorControl.setDisabled(true);
        detailsControl.setDisabled(true);
        recommendedamountControl.setDisabled(true);

    }
    return {
        onLoad: function (context) {
            let formContext = context.getFormContext();
            if (formContext.ui.getFormType() === 2) {

                if (CheckUserRole()) {
                    ChangeDisabledSetting(context);
                }
            }
        }
    }

}();

