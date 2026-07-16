from sqlalchemy import text
from fastapi import FastAPI

from app.api.health import router as health_router
from app.core.logging import configure_logging
from app.database.session import engine

configure_logging()

app = FastAPI(title="Klinimate Backend")
app.include_router(health_router)


@app.on_event("startup")
def on_startup() -> None:
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Klinimate backend is online"}
