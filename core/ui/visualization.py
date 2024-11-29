# visualization.py
import matplotlib.pyplot as plt
from vulnerability import Vulnerability

class Visualization:
    def __init__(self, layers):
        self.layers = layers

    def show_pathways(self):
        fig, ax = plt.subplots()
        for layer in self.layers:
            for vuln in layer.vulnerabilities:
                ax.plot(vuln.location[0], vuln.location[1], 'ro' if vuln.probability > 0.5 else 'bo')
        
        # Highlight pathways where vulnerabilities align
        self._highlight_failure_paths(ax)
        plt.show()

    def _highlight_failure_paths(self, ax):
        # Logic to detect and highlight aligned "holes"
        # Placeholder function; actual logic needed to identify propagation paths
        pass
