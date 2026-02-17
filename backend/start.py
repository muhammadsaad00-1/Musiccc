import os
import uvicorn
from main import app

port = int(os.environ.get("PORT", 8081))  # Cloud Run sets PORT

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=port)