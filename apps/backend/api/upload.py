from fastapi import (
    APIRouter,
    UploadFile,
    HTTPException,
    BackgroundTasks,
    Depends,
)
from fastapi.responses import JSONResponse
import pandas as pd
from sqlalchemy.orm import Session
import io
from database import get_db
from services.upload import process_csv_file

router = APIRouter()


@router.post("/upload-csv")
async def upload_csv(
    background_tasks: BackgroundTasks,
    file: UploadFile,
    db: Session = Depends(get_db),
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    try:
        # Read the CSV file
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))

        # Validate required columns
        required_columns = [
            "date",
            "latitude",
            "longitude",
            "address",
            "severity",
            "road_type",
            "weather",
            "description",
            "casualties",
            "vehicles_involved",
        ]

        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required columns: {', '.join(missing_columns,)}",
            )

        # Process the CSV file in the background
        background_tasks.add_task(process_csv_file, df, db)

        return JSONResponse(
            content={
                "message": "CSV upload started",
                "total_rows": len(df),
                "status": "processing",
            },
            status_code=202,
        )

    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="CSV file is empty")
    except pd.errors.ParserError:
        raise HTTPException(status_code=400, detail="Invalid CSV format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
