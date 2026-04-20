from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.assessments import router as assessments_router
from routers.axes import router as axes_router
from routers.questions import router as questions_router

app = FastAPI(title="CX Maturity Assessment API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assessments_router)
app.include_router(axes_router)
app.include_router(questions_router)
