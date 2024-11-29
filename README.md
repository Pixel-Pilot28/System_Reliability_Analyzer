### **Process Gap: A System-Wide Error Propagation and Reliability Analysis Tool**

---
![](https://github.com/Pixel-Pilot28/System_Reliability_Analyzer/blob/main/Overview.gif)

## **Overview**

### **What is Process Gap?**
**Process Gap** is an advanced tool for modeling and analyzing process vulnerabilities using error propagation and risk modeling. This model visualizes system failures as pathways through multiple layers of defenses, where weaknesses (or "holes") in each layer align to allow potential failures to propagate. Process Gap combines interactive visualization, real-time data feeds, and dynamic error propagation analysis to provide actionable insights for improving system reliability.

### **Key Features**
- **Interactive Visualization**: Visualize process flows, identify vulnerabilities, and edit workflows dynamically.
- **Node Editing**: You can edit system elements (nodes) in real-time, adjusting error rates, connected variables, and associated data.
- **Error Propagation Analysis**: Analyze how failures propagate through the workflow and calculate cumulative risks.
- **Live Data Integration**: Monitor real-time system states, biometric data, software and hardware metrics, and consolidated risk levels.
- **Tab-Based Dashboard**: Navigate seamlessly between views for system visualization, risk analysis, and live feeds.

### **Applications**
- **Healthcare**: Model patient flow and identify bottlenecks or risks in medical processes, such as diagnostic errors or medication administration issues.
- **Aviation**: Analyze and mitigate risks in air traffic management or flight operations.
- **Manufacturing**: Monitor production workflows to detect inefficiencies and reduce errors.
- **Human-Systems Integration**: Evaluate the interplay of humans, machines, and environments to enhance system reliability.

### **Advantages**
- **Visualization and Interactivity**: Traditional tools lack the intuitive, dynamic interface Process Gap provides.
- **Real-Time Insights**: Consolidated live data and risk calculations empower proactive decision-making.
- **Customizability**: Edit nodes and connections to model specific workflows and scenarios.
- **Holistic Analysis**: Combines human, machine, and environmental factors for comprehensive vulnerability assessment.

### **Future Additions**
- **Enhanced AI Analysis**: Integrate AI models for automated risk detection and prediction.
- **Team Collaboration**: Enable multi-user support for collaborative modeling.
- **Historical Data Integration**: Use historical incident data to refine risk models and improve predictions.
- **Custom Reporting**: Generate tailored risk reports for specific industries or use cases.

---

## **Software Overview**

### **How Does Process Gap Work?**
The tool follows a modular architecture to seamlessly integrate back-end data processing and front-end visualization.

#### **Workflow**
1. **Load Data**: The back-end processes workflow data (e.g., nodes and connections) from a JSON file.
2. **Visualization**: The front end dynamically renders nodes and connections, allowing users to interact with and edit the model.
3. **Analysis**: Real-time data feeds and error propagation algorithms calculate and display risk levels.
4. **Live Monitoring**: A dedicated "Live Feed" tab monitors and visualizes system states, biometric metrics, and hardware/software utilization.

---

### **File Structure**
The codebase is structured to maintain modularity and scalability. Below is an overview of the directory structure:

```
process-gap/
│
├── core/
│   ├── main.py                  # FastAPI server setup, API routes, and data handling
│   ├── live_data.py             # Script to generate mock live data for the Live Feed tab
│   ├── system_state.py          # Core logic for monitoring system states
│   ├── vulnerability.py         # Functions for error propagation and vulnerability analysis
│   ├── analyzer/
│   │   ├── human_reliability.py # Models human error rates and workload factors
│   │   ├── failure_propagation.py # Calculates error propagation through connections
│   │   └── ergonomic_analysis.py # Models human-system interaction factors
│   └── reporting/
│       ├── automated_report.py  # Generates risk reports based on system data
│       └── historical_data.py   # Processes historical data for analysis (future feature)
│
├── ui/
│   ├── process-gap-ui/          # Front-end React application
│   │   ├── src/
│   │   │   ├── App.tsx          # Main React component, managing tabs and routing
│   │   │   ├── dashboard.tsx    # Dashboard component displaying system-level summaries
│   │   │   ├── data_view.tsx    # Visualizes the workflow with nodes and edges
│   │   │   ├── node_editor.tsx  # Interactive editor for node properties
│   │   │   ├── analytics.tsx    # Displays risk analysis and error propagation results
│   │   │   ├── live_feed.tsx    # Displays real-time data feeds
│   │   │   └── styles.css       # Styling for the front-end UI
│   │   ├── public/
│   │   └── build/               # Compiled React application
│   └── static/                  # Static assets like images, icons, etc.
│
├── tests/                       # Unit tests for back-end and front-end components
├── requirements.txt             # Python dependencies
├── package.json                 # JavaScript dependencies
├── README.md                    # Project documentation
└── medication-failure-tree.json # Sample JSON file for node and connection data
```

---

### **Key Components**
#### **1. Back-End**
- **Framework**: FastAPI
  - Handles API routes for data retrieval (`/api/failure-tree`) and updates.
  - Serves the front-end React application.
- **Live Data**: `live_data.py`
  - Generates randomized mock data for system states, biometrics, and hardware/software utilization.
- **Error Propagation**: `failure_propagation.py`
  - Calculates cumulative error rates and highlights high-risk pathways in the model.

#### **2. Front-End**
- **Framework**: React with Material UI
  - Provides a clean, intuitive interface with tab-based navigation.
- **Tabs**:
  - **Dashboard**: Displays system-level summaries and key metrics.
  - **DataView**: Interactive visualization of the workflow (nodes and connections).
  - **Node Editor**: Allows editing of node properties and updates the model in real time.
  - **Risk Report**: Summarizes vulnerabilities and error propagation pathways.
  - **Live Feed**: Monitors real-time system data and calculates current risk.

#### **3. Data Pipeline**
- **Input**: Workflow data in JSON format (`medication-failure-tree.json`).
- **Processing**:
  - Nodes and connections are loaded into memory and served via API.
  - Edits and updates are processed in real-time and persisted to the JSON file.
- **Output**:
  - Real-time visualizations in the front end.
  - Consolidated risk metrics and live feed monitoring.

---

### **Languages and Technologies**
- **Back-End**: Python (FastAPI, Uvicorn)
- **Front-End**: TypeScript (React, Material UI)
- **Data Storage**: JSON for workflow and node data
- **Visualization**: React Flow for node/edge rendering

---

### **How to Get Started**
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/process-gap.git
   cd process-gap
   ```

2. **Install Dependencies**:
   - Back-End:
     ```bash
     pip install -r requirements.txt
     ```
   - Front-End:
     ```bash
     cd ui/process-gap-ui
     npm install
     ```

3. **Run the Application**:
   - Start the back-end server:
     ```bash
     uvicorn main:app --reload
     ```
   - Start the front-end:
     ```bash
     npm start
     ```

4. **Access the Tool**:
   Open your browser and navigate to `http://127.0.0.1:8000`.

---

With these features and capabilities, **Process Gap** serves as a robust tool for identifying and addressing process vulnerabilities in complex systems. For any questions or contributions, feel free to open an issue or submit a pull request!
