# main.py
from core.system_state import SystemState
from core.vulnerability import Layer, Vulnerability
from ui.controls import Controls
from reporting.automated_report import AutomatedReport
from reporting.historical_data import HistoricalData

def main():
    # Initialize system state
    system_state = SystemState()

    # Load vulnerabilities and layers
    layers = load_layers()

    # Initialize controls and allow for input adjustments
    controls = Controls(system_state)
    controls.adjust_sensor_data({'operator_fatigue': 0.3})

    # Apply historical data refinement
    historical = HistoricalData('medication-failure-tree.json')
    vulnerabilities = [vuln for layer in layers for vuln in layer.vulnerabilities]
    refined_vulnerabilities = historical.refine_probabilities(vulnerabilities)

    # Automated reporting
    report = AutomatedReport(refined_vulnerabilities)
    print(report.generate_report())

def load_layers():
    # Placeholder: Construct and load layers from JSON or other data source
    return []

if __name__ == "__main__":
    main()
