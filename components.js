import { components, selectedComponent, contextMenuTarget, contextMenu, drawCanvas } from './main.js';
import { previewParameters } from './simulation.js';

function addComponent() {
  const type = document.getElementById("component").value, material = document.getElementById("material").value, thickness = parseFloat(document.getElementById("thickness").value) || 0.7;
  let width, height, color;
  if (type === "2D-Layer") {
    width = 300; height = 60; color = material === "Graphene" ? "#999" : material === "MoS2" ? "#2ecc71" : material === "BN" ? "#00d4ff" : "#9b59b6";
  } else if (type === "Source" || type === "Drain") {
    width = height = 40; color = "#bdc3c7";
  } else {
    width = 300; height = 30; color = "#f1c40f";
  }
  components.push({ type, x: 50, y: 50, width, height, color, material: type === "2D-Layer" ? material : null, thickness: type === "2D-Layer" ? thickness : null, scale: 1, rotation: 0 });
  selectedComponent = components[components.length - 1];
  drawCanvas();
}

function removeComponent() {
  if (contextMenuTarget) {
    components = components.filter(c => c !== contextMenuTarget);
    contextMenuTarget = null;
    contextMenu.style.display = "none";
    drawCanvas();
  }
}

function duplicateComponent() {
  if (contextMenuTarget) {
    const newComp = { ...contextMenuTarget, x: contextMenuTarget.x + 20, y: contextMenuTarget.y + 20 };
    components.push(newComp);
    contextMenuTarget = null;
    contextMenu.style.display = "none";
    drawCanvas();
  }
}

function editProperties() {
  if (contextMenuTarget) {
    const newWidth = prompt("Новая ширина:", contextMenuTarget.width);
    const newHeight = prompt("Новая высота:", contextMenuTarget.height);
    const newMaterial = contextMenuTarget.type === "2D-Layer" ? prompt("Новый материал (Graphene, MoS2, BN, WSe2):", contextMenuTarget.material || "Graphene") : null;
    const newThickness = contextMenuTarget.type === "2D-Layer" ? prompt("Новая толщина (нм):", contextMenuTarget.thickness || 0.7) : null;

    if (newWidth !== null) contextMenuTarget.width = parseFloat(newWidth) || contextMenuTarget.width;
    if (newHeight !== null) contextMenuTarget.height = parseFloat(newHeight) || contextMenuTarget.height;
    if (newMaterial !== null && contextMenuTarget.type === "2D-Layer") {
      contextMenuTarget.material = ["Graphene", "MoS2", "BN", "WSe2"].includes(newMaterial) ? newMaterial : contextMenuTarget.material;
      contextMenuTarget.color = contextMenuTarget.material === "Graphene" ? "#999" : contextMenuTarget.material === "MoS2" ? "#2ecc71" : contextMenuTarget.material === "BN" ? "#00d4ff" : "#9b59b6";
    }
    if (newThickness !== null && contextMenuTarget.type === "2D-Layer") contextMenuTarget.thickness = parseFloat(newThickness) || contextMenuTarget.thickness;

    contextMenuTarget = null;
    contextMenu.style.display = "none";
    drawCanvas();
  }
}

function loadExample() {
  const example = document.getElementById("example").value;
  components.length = 0;
  if (example === "graphene") {
    components.push(
      { type: "2D-Layer", x: 50, y: 50, width: 300, height: 60, color: "#999", material: "Graphene", thickness: 0.7, scale: 1, rotation: 0 },
      { type: "Source", x: 20, y: 80, width: 40, height: 40, color: "#bdc3c7", scale: 1, rotation: 0 },
      { type: "Drain", x: 340, y: 80, width: 40, height: 40, color: "#bdc3c7", scale: 1, rotation: 0 },
      { type: "Gate", x: 50, y: 20, width: 300, height: 30, color: "#f1c40f", scale: 1, rotation: 0 }
    );
    document.getElementById("material").value = "Graphene";
    document.getElementById("thickness").value = "0.7";
    document.getElementById("substrate").value = "SiO2";
    document.getElementById("mobility").value = "10000";
    document.getElementById("gateVoltage").value = "1.0";
    document.getElementById("doping").value = "1e12";
    document.getElementById("temperature").value = "300";
    document.getElementById("defects").value = "1e10";
  } else if (example === "mos2") {
    components.push(
      { type: "2D-Layer", x: 50, y: 50, width: 250, height: 50, color: "#2ecc71", material: "MoS2", thickness: 0.65, scale: 1, rotation: 10 },
      { type: "Source", x: 30, y: 90, width: 50, height: 50, color: "#bdc3c7", scale: 1, rotation: 0 },
      { type: "Drain", x: 300, y: 90, width: 50, height: 50, color: "#bdc3c7", scale: 1, rotation: 0 },
      { type: "Gate", x: 50, y: 10, width: 250, height: 25, color: "#f1c40f", scale: 1, rotation: 10 }
    );
    document.getElementById("material").value = "MoS2";
    document.getElementById("thickness").value = "0.65";
    document.getElementById("substrate").value = "Al2O3";
    document.getElementById("mobility").value = "200";
    document.getElementById("gateVoltage").value = "1.5";
    document.getElementById("doping").value = "5e11";
    document.getElementById("temperature").value = "250";
    document.getElementById("defects").value = "5e9";
  } else if (example === "hybrid") {
    components.push(
      { type: "2D-Layer", x: 50, y: 50, width: 280, height: 55, color: "#999", material: "Graphene", thickness: 0.7, scale: 1, rotation: 0 },
      { type: "2D-Layer", x: 50, y: 105, width: 280, height: 55, color: "#2ecc71", material: "MoS2", thickness: 0.65, scale: 1, rotation: 0 },
      { type: "Source", x: 25, y: 140, width: 45, height: 45, color: "#bdc3c7", scale: 1, rotation: 0 },
      { type: "Drain", x: 325, y: 140, width: 45, height: 45, color: "#bdc3c7", scale: 1, rotation: 0 },
      { type: "Gate", x: 50, y: 20, width: 280, height: 30, color: "#f1c40f", scale: 1, rotation: 0 }
    );
    document.getElementById("material").value = "Graphene";
    document.getElementById("thickness").value = "0.7";
    document.getElementById("substrate").value = "SiO2";
    document.getElementById("mobility").value = "800";
    document.getElementById("gateVoltage").value = "1.2";
    document.getElementById("doping").value = "2e12";
    document.getElementById("temperature").value = "280";
    document.getElementById("defects").value = "2e10";
  } else if (example === "wse2") {
    components.push(
      { type: "2D-Layer", x: 60, y: 60, width: 260, height: 50, color: "#9b59b6", material: "WSe2", thickness: 0.7, scale: 1, rotation: 5 },
      { type: "Source", x: 40, y: 100, width: 50, height: 50, color: "#bdc3c7", scale: 1, rotation: 0 },
      { type: "Drain", x: 310, y: 100, width: 50, height: 50, color: "#bdc3c7", scale: 1, rotation: 0 },
      { type: "Gate", x: 60, y: 20, width: 260, height: 25, color: "#f1c40f", scale: 1, rotation: 5 }
    );
    document.getElementById("material").value = "WSe2";
    document.getElementById("thickness").value = "0.7";
    document.getElementById("substrate").value = "Al2O3";
    document.getElementById("mobility").value = "150";
    document.getElementById("gateVoltage").value = "1.8";
    document.getElementById("doping").value = "3e11";
    document.getElementById("temperature").value = "200";
    document.getElementById("defects").value = "1e9";
  } else if (example === "bn") {
    components.push(
      { type: "2D-Layer", x: 50, y: 50, width: 300, height: 60, color: "#00d4ff", material: "BN", thickness: 1.0, scale: 1, rotation: 0 },
      { type: "2D-Layer", x: 50, y: 110, width: 300, height: 60, color: "#999", material: "Graphene", thickness: 0.7, scale: 1, rotation: 0 },
      { type: "Source", x: 20, y: 150, width: 40, height: 40, color: "#bdc3c7", scale: 1, rotation: 0 },
      { type: "Drain", x: 340, y: 150, width: 40, height: 40, color: "#bdc3c7", scale: 1, rotation: 0 },
      { type: "Gate", x: 50, y: 20, width: 300, height: 30, color: "#f1c40f", scale: 1, rotation: 0 }
    );
    document.getElementById("material").value = "BN";
    document.getElementById("thickness").value = "1.0";
    document.getElementById("substrate").value = "SiO2";
    document.getElementById("mobility").value = "500";
    document.getElementById("gateVoltage").value = "2.0";
    document.getElementById("doping").value = "1e11";
    document.getElementById("temperature").value = "300";
    document.getElementById("defects").value = "5e10";
  }
  selectedComponent = null;
  previewParameters();
  drawCanvas();
}

export { addComponent, removeComponent, duplicateComponent, editProperties, loadExample };