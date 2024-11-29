import random
import datetime
import time

def generate_live_data():
    """Generate random live data."""
    # System states
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    shift = random.choice(["First Shift", "Second Shift", "Third Shift"])

    # Biometric data
    biometric_data = {
        "heart_rate": random.randint(60, 100),
        "fatigue": random.uniform(0, 1),  # Scale 0 (low) to 1 (high)
        "stress": random.uniform(0, 1),
        "workload": random.uniform(0, 1),
    }

    # Personnel information
    personnel_info = {
        "nurse_to_patient_ratio": round(random.uniform(1.5, 4.0), 1),
        "waiting_room_occupancy": random.randint(0, 100),  # Percentage
        "beds_occupied": random.randint(0, 100),  # Percentage
    }

    # Software values
    software_values = {
        "cpu_utilization": random.randint(10, 90),  # Percentage
        "memory_utilization": random.randint(10, 90),  # Percentage
    }

    # Hardware load
    hardware_load = {
        "disk_io": round(random.uniform(10.0, 90.0), 1),  # Percentage
        "network_bandwidth": round(random.uniform(10.0, 90.0), 1),  # Percentage
    }

    # Current risk level (consolidated)
    consolidated_risk = max(
        biometric_data["fatigue"], biometric_data["stress"], biometric_data["workload"]
    )

    current_risk = {
        "level": round(consolidated_risk * 100, 1),  # Risk level as percentage
        "status": "High" if consolidated_risk > 0.75 else "Moderate" if consolidated_risk > 0.5 else "Low",
    }

    # Combine all data
    live_feed = {
        "system_states": {"time": current_time, "shift": shift},
        "biometric_data": biometric_data,
        "personnel_info": personnel_info,
        "software_values": software_values,
        "hardware_load": hardware_load,
        "current_risk": current_risk,
    }

    return live_feed


if __name__ == "__main__":
    while True:
        live_data = generate_live_data()
        print(live_data)
        time.sleep(1)  # Simulate live updates every second
