var Navicon = Navicon || {};

Navicon.nav_agreement = function () {
    //Скрытие вкладки кредит
    var changeCreditControlVisibility = function (context) {
        let formContext = context.getFormContext();
        let autoAttr = formContext.getAttribute("nav_autoid");
        let contactAttr = formContext.getAttribute("nav_contact");


        if ((autoAttr.getValue() != null) && (contactAttr.getValue() != null)) {
            formContext.getControl("nav_creditid").setVisible(true);
            formContext.ui.tabs.get("tab_2").setVisible(true);
        }
        else {
            formContext.getControl("nav_creditid").setVisible(false);
            formContext.ui.tabs.get("tab_2").setVisible(false);
        }
    }
    //Валидация имени договора
    var changeAgreementName = function (context) {
        let formContext = context.getFormContext();
        let namenAttr = formContext.getAttribute("nav_name");
        let str = namenAttr.getValue();
        namenAttr.setValue(str.replace(/[^-\d]/g, ''));
    }
    //Отключение полей реадкитрования кредита
    var changeCreditControlDisabled = function (context) {
        let formContext = context.getFormContext();
        let creditPeriodControl = formContext.getControl("nav_creditperiod");
        let creditAmountControl = formContext.getControl("nav_creditamount");
        let fullCreditAmount = formContext.getControl("nav_fullcreditamount");
        let initialFeeControl = formContext.getControl("nav_initialfee");
        let factSummaControl = formContext.getControl("nav_factsumma");
        let paymentPlanDateControl = formContext.getControl("nav_paymentplandate");
        let creditidAttr = formContext.getAttribute("nav_creditid");
        if (creditidAttr.getValue() != null) {
            creditPeriodControl.setDisabled(false);
            creditAmountControl.setDisabled(false);
            fullCreditAmount.setDisabled(false);
            initialFeeControl.setDisabled(false);
            factSummaControl.setDisabled(false);
            paymentPlanDateControl.setDisabled(false);
        }
        else {


            creditPeriodControl.setDisabled(true);
            creditAmountControl.setDisabled(true);
            fullCreditAmount.setDisabled(true);
            initialFeeControl.setDisabled(true);
            factSummaControl.setDisabled(true);
            paymentPlanDateControl.setDisabled(true);
        }

    }

    //Подстановка стоимости автомобиля
    var changeAutoAmount = function (context) {
        let formContext = context.getFormContext();

        let autoAttr = formContext.getAttribute("nav_autoid");
        let summaAttr = formContext.getAttribute("nav_summa");

        var fetchXml =
            "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
            "  <entity name='nav_auto'>" +
            "    <attribute name='nav_autoid' />" +
            "    <attribute name='nav_name' />" +
            "    <attribute name='createdon' />" +
            "    <attribute name='nav_amount' />" +
            "    <attribute name='nav_used' />" +
            "    <order attribute='nav_name' descending='false' />" +
            "    <link-entity name='nav_model' from='nav_modelid' to='nav_modelid' link-type='inner' alias='af'>" +
            "      <attribute name='nav_recommendedamount' />" +
            "    </link-entity>" +
            "  </entity>" +
            "</fetch>";

        Xrm.WebApi.retrieveMultipleRecords("nav_auto", "?fetchXml= " + fetchXml).then(
            function success(result) {

                if (result.entities.length > 0) {
                    for (var i = 0; i < result.entities.length; i++) {
                        var current = result.entities[i];

                        if (('{' + current["nav_autoid"].toLowerCase() + '}') == (autoAttr.getValue()[0]["id"].toString().toLowerCase())) {
                            console.log(current["nav_used"]);
                            if (current["nav_used"] == true) {
                                summaAttr.setValue(current["nav_amount"]);
                            }
                            else {
                                summaAttr.setValue(current["af.nav_recommendedamount"]);
                            }

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

    //Проверка даты кредита
    var checkCreditDate = function (context) {
        let formContext = context.getFormContext();


        let now = new Date();
        let creditControl = formContext.getControl("nav_creditid");
        let creditidAttr = formContext.getAttribute("nav_creditid");
        let creditperiodAttr = formContext.getAttribute("nav_creditperiod");

        var fetchXml =
        "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>"+
        "  <entity name='nav_credit'>"+
        "    <attribute name='nav_creditid' />"+
        "    <attribute name='nav_name' />"+
        "    <attribute name='createdon' />"+
        "    <attribute name='nav_percent' />"+
        "    <attribute name='nav_creditperiod' />"+
        "    <attribute name='nav_dateend' />"+
        "    <attribute name='nav_datestart' />"+
        "    <order attribute='nav_name' descending='false' />"+
        "  </entity>"+
        "</fetch>";
        Xrm.WebApi.retrieveMultipleRecords("nav_credit", "?fetchXml= " + fetchXml).then(
            function success(result) {

                if (result.entities.length > 0) {
                    for (var i = 0; i < result.entities.length; i++) {
                        var current = result.entities[i];
                        if(('{' + current["nav_creditid"].toLowerCase() + '}') == (creditidAttr.getValue()[0]["id"].toString().toLowerCase())){
                            console.log(new Date(current["nav_datestart"]));
                        console.log(now);
                        console.log(new Date(current["nav_dateend"]));
                        if ((new Date(current["nav_datestart"]) <= now && new Date(current["nav_dateend"] )>= now)) {                            
                            creditControl.clearNotification("missingdate");
                        }
                        else
                        {
                            creditControl.setNotification("Срок кредитной программы не актуален","missingdate");
                        }
                        creditperiodAttr.setValue(current["nav_creditperiod"]);
                        }
                        
                        // if (current["nav_used"] == true) {
                        //     summaAttr.setValue(current["nav_amount"]);
                        // }
                        // else {
                        //     summaAttr.setValue(current["af.nav_recommendedamount"]);
                        // }

                    }
                }
            },
            function (error) {
                console.log("failed with error: ", error);
                return null;
            }
        );



    }

    //События измениня автомобиля
    var changeAuto = function (context) {
        changeAutoAmount(context);
        changeCreditControlVisibility(context);
    }
    var changeCredit = function (context) {

        checkCreditDate(context);
        changeCreditControlDisabled(context);
    }



    return {
        onLoad: function (context) {


            let formContext = context.getFormContext();
            let formType = formContext.ui.getFormType();
            let factControl = formContext.getControl("nav_fact");
            let creditControl = formContext.getControl("nav_creditid");



            formContext.getAttribute("nav_creditid").addOnChange(changeAutoAmount);
            let creditTab = formContext.ui.tabs.get("tab_2");
            //Отключаем возможность вводить Сумму
            let summaControl = formContext.getControl("nav_summa");
            summaControl.setDisabled(true);

            
                factControl.setVisible(false);
                creditControl.setVisible(false);
                creditTab.setVisible(false);

                formContext.getAttribute("nav_autoid").addOnChange(changeAuto);
                formContext.getAttribute("nav_contact").addOnChange(changeCreditControlVisibility);
                formContext.getAttribute("nav_name").addOnChange(changeAgreementName);
                formContext.getAttribute("nav_creditid").addOnChange(changeCredit);
            
            changeCreditControlDisabled(context);
            changeCreditControlVisibility(context);
        }
    }
}();