from fastapi import APIRouter, Body
from typing import Dict, List
import json
import os

router = APIRouter()

# Get the path to the JSON file
file_path = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(__file__)), "medication-failure-tree.json"))

@router.post("/edges")
async def create_edge(edge_data: Dict = Body(...)):
    """Create a new edge"""
    try:
        # Read the current data
        with open(file_path, "r") as file:
            data = json.load(file)
            
        # Add the new edge to the connections list
        if "connections" not in data:
            data["connections"] = []
        data["connections"].append(edge_data)
        
        # Write back the updated data
        with open(file_path, "w") as file:
            json.dump(data, file, indent=2)
            
        return {"success": True, "edge": edge_data}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.delete("/edges/{edge_id}")
async def delete_edge(edge_id: str):
    """Delete an edge"""
    try:
        # Read the current data
        with open(file_path, "r") as file:
            data = json.load(file)
            
        # Remove the edge from the connections list
        data["connections"] = [conn for conn in data["connections"] if conn["id"] != edge_id]
        
        # Write back the updated data
        with open(file_path, "w") as file:
            json.dump(data, file, indent=2)
            
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/edges")
async def get_edges():
    """Get all edges"""
    try:
        with open(file_path, "r") as file:
            data = json.load(file)
            return {"edges": data.get("connections", [])}
    except Exception as e:
        return {"success": False, "error": str(e)}