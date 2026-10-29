import sys
import json

from services.analyzer import StartupAnalyzer


def main():
    try:
        # Read JSON sent from Express
        input_data = sys.stdin.read()

        startup = json.loads(input_data)

        # Create analyzer
        analyzer = StartupAnalyzer()

        # Run AI analysis
        result = analyzer.analyze(startup)

        # Send JSON back to Express
        print(json.dumps(result, default=str))

    except Exception as e:
        print(
            json.dumps({
                "success": False,
                "error": str(e)
            })
        )
        sys.exit(1)


if __name__ == "__main__":
    main()