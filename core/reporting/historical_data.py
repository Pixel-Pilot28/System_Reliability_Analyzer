# historical_data.py
import json
from vulnerability import Vulnerability

class HistoricalData:
    def __init__(self, filepath: str):
        with open(filepath, 'r') as file:
            self.data = json.load(file)

    def refine_probabilities(self, vulnerabilities: List[Vulnerability]) -> List[Vulnerability]:
        # Adjust probabilities using historical error rates
        for vuln in vulnerabilities:
            history = self.data.get(vuln.id)
            if history:
                vuln.probability = max(vuln.probability, history['errorRate'])
        return vulnerabilities
