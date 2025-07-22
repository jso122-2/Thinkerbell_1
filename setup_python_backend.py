#!/usr/bin/env python3
"""
Thinkerbell Python Backend Setup Script
Automated setup and testing for the semantic processing engine
"""

import subprocess
import sys
import os
import requests
import time
from pathlib import Path

def run_command(cmd, check=True):
    """Run a shell command and return the result"""
    print(f"🔄 Running: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if check and result.returncode != 0:
        print(f"❌ Command failed: {result.stderr}")
        return False
    return result.returncode == 0

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ required")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro}")
    return True

def install_dependencies():
    """Install Python dependencies"""
    print("\n📦 Installing Python dependencies...")
    
    # Check if requirements file exists
    if not Path("backend_requirements.txt").exists():
        print("❌ backend_requirements.txt not found")
        return False
    
    # Install dependencies
    success = run_command(f"{sys.executable} -m pip install -r backend_requirements.txt")
    if success:
        print("✅ Dependencies installed successfully")
    return success

def test_ml_dependencies():
    """Test if ML dependencies are working"""
    print("\n🧠 Testing ML dependencies...")
    
    try:
        import sentence_transformers
        import sklearn
        import numpy
        print("✅ All ML dependencies available")
        return True
    except ImportError as e:
        print(f"⚠️ ML dependency missing: {e}")
        print("💡 Some features will use fallback processing")
        return False

def start_server():
    """Start the Python backend server"""
    print("\n🚀 Starting Python backend server...")
    print("📡 Server will be available at: http://localhost:8000")
    print("📋 API docs will be at: http://localhost:8000/docs")
    print("🛑 Press Ctrl+C to stop the server")
    
    try:
        import uvicorn
        uvicorn.run("backend_server:app", host="0.0.0.0", port=8000, reload=True)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
    except Exception as e:
        print(f"❌ Server failed to start: {e}")

def test_server():
    """Test if the server is responding"""
    print("\n🔍 Testing server connection...")
    
    max_retries = 10
    for i in range(max_retries):
        try:
            response = requests.get("http://localhost:8000/health", timeout=5)
            if response.status_code == 200:
                print("✅ Server is responding!")
                health_data = response.json()
                print(f"📊 Status: {health_data.get('status')}")
                print(f"🧠 ML Available: {health_data.get('ml_available')}")
                print(f"🤖 Model Loaded: {health_data.get('model_loaded')}")
                return True
        except requests.exceptions.RequestException:
            print(f"⏳ Waiting for server... ({i+1}/{max_retries})")
            time.sleep(2)
    
    print("❌ Server not responding")
    return False

def main():
    """Main setup function"""
    print("🎭 Thinkerbell Python Backend Setup")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        print("\n❌ Setup failed during dependency installation")
        sys.exit(1)
    
    # Test ML dependencies
    ml_available = test_ml_dependencies()
    
    print("\n✅ Setup complete!")
    print("\n🎯 Next steps:")
    print("1. Run the server: python backend_server.py")
    print("2. Test the API: http://localhost:8000/docs")
    print("3. Connect from frontend: The semantic bridge will auto-connect")
    
    if not ml_available:
        print("\n💡 Note: ML dependencies missing, using fallback processing")
        print("   For full features, install: pip install sentence-transformers torch")
    
    # Ask if user wants to start server now
    response = input("\n🚀 Start the server now? (y/n): ").lower().strip()
    if response in ['y', 'yes']:
        start_server()

if __name__ == "__main__":
    main() 