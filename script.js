document.addEventListener("DOMContentLoaded", function () {
    let display = document.getElementById("display");
    let buttons = document.querySelectorAll("button");
    let expression = "";
    let toggleButton = document.getElementById("togglebutton");
    let isScientific = false;

    let operator1 = document.getElementById("operator1");
    let operator2 = document.getElementById("operator2");
    let operator3 = document.getElementById("operator3");
    let operator4 = document.getElementById("operator4");
    let operator5 = document.getElementById("operator5");
    let operator6 = document.getElementById("operator6");
    let operator7 = document.getElementById("operator7");

    function setScientificMode() {
        operator1.textContent = "sin";
        operator2.textContent = "cos";
        operator3.textContent = "tan";
        operator4.textContent = "log";
        operator5.textContent = "e";
        operator6.textContent = "√";
        operator7.textContent = "π";
    }

    function setStandardMode() {
        operator1.textContent = "(";
        operator2.textContent = ")";
        operator3.textContent = "%";
        operator4.textContent = "÷";
        operator5.textContent = "x";
        operator6.textContent = "+";
        operator7.textContent = "-";
    }

    toggleButton.addEventListener("click", function () {
        if (isScientific) {
            setStandardMode();
        } else {
            setScientificMode();
        }
        isScientific = !isScientific;
    });

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            let value = this.textContent;
            
            if (value === ">") {
                return; // Prevent '>' from being added to the display
            }
            
            if (value === "AC") {
                expression = "";
                display.value = "";
            } else if (value === "=") {
                try {
                    let replacedExp = expression.replace(/x/g, "*").replace(/÷/g, "/");
                    replacedExp = replacedExp.replace(/sin\(([^)]+)\)/g, "Math.sin($1 * Math.PI / 180)")
                                           .replace(/cos\(([^)]+)\)/g, "Math.cos($1 * Math.PI / 180)")
                                           .replace(/tan\(([^)]+)\)/g, "Math.tan($1 * Math.PI / 180)")
                                           .replace(/log\(([^)]+)\)/g, "Math.log10($1)")
                                           .replace(/e/g, "Math.E")
                                           .replace(/√\(([^)]+)\)/g, "Math.sqrt($1)")
                                           .replace(/pi/g, "Math.PI");
                    let result = eval(replacedExp);
                    if (typeof result === "number") {
                        result = Math.abs(result) < 1e-10 ? 0 : result; // Round small floating-point errors
                        if (Math.abs(result) > 1e7) {
                            result = "∞"; // Represent large exponential values as infinity
                        }
                    }
                    display.value = result;
                    expression = display.value;
                } catch (error) {
                    display.value = "∞";
                    expression = "";
                }
            } else {
                expression += value;
                display.value = expression;
            }
        });
    });
});

