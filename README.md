# Simple Movie search project written in Fast API + React

## Set environment variables
```bash
## .env
DATABASE_URL=<DATABASE_URL>
TMDB_API_KEY=<TMDB_API_KEY>
```

## Run project via docker

```bash
docker-compose up
```

## Run project locally

Generate and activate venv

```bash
python3 -m venv .venv
source .venv/bin/activate -- Linux
```

Install packages

```bash
pip install -r requirements.txt
```

Run project

```bash
uvicorn main:app --reload
```

## License

[MIT](https://choosealicense.com/licenses/mit/)