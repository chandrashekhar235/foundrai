
import sys
import json

from fastapi import FastAPI, HTTPException
from services.analyzer import StartupAnalyzer


# Vercel requires a top-level application object
app = FastAPI(
    title="FoundrAI AI Engine",
    description="AI-powered startup analysis service",
    version="1.0.0",
)


def run_analysis(startup: dict):
    """Shared startup analysis logic."""

    analyzer = StartupAnalyzer()
    result = analyzer.analyze(startup)

    return result


# Health check
@app.get("/")
def health_check():
    return {
        "success": True,
        "message": "FoundrAI AI Engine is running"
    }


# HTTP endpoint for Vercel
@app.post("/analyze")
def analyze_endpoint(startup: dict):

    try:
        result = run_analysis(startup)
        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# Preserve existing CLI execution
def main():

    try:
        print(
            "STEP 1: Reading startup input",
            file=sys.stderr,
            flush=True
        )

        input_data = sys.stdin.read()
        startup = json.loads(input_data)

        print(
            "STEP 2: Initializing StartupAnalyzer",
            file=sys.stderr,
            flush=True
        )

        result = run_analysis(startup)

        print(
            "STEP 3: Analysis completed",
            file=sys.stderr,
            flush=True
        )

        print(json.dumps(result, default=str))

    except Exception as e:

        print(
            f"PYTHON ERROR: {e}",
            file=sys.stderr,
            flush=True
        )

        print(json.dumps({
            "success": False,
            "error": str(e)
        }))

        sys.exit(1)


if __name__ == "__main__":
    main()
