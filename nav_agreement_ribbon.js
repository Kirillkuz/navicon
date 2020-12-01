var Navicon = Navicon || {};

Navicon.nav_agreement_ribbon = (function () {
    return {
        CountValue: function (primaryControl) {
            //let formContext = Xrm.Utility.getPageContext();
            console.log(primaryControl);
            var formContext = primaryControl;
            console.log(formContext);
            let creditamountAttr = formContext.getAttribute("nav_creditamount");
            let creditidAttr = formContext.getAttribute("nav_creditid");
            let summaAttr = formContext.getAttribute("nav_summa");
            let initialfeeAttr = formContext.getAttribute("nav_initialfee");
            let creditperiodAttr = formContext.getAttribute("nav_creditperiod");
            let fullcreditamountAttr = formContext.getAttribute("nav_fullcreditamount");
            var fetchXml =
                "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
                "  <entity name='nav_credit'>" +
                "    <attribute name='nav_creditid' />" +
                "    <attribute name='nav_name' />" +
                "    <attribute name='createdon' />" +
                "    <attribute name='nav_percent' />" +
                "    <order attribute='nav_name' descending='false' />" +
                "  </entity>" +
                "</fetch>";
            Xrm.WebApi.retrieveMultipleRecords("nav_credit", "?fetchXml= " + fetchXml).then(
                function success(result) {

                    if (result.entities.length > 0) {
                        for (var i = 0; i < result.entities.length; i++) {
                            var current = result.entities[i];
                            if(('{' + current["nav_creditid"].toLowerCase() + '}') == (creditidAttr.getValue()[0]["id"].toString().toLowerCase())){
                                creditamountAttr.setValue(summaAttr.getValue()-initialfeeAttr.getValue());

                                fullcreditamountAttr.setValue((current["nav_percent"]/100*creditperiodAttr.getValue()*creditamountAttr.getValue())+summaAttr.getValue());

                            }

                        }
                    }
                },
                function (error) {
                    console.log("failed with error: ", error);
                    return null;
                }
            );
        }
    }
})();
