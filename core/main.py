from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import FastAPI
import live_data
import json
import os



# Global variables
nodes = []
connections = []
file_path = (r"C:\Users\JVanD\Programs_Code\Process_Gap\core\medication-failure-tree.json")
assert os.path.exists(file_path), "JSON file path is invalid!"

async def lifespan(app: FastAPI):
    """Lifespan function to manage startup and shutdown events."""
    load_initial_data()
    yield

def load_initial_data():
    """Load initial data from the JSON file and debug with number of nodes and connections."""
    global nodes, connections
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            data = json.load(file)
        nodes[:] = data.get("nodes", [])
        connections[:] = data.get("connections", [])
        print(f"Loaded {len(nodes)} nodes and {len(connections)} connections.")
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

app.mount("/static", StaticFiles(directory="C:/Users/JVanD/Programs_Code/Process_Gap/core/ui/process-gap-ui/build/static"), name="static")

@app.get("/")
async def serve_ui():
    return FileResponse("C:/Users/JVanD/Programs_Code/Process_Gap/core/ui/process-gap-ui/build/index.html")

@app.get("/api/failure-tree")
async def get_failure_tree():
    return {"nodes": nodes, "connections": connections}

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



# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from fastapi.responses import FileResponse
# from starlette.responses import RedirectResponse
# import json
# import os

# # Global variables
# nodes = []
# connections = []
# file_path =(r"C:\Users\JVanD\Programs_Code\Process_Gap\core\medication-failure-tree.json")

# async def lifespan(app: FastAPI):
#     """Lifespan function to manage startup and shutdown events."""
#     # Startup logic
#     load_initial_data()
#     yield  # Yield control back to the application
#     # Shutdown logic (if needed)
#     # Example: Close database connections

# def load_initial_data():
#     """Load initial data from the JSON file."""
#     global nodes, connections
#     if os.path.exists(file_path):
#         with open(file_path, "r") as file:
#             data = json.load(file)
#         nodes[:] = data.get("nodes", [])
#         connections[:] = data.get("connections", [])
#     else:
#         nodes.clear()
#         connections.clear()

# # Initialize FastAPI app with the lifespan function
# app = FastAPI(lifespan=lifespan)

# # Enable CORS for frontend communication
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Replace with frontend URL in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Serve static files from the React build folder
# app.mount("/static", StaticFiles(directory="ui/process-gap-ui/build/static"), name="static")

# @app.get("/")
# async def serve_ui():
#     return FileResponse("ui/process-gap-ui/build/index.html")

# @app.on_event("startup")
# def on_startup():
#     load_initial_data()

# @app.get("/api/failure-tree")
# def get_failure_tree():
#     """Get the failure tree data."""
#     return {"nodes": nodes, "connections": connections}

# @app.post("/api/nodes/{node_id}")
# def update_node(node_id: str, updated_node: dict):
#     """Update a specific node."""
#     for node in nodes:
#         if node["id"] == node_id:
#             node.update(updated_node)
#             return {"success": True, "updated_node": node}
#     raise HTTPException(status_code=404, detail="Node not found")

# @app.post("/api/save")
# def save_changes():
#     """Save changes to the JSON file."""
#     with open(file_path, "w") as file:
#         json.dump({"nodes": nodes, "connections": connections}, file, indent=4)
#     return {"success": True, "message": "Changes saved successfully"}

# # Mount the static directory
# app.mount("/static", StaticFiles(directory="static"), name="static")
# app.mount("/ui", StaticFiles(directory="ui"), name="ui")

# # Favicon route
# @app.get("/favicon.ico")
# async def favicon():
#     return RedirectResponse(url="/static/favicon.ico")

# @app.get("/")
# async def serve_ui():
#     return FileResponse("ui/dashboard.tsx")

# @app.get("/")
# async def serve_ui():
#     return FileResponse("core/ui/build/index.html")

# @app.get("/api/nodes")
# def get_nodes():
#     """Get all nodes."""
#     return {"nodes": nodes}

# @app.get("/api/connections")
# def get_connections():
#     """Get all connections."""
#     return {"connections": connections}

# @app.post("/api/nodes/{node_id}")
# def update_node(node_id: str, node_data: dict):
#     """Update a specific node."""
#     for node in nodes:
#         if node["id"] == node_id:
#             node.update(node_data)
#             break
#     return {"success": True, "updated_node": node_data}

# @app.get("/api/system-error")
# def calculate_system_error():
#     """Calculate the overall system error rate."""
#     if not nodes:
#         return {"system_error_rate": 0.0}

#     total_error = 0
#     for node in nodes:
#         connected_nodes = [
#             conn for conn in connections if conn["source"] == node["id"] or conn["target"] == node["id"]
#         ]
#         connection_factor = max(0.1, len(connected_nodes) * 0.2)
#         total_error += node["errorRate"] * connection_factor

#     system_error = total_error / len(nodes)
#     return {"system_error_rate": system_error}

# @app.get("/api/risk-report")
# def generate_risk_report():
#     """Generate a risk report based on current nodes."""
#     vulnerabilities = [
#         {
#             "id": node["id"],
#             "type": node["type"],
#             "probability": node["errorRate"],
#             "description": node["label"],
#         }
#         for node in nodes
#     ]
#     return {"vulnerabilities": vulnerabilities}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8000)
