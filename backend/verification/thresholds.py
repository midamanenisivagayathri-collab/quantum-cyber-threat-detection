"""Configurable deterministic verification thresholds."""

from pydantic import BaseModel, Field
from typing import Dict, Any


class SecurityThresholds(BaseModel):
    max_error_rate: float = Field(default=0.10, ge=0.0, le=1.0, description="Maximum allowable error rate")
    min_agreement_rate: float = Field(default=0.90, ge=0.0, le=1.0, description="Minimum required agreement rate")
    max_statistical_distance: float = Field(default=0.15, ge=0.0, le=1.0, description="Maximum allowable Total Variation Distance")
    replay_time_window_seconds: float = Field(default=300.0, ge=1.0, description="Replay time window in seconds")
    max_verification_attempts: int = Field(default=3, ge=1, description="Maximum verification attempts before unauthorized lockout")

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()


class ThresholdManager:
    """Singleton manager for runtime threshold configuration."""
    _current_thresholds: SecurityThresholds = SecurityThresholds()

    @classmethod
    def get_thresholds(cls) -> SecurityThresholds:
        return cls._current_thresholds

    @classmethod
    def update_thresholds(
        cls,
        max_error_rate: float = None,
        min_agreement_rate: float = None,
        max_statistical_distance: float = None,
        replay_time_window_seconds: float = None,
        max_verification_attempts: int = None
    ) -> SecurityThresholds:
        current = cls._current_thresholds.model_dump()
        if max_error_rate is not None:
            current["max_error_rate"] = max_error_rate
        if min_agreement_rate is not None:
            current["min_agreement_rate"] = min_agreement_rate
        if max_statistical_distance is not None:
            current["max_statistical_distance"] = max_statistical_distance
        if replay_time_window_seconds is not None:
            current["replay_time_window_seconds"] = replay_time_window_seconds
        if max_verification_attempts is not None:
            current["max_verification_attempts"] = max_verification_attempts

        cls._current_thresholds = SecurityThresholds(**current)
        return cls._current_thresholds

    @classmethod
    def reset_to_defaults(cls) -> SecurityThresholds:
        cls._current_thresholds = SecurityThresholds()
        return cls._current_thresholds
