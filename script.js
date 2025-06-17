document.addEventListener("DOMContentLoaded", function () {
    const display = document.getElementById("display");
    const expressionDisplay = document.getElementById("expressionDisplay");
    const buttons = document.querySelectorAll("button");
    const historyPanel = document.getElementById("historyPanel");
    const historyList = document.getElementById("historyList");
    const historyBtn = document.getElementById("historyBtn");
    const clearHistoryBtn = document.getElementById("clearHistory");
    const toggleButton = document.getElementById("togglebutton");
    const scientificButtons = document.querySelector(".scientific-buttons");
    const degRadBtn = document.getElementById("degRad");

    let expression = "";
    let isScientific = false;
    let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
    let isDegrees = true; // true for degrees, false for radians
    let lastResult = "";

    // Initialize history panel
    function updateHistoryPanel() {
        historyList.innerHTML = "";
        history.slice().reverse().forEach((item, index) => {
            const historyItem = document.createElement("div");
            historyItem.className = "history-item";
            historyItem.innerHTML = `${item.expression} = ${item.result}`;
            historyItem.addEventListener("click", () => {
                expression = item.result.toString();
                display.value = expression;
                expressionDisplay.textContent = item.expression;
            });
            historyList.appendChild(historyItem);
        });
    }

    // Format number for display
    function formatNumber(num) {
        if (typeof num === "number") {
            if (Math.abs(num) < 1e-10) return "0";
            if (Math.abs(num) > 1e10) return num.toExponential(5);
            return Number(num.toPrecision(10)).toString();
        }
        return num;
    }

    // Add to history
    function addToHistory(expr, res) {
        history.push({ expression: expr, result: res });
        if (history.length > 50) history.shift(); // Keep only last 50 calculations
        localStorage.setItem("calcHistory", JSON.stringify(history));
        updateHistoryPanel();
    }

    // Convert angle based on mode
    function convertAngle(angle) {
        return isDegrees ? (angle * Math.PI) / 180 : angle;
    }

    // Handle keyboard input
    document.addEventListener("keydown", function(e) {
        const key = e.key;
        if (/[0-9\.\+\-\*\/\(\)\%]/.test(key)) {
            e.preventDefault();
            handleInput(key);
        } else if (key === "Enter") {
            e.preventDefault();
            calculate();
        } else if (key === "Backspace") {
            e.preventDefault();
            if (expression.length > 0) {
                expression = expression.slice(0, -1);
                display.value = expression;
            }
        } else if (key === "Escape") {
            e.preventDefault();
            clearAll();
        }
    });

    // Handle input
    function handleInput(value) {
        if (value === "=" || value === "Enter") {
            calculate();
            return;
        }

        if (value === "AC") {
            clearAll();
            return;
        }

        if (value === "DEL") {
            if (expression.length > 0) {
                expression = expression.slice(0, -1);
                display.value = expression;
            }
            return;
        }

        // Handle scientific functions
        if (["sin", "cos", "tan", "log", "sqrt"].includes(value)) {
            expression += value + "(";
        } else if (value === "pi") {
            expression += "π";
        } else if (value === "e") {
            expression += "e";
        } else if (value === "pow") {
            expression += "^";
        } else {
            expression += value;
        }

        display.value = expression;
    }

    // Calculate result
    function calculate() {
        if (!expression) return;

        let originalExpression = expression;
        try {
            // Replace mathematical symbols with their JavaScript equivalents
            let calculableExp = expression
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
                .replace(/−/g, "-")
                .replace(/π/g, "Math.PI")
                .replace(/e/g, "Math.E")
                .replace(/\^/g, "**")
                .replace(/sin\(([^)]+)\)/g, `Math.sin(${isDegrees ? "convertAngle(" : ""}$1${isDegrees ? ")" : ""})`)
                .replace(/cos\(([^)]+)\)/g, `Math.cos(${isDegrees ? "convertAngle(" : ""}$1${isDegrees ? ")" : ""})`)
                .replace(/tan\(([^)]+)\)/g, `Math.tan(${isDegrees ? "convertAngle(" : ""}$1${isDegrees ? ")" : ""})`)
                .replace(/log\(([^)]+)\)/g, "Math.log10($1)")
                .replace(/sqrt\(([^)]+)\)/g, "Math.sqrt($1)");

            let result = eval(calculableExp);
            
            // Format and display result
            result = formatNumber(result);
            expressionDisplay.textContent = originalExpression;
            display.value = result;
            addToHistory(originalExpression, result);
            lastResult = result;
            expression = result.toString();
        } catch (error) {
            display.value = "Error";
            expression = "";
        }
    }

    // Clear all
    function clearAll() {
        expression = "";
        display.value = "";
        expressionDisplay.textContent = "";
    }

    // Event listeners
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const value = button.textContent;
            if (button.classList.contains("sci-btn")) {
                handleInput(button.dataset.sci);
            } else if (!["DEG", "RAD"].includes(value) && value !== "⌫") {
                handleInput(value);
            }
        });
    });

    historyBtn.addEventListener("click", () => {
        document.querySelector(".calculator").classList.toggle("show-history");
    });

    clearHistoryBtn.addEventListener("click", () => {
        history = [];
        localStorage.removeItem("calcHistory");
        updateHistoryPanel();
    });

    toggleButton.addEventListener("click", () => {
        isScientific = !isScientific;
        scientificButtons.style.display = isScientific ? "block" : "none";
        toggleButton.innerHTML = isScientific ? 
            '<i class="fas fa-calculator"></i>' : 
            '<i class="fas fa-calculator"></i>';
    });

    degRadBtn.addEventListener("click", () => {
        isDegrees = !isDegrees;
        degRadBtn.textContent = isDegrees ? "DEG" : "RAD";
    });

    // Initialize history panel
    updateHistoryPanel();
});

