# automated_report.py
from typing import List, Dict
from vulnerability import Vulnerability
from datetime import datetime

class AutomatedReport:
    def __init__(self, vulnerabilities: List[Vulnerability]):
        self.vulnerabilities = vulnerabilities

    def generate_report(self) -> Dict:
        top_vulnerabilities = sorted(
            self.vulnerabilities,
            key=lambda v: v.probability * v.severity,
            reverse=True
        )[:5]

        recommendations = self._generate_recommendations(top_vulnerabilities)
        
        return {
            'timestamp': datetime.now(),
            'top_vulnerabilities': top_vulnerabilities,
            'recommendations': recommendations
        }

    def _generate_recommendations(self, vulnerabilities: List[Vulnerability]) -> List[str]:
        recommendations = []
        for vuln in vulnerabilities:
            rec = (
                f"Increase training on {vuln.description}"
                if vuln.factor_type == "HUMAN" else
                f"Check system reliability for {vuln.description}"
            )
            recommendations.append(rec)
        return recommendations
