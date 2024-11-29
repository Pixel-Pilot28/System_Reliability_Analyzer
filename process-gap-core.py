from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List, Dict, Optional, Tuple
import numpy as np
import pandas as pd
from enum import Enum
import datetime

# Core Data Structures
class FactorType(Enum):
    HUMAN = "human"
    MACHINE = "machine"
    ENVIRONMENTAL = "environmental"

@dataclass
class Vulnerability:
    id: str
    factor_type: FactorType
    probability: float
    description: str
    severity: float  # 0-1 scale
    location: Tuple[float, float]  # Position in the Swiss cheese layer (x, y)
    
@dataclass
class Layer:
    id: str
    name: str
    vulnerabilities: List[Vulnerability]
    weight: float  # Layer importance in overall system

class SystemState:
    """Represents the current state of the entire system"""
    def __init__(self):
        self.timestamp = datetime.datetime.now()
        self.sensor_data = {}
        self.active_vulnerabilities = []
        self.current_risk_score = 0.0

# Abstract base classes for modular components
class HumanReliabilityAnalyzer(ABC):
    @abstractmethod
    def analyze(self, sensor_data: Dict) -> List[Vulnerability]:
        """Analyze human reliability factors and return vulnerabilities"""
        pass

class FailurePropagationAnalyzer(ABC):
    @abstractmethod
    def analyze_propagation(self, vulnerabilities: List[Vulnerability]) -> List[List[Vulnerability]]:
        """Identify potential failure propagation paths"""
        pass

class ErgonomicAnalyzer(ABC):
    @abstractmethod
    def analyze_ergonomics(self, sensor_data: Dict) -> List[Vulnerability]:
        """Analyze ergonomic factors and return vulnerabilities"""
        pass

# Concrete implementation of HRA using THERP method
class THERPAnalyzer(HumanReliabilityAnalyzer):
    def __init__(self, therp_database: Dict):
        self.therp_database = therp_database
        
    def analyze(self, sensor_data: Dict) -> List[Vulnerability]:
        vulnerabilities = []
        
        # Example analysis using THERP
        for task, data in sensor_data.items():
            if 'operator_fatigue' in data:
                base_error_prob = self.therp_database.get(task, 0.001)
                adjusted_prob = base_error_prob * (1 + data['operator_fatigue'])
                
                vuln = Vulnerability(
                    id=f"HRA_{task}",
                    factor_type=FactorType.HUMAN,
                    probability=adjusted_prob,
                    description=f"Human error in {task}",
                    severity=0.7,
                    location=(np.random.random(), np.random.random())
                )
                vulnerabilities.append(vuln)
                
        return vulnerabilities

# Main Process Gap System
class ProcessGapSystem:
    def __init__(self):
        self.layers: List[Layer] = []
        self.system_state = SystemState()
        self.hra_analyzer: Optional[HumanReliabilityAnalyzer] = None
        self.failure_analyzer: Optional[FailurePropagationAnalyzer] = None
        self.ergonomic_analyzer: Optional[ErgonomicAnalyzer] = None
        
    def add_layer(self, layer: Layer):
        self.layers.append(layer)
        
    def set_analyzers(self, hra: HumanReliabilityAnalyzer, 
                    failure: FailurePropagationAnalyzer,
                    ergonomic: ErgonomicAnalyzer):
        self.hra_analyzer = hra
        self.failure_analyzer = failure
        self.ergonomic_analyzer = ergonomic
        
    def update_system_state(self, sensor_data: Dict):
        """Update system state with new sensor data"""
        self.system_state.timestamp = datetime.datetime.now()
        self.system_state.sensor_data.update(sensor_data)
        
        # Run analysis pipeline
        human_vulns = self.hra_analyzer.analyze(sensor_data)
        ergo_vulns = self.ergonomic_analyzer.analyze_ergonomics(sensor_data)
        
        # Combine vulnerabilities
        all_vulns = human_vulns + ergo_vulns
        
        # Analyze failure propagation
        propagation_paths = self.failure_analyzer.analyze_propagation(all_vulns)
        
        # Update system state
        self.system_state.active_vulnerabilities = all_vulns
        self.system_state.current_risk_score = self._calculate_risk_score(propagation_paths)
        
    def _calculate_risk_score(self, propagation_paths: List[List[Vulnerability]]) -> float:
        """Calculate overall system risk score based on vulnerability paths"""
        if not propagation_paths:
            return 0.0
            
        # Calculate risk score based on highest probability path
        max_path_risk = 0.0
        for path in propagation_paths:
            path_prob = np.prod([v.probability for v in path])
            path_severity = np.mean([v.severity for v in path])
            path_risk = path_prob * path_severity
            max_path_risk = max(max_path_risk, path_risk)
            
        return max_path_risk

    def get_risk_report(self) -> Dict:
        """Generate a summary report of current system risks"""
        return {
            'timestamp': self.system_state.timestamp,
            'risk_score': self.system_state.current_risk_score,
            'active_vulnerabilities': len(self.system_state.active_vulnerabilities),
            'highest_risk_vulnerabilities': sorted(
                self.system_state.active_vulnerabilities,
                key=lambda x: x.probability * x.severity,
                reverse=True
            )[:5]
        }

# Example usage
if __name__ == "__main__":
    # Initialize system
    system = ProcessGapSystem()
    
    # Create sample THERP database
    therp_db = {
        'control_panel_operation': 0.001,
        'emergency_response': 0.003,
        'routine_maintenance': 0.002
    }
    
    # Example sensor data
    sensor_data = {
        'control_panel_operation': {
            'operator_fatigue': 0.3,
            'temperature': 25.5,
            'noise_level': 65
        }
    }
    
    # Initialize and set analyzers (implementations needed)
    hra = THERPAnalyzer(therp_db)
    # Add other analyzer implementations
    
    # Update system state
    system.update_system_state(sensor_data)
    
    # Get risk report
    report = system.get_risk_report()