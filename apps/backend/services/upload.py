from sqlalchemy.orm import Session
import pandas as pd
from database import Accident
from typing import Dict, Any


def process_csv_file(df: pd.DataFrame, db: Session) -> Dict[str, Any]:
    """
    Process the CSV file and insert records into the database.
    Returns a summary of the operation.
    """
    results = {
        "total_rows": len(df),
        "successful": 0,
        "failed": 0,
        "errors": [],
    }

    # Process in batches of 1000
    batch_size = 1000
    for i in range(0, len(df), batch_size):
        batch = df.iloc[i : i + batch_size]
        accidents_to_create = []

        for _, row in batch.iterrows():
            try:
                # Convert row to dictionary and create accident record
                accident_data = {
                    "date": pd.to_datetime(row["date"]).isoformat(),
                    "location": {
                        "latitude": float(row["latitude"]),
                        "longitude": float(row["longitude"]),
                        "address": str(row["address"]),
                    },
                    "severity": str(row["severity"]),
                    "road_type": str(row["road_type"]),
                    "weather": str(row["weather"]),
                    "description": str(row["description"]),
                    "casualties": int(row["casualties"]),
                    "vehicles_involved": int(row["vehicles_involved"]),
                }

                # Validate the data
                accident = Accident(**accident_data)
                accidents_to_create.append(accident)
                results["successful"] += 1

            except Exception as e:
                results["failed"] += 1
                results["errors"].append(
                    {"row": i + len(accidents_to_create) + 1, "error": str(e)}
                )

        # Bulk insert the valid records
        if accidents_to_create:
            db_accidents = [
                Accident(**accident.dict()) for accident in accidents_to_create
            ]
            db.bulk_save_objects(db_accidents)
            db.commit()

    return results
