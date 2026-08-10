from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    latitude: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    longitude: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    wind_speed_kmh: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    rainfall_mm: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    temperature_c: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    humidity_percent: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    storm: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    risk_level: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    confidence_percent: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    recommended_sensitivity: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    explanation_summary: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    explanation_factors: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )