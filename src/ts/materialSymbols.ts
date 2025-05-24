import cssText from "../css/material-symbols.css?raw";

const style = document.createElement("style");
style.textContent = cssText;
document.head.appendChild(style);

export {};
