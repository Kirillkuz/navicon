function onLoad(context) {
    let formContext = context.getFormContext();
    let typeAttr = formContext.getAttribute("nav_type");
    typeAttr.addOnChange(typeOnChange);
    //Вызываем в ручную, для сокрытия ненужного поля при загрузке
    typeOnChange(context);
}
//Отображает телефон или email в зависимости от типа средства связи!
function typeOnChange(context) {
    let formContext = context.getFormContext();
    let emailAttr= formContext.getAttribute("nav_email");
    let phoneAttr = formContext.getAttribute("nav_phone");
    let emailControl = formContext.getControl("nav_email");
    let phoneControl = formContext.getControl("nav_phone");
    let typeAttr = formContext.getAttribute("nav_type");
    if (typeAttr.getValue() == 0) {
        emailControl.setVisible(false);
        emailAttr.setValue("");
        phoneControl.setVisible(true);
    }
    else {
        emailControl.setVisible(true);
        phoneControl.setVisible(false);
        phoneAttr.setValue("");
    }
}