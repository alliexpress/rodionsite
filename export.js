import { components, simulations, pyodidePromise } from './main.js';

function saveSimulation() {
  if (simulations.length > 0) document.getElementById("comparison").classList.remove("hidden");
}

function toggleComparison() {
  const comparisonDiv = document.getElementById("comparison"), comparisonOutput = document.getElementById("comparisonOutput");
  if (simulations.length < 2 && !comparisonDiv.classList.contains("hidden")) {
    document.getElementById("error").textContent = "Нужно минимум 2 симуляции!";
    document.getElementById("error").classList.remove("hidden");
    return;
  }
  comparisonDiv.classList.toggle("hidden");
  if (!comparisonDiv.classList.contains("hidden")) comparisonOutput.innerHTML = simulations.map((sim, i) => `<div class="mb-4 bg-opacity-20 p-4 rounded-lg" style="background: var(--card-bg);"><h3 class="text-xl font-semibold">Симуляция ${i + 1}</h3><p>КПД: ${sim.efficiency.toFixed(2)}</p><p>Subthreshold Slope: ${sim.subthreshold_slope.toFixed(2)} decade/V</p><p>Frequency Response: ${sim.freq_response.toFixed(2)} GHz</p><img src="data:image/png;base64,${sim.img_base64}" style="max-width: 100%;" /></div>`).join("");
}

function exportData() {
  const csv_data = localStorage.getItem("transistor_csv");
  if (!csv_data) {
    document.getElementById("error").textContent = "Сначала выполните симуляцию!";
    document.getElementById("error").classList.remove("hidden");
    return;
  }
  const blob = new Blob([csv_data], { type: "text/csv" }), url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url;
  a.download = "transistor_data.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function exportGDSII() {
  const gdsii_data = localStorage.getItem("transistor_gdsii");
  if (!gdsii_data) {
    document.getElementById("error").textContent = "Сначала выполните симуляцию!";
    document.getElementById("error").classList.remove("hidden");
    return;
  }
  const blob = new Blob([gdsii_data], { type: "application/json" }), url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url;
  a.download = "transistor_gdsii.json";
  a.click();
  URL.revokeObjectURL(url);
}

async function exportPDF() {
  const pyodide = await pyodidePromise;
  const errorDiv = document.getElementById("error");
  errorDiv.classList.add("hidden");
  const lastSim = simulations[simulations.length - 1];
  if (!lastSim) {
    errorDiv.textContent = "Сначала выполните симуляцию!";
    errorDiv.classList.remove("hidden");
    return;
  }
  const mobility = parseFloat(document.getElementById("mobility").value) || 1000, gateVoltage = parseFloat(document.getElementById("gateVoltage").value) || 1.5, doping = parseFloat(document.getElementById("doping").value) || 1e12, temperature = parseFloat(document.getElementById("temperature").value) || 300, defects = parseFloat(document.getElementById("defects").value) || 1e10, substrate = document.getElementById("substrate").value, pythonCode = `
import matplotlib.pyplot as plt
import numpy as np
from io import BytesIO
import base64
voltages = np.array(${JSON.stringify(lastSim.voltages)})
currents = np.array(${JSON.stringify(lastSim.currents)})
materials = [${components.filter(c => c.type === "2D-Layer").map(c => "\"" + c.material + "\"").join(",")}]
thicknesses = [${components.filter(c => c.type === "2D-Layer").map(c => c.thickness).join(",")}]
mobility = ${mobility}
gate_voltage = ${gateVoltage}
doping = ${doping}
temperature = ${temperature}
defects = ${defects}
substrate = "${substrate}"
efficiency = ${lastSim.efficiency}
subthreshold_slope = ${lastSim.subthreshold_slope}
freq_response = ${lastSim.freq_response}
fig = plt.figure(figsize=(10, 12))
ax1 = plt.subplot(321)
ax1.set_xlim(-2, 2)
ax1.set_ylim(-1.5, 2)
ax1.set_aspect('equal')
${components.map(c => `ax1.add_patch(plt.Rectangle((${c.x / 100 - 1},${c.y / 100 - 0.5}),${c.width / 100},${c.height / 100},color="${c.color}",label="${c.material ? c.type + " (" + c.material + ")" : c.type}"))`).join("\n")}
ax1.set_title('Схема транзистора')
ax1.legend()
ax1.set_xlabel('X')
ax1.set_ylabel('Y')
ax2 = plt.subplot(322)
ax2.plot(voltages, currents, 'b-', label='I_ds')
ax2.set_title(f'ВАХ (КПД: {efficiency:.2f})')
ax2.set_xlabel('V_ds (В)')
ax2.set_ylabel('I_ds (мкА)')
ax2.grid(True)
ax2.legend()
ax3 = plt.subplot(323)
X, Y = np.meshgrid(np.linspace(-1, 1, 20), np.linspace(-0.5, 0.5, 20))
Z = np.exp(-(X ** 2 + Y ** 2) / (0.5 + ${doping} * 1e-12))
c = ax3.contourf(X, Y, Z, cmap='viridis')
plt.colorbar(c, ax=ax3)
ax3.set_title('Карта зарядов')
ax3.set_xlabel('X')
ax3.set_ylabel('Y')
ax4 = plt.subplot(324)
ax4.plot(voltages, currents * np.sin(2 * np.pi * voltages / np.max(voltages)), 'r-', label='Транспорт электронов')
ax4.set_title('Динамика транспорта (упрощённая)')
ax4.set_xlabel('V_ds (В)')
ax4.set_ylabel('Модулированный ток (мкА)')
ax4.grid(True)
ax4.legend()
plt.tight_layout()
buf = BytesIO()
plt.savefig(buf, format='png')
buf.seek(0)
img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
plt.close()
img_base64
  `;
  try {
    const img_base64 = await pyodide.runPythonAsync(pythonCode);
    const blob = new Blob([atob(img_base64)], { type: "image/png" }), url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url;
    a.download = "transistor_simulation.png";
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    errorDiv.textContent = "Ошибка экспорта PDF: " + err.message;
    errorDiv.classList.remove("hidden");
  }
}

export { saveSimulation, toggleComparison, exportData, exportGDSII, exportPDF };