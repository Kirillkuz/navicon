var Navicon = Navicon || {};

Navicon.nav_credit = function () {
    var changeCreditControlVisibility = function (context) {
        let formContext = context.getFormContext();
        let dateStart = formContext.getAttribute("nav_datestart");
        let dateEnd = formContext.getAttribute("nav_dateend");
        let dateEndControl = formContext.getControl("nav_dateend");
        if(dateStart.getValue()!=null&&dateEnd.getValue()!=null&&(((dateEnd.getValue()-dateStart.getValue())/(60*60*24*1000))<365)){
            dateEndControl.setNotification("Период кредитной программы не может быть меньше 0","missingdate");
        }
        if(dateStart.getValue()!=null&&dateEnd.getValue()!=null&&(((dateEnd.getValue()-dateStart.getValue())/(60*60*24*1000))>=365)){
            dateEndControl.clearNotification("missingdate");
        }
        
       
    }

    return {
        onLoad: function (context) {
            
            //changeCreditControlVisibility(context);
            let formContext = context.getFormContext();
            formContext.getAttribute("nav_datestart").addOnChange(changeCreditControlVisibility);
            formContext.getAttribute("nav_dateend").addOnChange(changeCreditControlVisibility);
 
        }
    }
}();