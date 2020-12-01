var Navicon = Navicon || {};

Navicon.nav_auto = function() {
    var usedOnChange = function(context)
    {
        let formContext = context.getFormContext();
        let usedAttr = formContext.getAttribute("nav_used");
        let kmAttr= formContext.getAttribute("nav_km");
        let isdamagedAttr= formContext.getAttribute("nav_isdamaged");
        let ownerscountAttr = formContext.getAttribute("nav_ownerscount");
        let kmControl = formContext.getControl("nav_km");
        let isdamagedControl = formContext.getControl("nav_isdamaged");
        let ownerscountControl = formContext.getControl("nav_ownerscount");
        
        if (usedAttr.getValue() == 0) {
            kmControl.setVisible(false);
            isdamagedControl.setVisible(false);
            ownerscountControl.setVisible(false);
            kmAttr.setValue(0);
            isdamagedAttr.setValue(false);
            ownerscountAttr.setValue(0);
            
        }
        else {
            kmControl.setVisible(true);
            isdamagedControl.setVisible(true);
            ownerscountControl.setVisible(true);
        }
    }
 

    return {
        onLoad: function(context) {
            let formContext = context.getFormContext();
            let usedAttr = formContext.getAttribute("nav_used");
            usedAttr.addOnChange(usedOnChange);
            //Вызываем в ручную, для сокрытия ненужного поля при загрузке
            usedOnChange(context);

        }
    }
}();


