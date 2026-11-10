import sys
import json

from services.analyzer import StartupAnalyzer


def main():
    try:
        print("STEP 1: Reading startup input", file=sys.stderr, flush=True)

        input_data = sys.stdin.read()
        startup = json.loads(input_data)

        print("STEP 2: Initializing StartupAnalyzer", file=sys.stderr, flush=True)

        analyzer = StartupAnalyzer()

        print("STEP 3: StartupAnalyzer initialized", file=sys.stderr, flush=True)

        result = analyzer.analyze(startup)

        print("STEP 4: Analysis completed", file=sys.stderr, flush=True)

        print(json.dumps(result, default=str))

    except Exception as e:
        print(f"PYTHON ERROR: {e}", file=sys.stderr, flush=True)

        print(
            json.dumps({
                "success": False,
                "error": str(e)
            })
        )

        sys.exit(1)


if __name__ == "__main__":
    main()