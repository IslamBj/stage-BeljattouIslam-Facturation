import subprocess
import time
import os

def start_node_server():
    print("Starting Node.js server...")
    process = subprocess.Popen(
        ["node", "server.js"],
        cwd="C:/Users/SATAMOUNI/Desktop/test/facturation_app/backend",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    time.sleep(2)  # Wait for the server to start
    if process.poll() is not None:  # Check if the process has already stopped
        print(f"Node.js server failed to start. Error:\n{process.stderr.read()}")
        return None
    print("Node.js server started successfully.")
    return process

def start_react_app():
    print("Starting React development server...")
    process = subprocess.Popen(
        ["C:/Program Files/nodejs/npm.cmd", "start"],
        cwd="C:/Users/SATAMOUNI/Desktop/test/facturation_app",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    time.sleep(10)  # Wait for the React server to start
    if process.poll() is not None:  # Check if the process has already stopped
        print(f"React development server failed to start. Error:\n{process.stderr.read()}")
        return None
    print("React development server started successfully.")
    return process

def main():
    node_process = start_node_server()
    if not node_process:
        print("Failed to start the Node.js server. Exiting...")
        return

    react_process = start_react_app()
    if not react_process:
        print("Failed to start the React development server. Exiting...")
        node_process.terminate()
        return

    try:
        print("Servers are running. Press Ctrl+C to stop.")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Stopping servers...")
        node_process.terminate()
        react_process.terminate()
        node_process.wait()
        react_process.wait()
        print("Servers stopped.")

if __name__ == "__main__":
    main()
