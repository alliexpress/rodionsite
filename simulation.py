import numpy as np
import matplotlib.pyplot as plt

def simulate_transistor(mobility, gate_voltage, temperature, doping):
    voltage = np.linspace(0, 5, 100)
    current = mobility * (gate_voltage - voltage) / (1 + np.exp((voltage - doping) / temperature))
    return voltage, current

def plot_iv_curve(voltage, current):
    plt.figure()
    plt.plot(voltage, current)
    plt.title("I-V Characteristics")
    plt.xlabel("Voltage (V)")
    plt.ylabel("Current (A)")
    plt.grid(True)
    plt.savefig("/tmp/iv_curve.png")
    return "/tmp/iv_curve.png"