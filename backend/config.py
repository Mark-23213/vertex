import os
import secrets
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent


def _load_dotenv(path: Path) -> None:
    """Минимальный загрузчик .env без внешних зависимостей."""
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


_load_dotenv(BASE_DIR / ".env")


class Settings:
    # Если секрет не задан в .env — генерируем эфемерный (токены сбросятся при рестарте).
    JWT_SECRET: str = os.environ.get("JWT_SECRET") or secrets.token_urlsafe(48)
    JWT_ALG: str = os.environ.get("JWT_ALG", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")  # 24 часа
    )

    # CORS: разрешён только фронтенд-домен (никаких "*").
    FRONTEND_ORIGIN: str = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")

    # Окружение: в проде отключаем подробные ошибки.
    ENV: str = os.environ.get("ENV", "dev")


settings = Settings()
