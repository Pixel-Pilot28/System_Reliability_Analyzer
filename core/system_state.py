# system_state.py
from datetime import datetime
from typing import Dict

class SystemState:
    def __init__(self):
        self.timestamp = datetime.now()
        self.sensor_data = {}
        self.active_vulnerabilities = []
        self.current_risk_score = 0.0

    def update(self, sensor_data: Dict):
        self.timestamp = datetime.now()
        self.sensor_data.update(sensor_data)
