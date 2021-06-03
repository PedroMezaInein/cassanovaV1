import Swal from 'sweetalert2'

export function openWizard1() {
    document.getElementById('wizardP').setAttribute("data-wizard-state", "first");
    document.getElementById('wizard-1').setAttribute("data-wizard-state", "current");
    document.getElementById('wizard-2').setAttribute("data-wizard-state", "pending");
    if(document.getElementById('wizard-3'))
        document.getElementById('wizard-3').setAttribute("data-wizard-state", "pending");
    document.getElementById('wizard-1-content').setAttribute("data-wizard-state", "current");
    document.getElementById("wizard-2-content").removeAttribute("data-wizard-state");
    if(document.getElementById('wizard-3-content'))
        document.getElementById("wizard-3-content").removeAttribute("data-wizard-state");
}

export function openWizard2() {
    var elementsInvalid = document.getElementById("wizard-1-content").getElementsByClassName("is-invalid");

    if (elementsInvalid.length === 0) {
        document.getElementById('wizardP').setAttribute("data-wizard-state", "between");
        document.getElementById('wizard-1').setAttribute("data-wizard-state", "done");
        document.getElementById('wizard-2').setAttribute("data-wizard-state", "current");
        if(document.getElementById('wizard-3'))
            document.getElementById('wizard-3').setAttribute("data-wizard-state", "pending");
        document.getElementById('wizard-2-content').setAttribute("data-wizard-state", "current");
        document.getElementById("wizard-1-content").removeAttribute("data-wizard-state");
        if(document.getElementById("wizard-3-content"))
            document.getElementById("wizard-3-content").removeAttribute("data-wizard-state");
    } else {
        Swal.fire({
            title: '¡LO SENTIMOS!',
            text: 'Llena todos los campos requeridos',
            icon: 'warning',
            customClass: {
                actions: 'd-none'
            },
            timer: 2500,
        })
    }
}

export function openWizard3() {
    var elementsInvalid = document.getElementById("wizard-2-content").getElementsByClassName("is-invalid");

    if (elementsInvalid.length === 0) {
        document.getElementById('wizardP').setAttribute("data-wizard-state", "last");
        document.getElementById('wizard-1').setAttribute("data-wizard-state", "done");
        document.getElementById('wizard-2').setAttribute("data-wizard-state", "done");
        document.getElementById('wizard-3').setAttribute("data-wizard-state", "current");
        document.getElementById('wizard-3-content').setAttribute("data-wizard-state", "current");
        document.getElementById("wizard-1-content").removeAttribute("data-wizard-state");
        document.getElementById("wizard-2-content").removeAttribute("data-wizard-state");
    } else {
        Swal.fire({
            title: '¡LO SENTIMOS!',
            text: 'Llena todos los campos requeridos',
            icon: 'warning',
            customClass: {
                actions: 'd-none'
            },
            timer: 2500,
        })
    }
}

export function openWizard1_for2_wizard() {
    document.getElementById('for2-wizardP').setAttribute("data-wizard-state", "first");
    document.getElementById('for2-wizard-1').setAttribute("data-wizard-state", "current");
    document.getElementById('for2-wizard-2').setAttribute("data-wizard-state", "pending");
    document.getElementById('for2-wizard-1-content').setAttribute("data-wizard-state", "current");
    document.getElementById("for2-wizard-2-content").removeAttribute("data-wizard-state");
}

export function openWizard2_for2_wizard() {
    var elementsInvalid = document.getElementById("for2-wizard-1-content").getElementsByClassName("is-invalid");

    if (elementsInvalid.length === 0) {
        document.getElementById('for2-wizardP').setAttribute("data-wizard-state", "last");
        document.getElementById('for2-wizard-1').setAttribute("data-wizard-state", "done");
        document.getElementById('for2-wizard-2').setAttribute("data-wizard-state", "current");
        document.getElementById('for2-wizard-2-content').setAttribute("data-wizard-state", "current");
        document.getElementById("for2-wizard-1-content").removeAttribute("data-wizard-state");
    } else {
        Swal.fire({
            title: '¡LO SENTIMOS!',
            text: 'Llena todos los campos requeridos',
            icon: 'warning',
            customClass: {
                actions: 'd-none'
            },
            timer: 2500,
        })
    }
}

export function openWizard1_4TABS() {
    document.getElementById('wizardP').setAttribute("data-wizard-state", "first");
    document.getElementById('wizard-1').setAttribute("data-wizard-state", "current");
    document.getElementById('wizard-2').setAttribute("data-wizard-state", "pending");
    if(document.getElementById('wizard-3'))
        document.getElementById('wizard-3').setAttribute("data-wizard-state", "pending");
    document.getElementById('wizard-1-content').setAttribute("data-wizard-state", "current");
    document.getElementById("wizard-2-content").removeAttribute("data-wizard-state");
    if(document.getElementById('wizard-3-content'))
        document.getElementById("wizard-3-content").removeAttribute("data-wizard-state");
    if(document.getElementById('wizard-4-content'))
        document.getElementById("wizard-4-content").removeAttribute("data-wizard-state");    
}

export function openWizard2_4TABS() {
    var elementsInvalid = document.getElementById("wizard-1-content").getElementsByClassName("is-invalid");

    if (elementsInvalid.length === 0) {
        document.getElementById('wizardP').setAttribute("data-wizard-state", "between");
        document.getElementById('wizard-1').setAttribute("data-wizard-state", "done");
        document.getElementById('wizard-2').setAttribute("data-wizard-state", "current");
        if(document.getElementById('wizard-3'))
            document.getElementById('wizard-3').setAttribute("data-wizard-state", "pending");
        document.getElementById('wizard-2-content').setAttribute("data-wizard-state", "current");
        document.getElementById("wizard-1-content").removeAttribute("data-wizard-state");
        if(document.getElementById("wizard-3-content"))
            document.getElementById("wizard-3-content").removeAttribute("data-wizard-state");
        if(document.getElementById('wizard-4-content'))
            document.getElementById("wizard-4-content").removeAttribute("data-wizard-state");
    } else {
        Swal.fire({
            title: '¡LO SENTIMOS!',
            text: 'Llena todos los campos requeridos',
            icon: 'warning',
            customClass: {
                actions: 'd-none'
            },
            timer: 2500,
        })
    }
}

export function openWizard3_4TABS() {
    var elementsInvalid = document.getElementById("wizard-2-content").getElementsByClassName("is-invalid");

    if (elementsInvalid.length === 0) {
        document.getElementById('wizardP').setAttribute("data-wizard-state", "between");
        document.getElementById('wizard-1').setAttribute("data-wizard-state", "done");
        document.getElementById('wizard-2').setAttribute("data-wizard-state", "done");
        document.getElementById('wizard-3').setAttribute("data-wizard-state", "current");
        if(document.getElementById('wizard-4'))
            document.getElementById('wizard-4').setAttribute("data-wizard-state", "pending");
        document.getElementById('wizard-3-content').setAttribute("data-wizard-state", "current");
        document.getElementById('wizard-2-content').setAttribute("data-wizard-state", "done");
        document.getElementById("wizard-1-content").removeAttribute("data-wizard-state", "done");
        if(document.getElementById("wizard-4-content"))
            document.getElementById("wizard-4-content").removeAttribute("data-wizard-state");
    } else {
        Swal.fire({
            title: '¡LO SENTIMOS!',
            text: 'Llena todos los campos requeridos',
            icon: 'warning',
            customClass: {
                actions: 'd-none'
            },
            timer: 2500,
        })
    }
}

export function openWizard4_4TABS() {
    var elementsInvalid = document.getElementById("wizard-3-content").getElementsByClassName("is-invalid");

    if (elementsInvalid.length === 0) {
        document.getElementById('wizardP').setAttribute("data-wizard-state", "last");
        document.getElementById('wizard-1').setAttribute("data-wizard-state", "done");
        document.getElementById('wizard-2').setAttribute("data-wizard-state", "done");
        document.getElementById('wizard-3').setAttribute("data-wizard-state", "done");
        document.getElementById('wizard-4').setAttribute("data-wizard-state", "current");
        document.getElementById('wizard-4-content').setAttribute("data-wizard-state", "current");
        document.getElementById("wizard-3-content").removeAttribute("data-wizard-state");
        document.getElementById("wizard-1-content").removeAttribute("data-wizard-state");
        document.getElementById("wizard-2-content").removeAttribute("data-wizard-state");
    } else {
        Swal.fire({
            title: '¡LO SENTIMOS!',
            text: 'Llena todos los campos requeridos',
            icon: 'warning',
            customClass: {
                actions: 'd-none'
            },
            timer: 2500,
        })
    }
}