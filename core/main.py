import sys
import os
# Add the project root to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

import json
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import Dict

# Local imports
from core.routes import probabilistic, edges
import live_data

# Global variables
nodes = []
connections = []
file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "medication-failure-tree.json"))
print(f"Looking for JSON file at: {file_path}")  # Debug print
assert os.path.exists(file_path), f"JSON file path is invalid! Path: {file_path}"

async def lifespan(app: FastAPI):
    """Lifespan function to manage startup and shutdown events."""
    load_initial_data()
    yield

def load_initial_data():
    """Load initial data from the JSON file and debug with number of nodes and connections."""
    global nodes, connections
    if os.path.exists(file_path):
        with open(file_path, "r+") as file:
            data = json.load(file)
            # Ensure all nodes have positions
            for i, node in enumerate(data["nodes"]):
                if "position" not in node:
                    node["position"] = {
                        "x": 100 + (i % 3) * 300,  # Grid layout: 3 columns
                        "y": 100 + (i // 3) * 200   # 200px vertical spacing
                    }
            # Write back the updated data with positions
            file.seek(0)
            json.dump(data, file, indent=2)
            file.truncate()
            
            nodes[:] = data.get("nodes", [])
            connections[:] = data.get("connections", [])
            print(f"Loaded {len(nodes)} nodes and {len(connections)} connections.")
            print("Node positions:", [(node["id"], node["position"]) for node in nodes])
    else:
        print(f"File not found: {file_path}")
        nodes.clear()
        connections.clear()

# Initialize FastAPI with CORS and Static Files
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

static_files_path = os.path.join(os.path.dirname(__file__), "ui/process-gap-ui/build/static")
index_html_path = os.path.join(os.path.dirname(__file__), "ui/process-gap-ui/build/index.html")

app.mount("/static", StaticFiles(directory=static_files_path), name="static")

app.include_router(probabilistic.router, prefix="/api")
app.include_router(edges.router, prefix="/api")

@app.get("/")
async def serve_ui():
    return FileResponse(index_html_path)

@app.get("/api/failure-tree")
async def get_failure_tree():
    return {"nodes": nodes, "connections": connections}

@app.post("/api/nodes")
async def create_node(node_data: Dict = Body(...)):
    """Create a new node"""
    global nodes
    try:
        # Add the node to the in-memory list
        nodes.append(node_data)

        # Update the file
        with open(file_path, "r+") as file:
            data = json.load(file)
            data["nodes"].append(node_data)
            file.seek(0)
            json.dump(data, file, indent=2)
            file.truncate()

        return {"success": True, "node": node_data}
    except Exception as e:
        print(f"Error creating node: {str(e)}")
        return {"success": False, "error": str(e)}

@app.get("/api/nodes")
async def get_nodes():
    """API endpoint to fetch nodes."""
    return nodes

@app.get("/api/connections")
async def get_connections():
    """API endpoint to fetch connections."""
    return connections

@app.get("/api/live-feed")
def get_live_feed():
    return live_data.generate_live_data()

from fastapi import Body
from typing import Dict

@app.post("/api/nodes/{node_id}")
async def update_node(node_id: str, node_data: Dict = Body(...)):
    """Update node data and persist to file"""
    global nodes
    try:
        # Update node in memory first
        node_found = False
        for node in nodes:
            if node["id"] == node_id:
                node.update(node_data)
                node_found = True
                break

        if not node_found:
            return {"success": False, "error": f"Node {node_id} not found"}

        # Update the file
        with open(file_path, "r+") as file:
            data = json.load(file)
            for node in data["nodes"]:
                if node["id"] == node_id:
                    node.update(node_data)
                    break
            file.seek(0)
            json.dump(data, file, indent=2)
            file.truncate()

        return {"success": True, "node": node_data}
    except Exception as e:
        print(f"Error updating node: {str(e)}")
        return {"success": False, "error": str(e)}

@app.post("/api/nodes/{node_id}/position")
async def update_node_position(node_id: str, position: Dict[str, float] = Body(...)):
    """Update node position and persist to file"""
    global nodes
    
    try:
        # Validate position data
        if not all(k in position for k in ['x', 'y']):
            return {"success": False, "error": "Invalid position data"}

        # Update node data in memory
        node_found = False
        updated_node = None
        for node in nodes:
            if node["id"] == node_id:
                node["position"] = {
                    "x": float(position["x"]),
                    "y": float(position["y"])
                }
                node_found = True
                updated_node = node
                break

        if not node_found:
            return {"success": False, "error": f"Node {node_id} not found"}

        # Update the file
        with open(file_path, "r+") as file:
            data = json.load(file)
            for node in data["nodes"]:
                if node["id"] == node_id:
                    node["position"] = position
                    break
            file.seek(0)
            json.dump(data, file, indent=2)
            file.truncate()
            print(f"Saved position for node {node_id}: {position}")

        return {"success": True, "position": position}
    except Exception as e:
        print(f"Error updating node position: {str(e)}")
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)
