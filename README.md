# StockVision

StockVision is a small full-stack demo that provides stock data visualization and simple AI-assisted decision tools.

This repository contains:

- `backend/` — FastAPI backend serving API endpoints and simple ML utilities.
- `frontend/` — Vite + React frontend for UI, charts, and authentication flows.

**Repository structure (top-level)**

- `backend/` — Python FastAPI app (package `app/`, `requirements.txt`, run from this folder)
- `frontend/` — React + Vite UI
- `README.md` — This file

**Prerequisites**

- Python 3.10+ (for backend)
- Node.js 16+ and `npm` or `yarn` (for frontend)
- Git (optional)

This README uses relative paths and cross-platform commands so examples work regardless of your machine path.

**Backend — Setup & Run**

1. Open a terminal and change into the backend folder:

	 ```bash
	 cd backend
	 ```

2. Create a virtual environment (recommended name: `.venv`). You can create the venv either inside `backend` or at the repository root. Examples below use a venv in `backend/.venv`.

	 - Windows (cmd.exe):

		 ```cmd
		 python -m venv .venv
		 .venv\Scripts\activate
		 ```

	 - Windows (PowerShell):

		 ```powershell
		 python -m venv .venv
		 .\.venv\Scripts\Activate.ps1
		 ```

	 - macOS / Linux:

		 ```bash
		 python3 -m venv .venv
		 source .venv/bin/activate
		 ```

3. Install Python dependencies:

	 ```bash
	 python -m pip install --upgrade pip
	 python -m pip install -r requirements.txt
	 ```

	 - If a specific package is missing during runtime (for example `joblib`), install it into the active venv:

		 ```bash
		 python -m pip install joblib
		 ```

4. Run the backend (run this from the `backend` directory so the `app` package is importable):

	 ```bash
	 python -m uvicorn app.main:app --reload
	 ```

	 - The app will be served at `http://127.0.0.1:8000` by default.
	 - For production-style hosting, run without `--reload` and set `--host`/`--port`.

**Frontend — Setup & Run**

1. Open a new terminal and change into the frontend folder:

	 ```bash
	 cd frontend
	 ```

2. Install dependencies and start the dev server:

	 ```bash
	 npm install
	 npm run dev
	 ```

	 - If you prefer `yarn`:

		 ```bash
		 yarn
		 yarn dev
		 ```

	 - Vite typically serves at `http://localhost:5173`.

**Run both services together (dev)**

- Start the backend first (so API is available), then start the frontend in a second terminal.
- Open the frontend URL in your browser to use the application.

**Common Problems & Fixes**

- `No module named 'joblib'`:
	- Ensure your virtualenv is active and `joblib` is installed in that environment.
	- Install with: `python -m pip install joblib` (run inside the activated venv).

- `ModuleNotFoundError: No module named 'app'` when running Uvicorn:
	- Make sure you run Uvicorn from the `backend` folder (where the `app/` package exists):

		```bash
		cd backend
		python -m uvicorn app.main:app --reload
		```

- Activation not working on Windows:
	- You can run the venv Python directly without activating the shell:

		```cmd
		.venv\Scripts\python.exe -m pip install -r requirements.txt
		.venv\Scripts\python.exe -m uvicorn app.main:app --reload
		```

**Notes for contributors**

- Backend code is in `backend/app/` and API routes live under `backend/app/api/`.
- Frontend code is in `frontend/src/`.
- Add any new Python packages to `backend/requirements.txt` so others can install them reproducibly.

**Optional next steps I can do for you**

- Commit the `requirements.txt` and `README.md` updates.
- Add a `setup.bat` and/or `setup.sh` to automate venv creation and dependency install.
- Add a `.env.example` listing environment variables the backend expects.

If you'd like one of those follow-ups, tell me which and I'll implement it.

