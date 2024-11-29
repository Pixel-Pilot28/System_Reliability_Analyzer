from typing import Dict
from core.system_state import SystemState

class Controls:
    def __init__(self, system_state: SystemState):
        self.system_state = system_state

    def adjust_sensor_data(self, updates: Dict):
        self.system_state.update(updates)

