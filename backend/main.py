from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Task
from pydantic import BaseModel
from typing import List
from datetime import datetime


# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic schemas
class TaskCreate(BaseModel):
    title: str
    description: str

class TaskSchema(BaseModel):
    id: int
    title: str
    description: str
    is_completed: bool
    created_at: datetime

    class Config:
        orm_mode = True

# Routes

@app.post("/tasks/", response_model=TaskSchema)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(title=task.title, description=task.description)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/tasks/", response_model=List[TaskSchema])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task)\
             .filter(Task.is_completed == False)\
             .order_by(Task.created_at.desc())\
             .limit(5)\
             .all()



@app.patch("/tasks/{task_id}/complete", response_model=TaskSchema)
def complete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.is_completed = True  # Mark as completed
    db.commit()
    db.refresh(task)
    
    return task

