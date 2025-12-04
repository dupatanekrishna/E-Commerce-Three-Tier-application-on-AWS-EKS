# payment/tests/test_health.py
import json

from app import app  # adjust if your Flask app is named differently

def test_health_endpoint():
    client = app.test_client()
    resp = client.get("/health")
    assert resp.status_code == 200
    data = json.loads(resp.data.decode())
    assert data.get("status") == "ok"
