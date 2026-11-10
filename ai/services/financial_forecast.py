
import csv
import math
from pathlib import Path


class FinancialForecast:

    def __init__(self):
        self.data_path = (
            Path(__file__).resolve().parent.parent
            / "data"
            / "financial_forecast_assumptions.csv"
        )

    def get_assumptions(self, industry, stage):
        with self.data_path.open(
            "r", encoding="utf-8-sig", newline=""
        ) as file:
            rows = csv.DictReader(file)

            for row in rows:
                if (
                    row["industry"].lower() == industry.lower()
                    and row["stage"].lower() == stage.lower()
                ):
                    return row

        return None

    def compare_stages(self, industry):
        stages = ["MVP", "Early traction"]
        results = []

        for stage in stages:
            result = self.calculate(industry, stage)

            if result["success"]:
                results.append({
                    "stage": stage,
                    **result["metrics"]
                })

        return {
            "industry": industry,
            "currency": "INR",
            "scenarios": results,
            "data_note": (
                "Illustrative assumptions, not validated "
                "financial projections."
            )
        }

    def calculate(self, industry, stage):
        row = self.get_assumptions(industry, stage)

        if not row:
            return {
                "success": False,
                "error": "No financial assumptions found."
            }

        # Read financial assumptions
        customers = int(row["monthly_customers_assumption"])

        revenue_per_customer = float(
            row["average_monthly_revenue_per_customer_inr_assumption"]
        )

        fixed_cost = float(
            row["monthly_fixed_cost_inr_assumption"]
        )

        variable_cost = float(
            row["monthly_variable_cost_per_customer_inr_assumption"]
        )

        # Calculate revenue and costs
        revenue = customers * revenue_per_customer

        total_variable_cost = customers * variable_cost

        total_cost = fixed_cost + total_variable_cost

        profit = revenue - total_cost

        # Calculate contribution per customer
        contribution_per_customer = (
            revenue_per_customer - variable_cost
        )

        # Calculate break-even customers
        break_even_customers = (
            fixed_cost / contribution_per_customer
            if contribution_per_customer > 0
            else None
        )

        # Return financial analysis
        return {
            "success": True,
            "industry": industry,
            "stage": stage,

            "assumptions": {
                "monthly_customers": customers,
                "revenue_per_customer": revenue_per_customer,
                "fixed_cost": fixed_cost,
                "variable_cost_per_customer": variable_cost
            },

            "metrics": {
                "monthly_revenue": revenue,
                "monthly_fixed_cost": fixed_cost,
                "monthly_variable_cost": total_variable_cost,
                "monthly_total_cost": total_cost,
                "monthly_profit": profit,

                "break_even_customers": (
                    math.ceil(break_even_customers)
                    if break_even_customers is not None
                    else None
                )
            },

            "warning": row["warning"]
        }
