import os
import json
import urllib.request
from dotenv import load_dotenv

load_dotenv()

MISTRAL_API_KEY = os.environ.get("MISTRAL_API_KEY")
MISTRAL_MODEL = os.environ.get("MISTRAL_MODEL", "mistral-7b-instruct")
MISTRAL_API_BASE_URL = os.environ.get(
    "MISTRAL_API_BASE_URL",
    "https://api.mistral.ai/v1/chat/completions",
)

print(f"API Key: {MISTRAL_API_KEY[:20]}..." if MISTRAL_API_KEY else "API Key: NOT SET")
print(f"Model: {MISTRAL_MODEL}")
print(f"URL: {MISTRAL_API_BASE_URL}")

if not MISTRAL_API_KEY:
    print("❌ MISTRAL_API_KEY is not set!")
    exit(1)

payload = {
    "model": MISTRAL_MODEL,
    "messages": [
        {
            "role": "user",
            "content": "Hello, say test",
        }
    ],
    "max_tokens": 50,
    "temperature": 0.7,
}

print("\nPayload:")
print(json.dumps(payload, indent=2))

try:
    request = urllib.request.Request(
        MISTRAL_API_BASE_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
        },
        method="POST",
    )

    print("\nRequest headers:")
    print(f"Authorization: Bearer {MISTRAL_API_KEY[:20]}...")
    print("Content-Type: application/json")

    with urllib.request.urlopen(request, timeout=30) as response:
        result = json.load(response)
        print("\n✅ Success!")
        print(json.dumps(result, indent=2))

except urllib.error.HTTPError as e:
    print(f"\n❌ HTTP Error {e.code}: {e.reason}")
    print(f"URL: {e.url}")
    error_body = e.read().decode()
    print(f"Error body:\n{error_body}")
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
