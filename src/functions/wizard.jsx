
export function openWizard1(){  
    document.getElementById('wizardP').setAttribute("data-wizard-state","first");
    document.getElementById('wizard-1').setAttribute("data-wizard-state","current");
    document.getElementById('wizard-2').setAttribute("data-wizard-state","pending");
    document.getElementById('wizard-3').setAttribute("data-wizard-state","pending");
    document.getElementById('wizard-1-content').setAttribute("data-wizard-state","current");  
    document.getElementById("wizard-2-content").removeAttribute("data-wizard-state");
    document.getElementById("wizard-3-content").removeAttribute("data-wizard-state");
}
export function openWizard2(){  
    document.getElementById('wizardP').setAttribute("data-wizard-state","between");
    document.getElementById('wizard-1').setAttribute("data-wizard-state","done");
    document.getElementById('wizard-2').setAttribute("data-wizard-state","current");
    document.getElementById('wizard-3').setAttribute("data-wizard-state","pending");
    document.getElementById('wizard-2-content').setAttribute("data-wizard-state","current");
    document.getElementById("wizard-1-content").removeAttribute("data-wizard-state");
    document.getElementById("wizard-3-content").removeAttribute("data-wizard-state");
}

export function openWizard3(){  
    document.getElementById('wizardP').setAttribute("data-wizard-state","last");
    document.getElementById('wizard-1').setAttribute("data-wizard-state","done");
    document.getElementById('wizard-2').setAttribute("data-wizard-state","done");
    document.getElementById('wizard-3').setAttribute("data-wizard-state","current");
    document.getElementById('wizard-3-content').setAttribute("data-wizard-state","current"); 
    document.getElementById("wizard-1-content").removeAttribute("data-wizard-state");
    document.getElementById("wizard-2-content").removeAttribute("data-wizard-state");   
}
