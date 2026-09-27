from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.news import News
from models.project import Project
from schemas.news import NewsCreate, NewsUpdate, NewsResponse
from security.auth import get_current_admin

router = APIRouter()


def build_news_response(news: News) -> NewsResponse:
    return NewsResponse(
        id=news.id,
        title=news.title,
        excerpt=news.excerpt,
        content=news.content,
        image_url=news.image_url,
        publication_date=news.publication_date,
        project_name=news.project.name if news.project else None
    )


@router.get("/", response_model=list[NewsResponse])
def get_news(db: Session = Depends(get_db)):
    news_items = (
        db.query(News)
        .order_by(News.publication_date.desc())
        .all()
    )

    return [build_news_response(item) for item in news_items]


@router.get("/{news_id}", response_model=NewsResponse)
def get_news_item(news_id: int, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()

    if not news:
        raise HTTPException(status_code=404, detail="News item not found")

    return build_news_response(news)


@router.post("/", response_model=NewsResponse)
def create_news(
    news_data: NewsCreate,
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    if news_data.project_id is not None:
        project = (
            db.query(Project)
            .filter(Project.id == news_data.project_id)
            .first()
        )

        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found"
            )

    new_news = News(
        title=news_data.title,
        excerpt=news_data.excerpt,
        content=news_data.content,
        image_url=news_data.image_url,
        project_id=news_data.project_id
    )

    db.add(new_news)
    db.commit()
    db.refresh(new_news)

    return build_news_response(new_news)


@router.put("/{news_id}", response_model=NewsResponse)
def update_news(
    news_id: int,
    news_data: NewsUpdate,
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    news = db.query(News).filter(News.id == news_id).first()

    if not news:
        raise HTTPException(
            status_code=404,
            detail="News item not found"
        )

    if news_data.project_id is not None:
        project = (
            db.query(Project)
            .filter(Project.id == news_data.project_id)
            .first()
        )

        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found"
            )

    news.title = news_data.title
    news.excerpt = news_data.excerpt
    news.content = news_data.content
    news.image_url = news_data.image_url
    news.project_id = news_data.project_id

    db.commit()
    db.refresh(news)

    return build_news_response(news)


@router.delete("/{news_id}")
def delete_news(
    news_id: int,
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    news = db.query(News).filter(News.id == news_id).first()

    if not news:
        raise HTTPException(
            status_code=404,
            detail="News item not found"
        )

    db.delete(news)
    db.commit()

    return {"message": "News item deleted successfully"}