from fastapi import FastAPI
from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime, timedelta

app = FastAPI()

class ProductCreate(BaseModel):
    url: HttpUrl
    target_price: Optional[float] = None
    email: Optional[str] = None

class Product(ProductCreate):
    id: int
    name: str
    current_price: float
    created_at: datetime
    last_updated: datetime
    image_url: Optional[str] = None

class PriceHistory(BaseModel):
    product_id: int
    price: float
    timestamp: datetime

@app.post("/products/", response_model=Product)
async def create_product(product: ProductCreate):
    now = datetime.utcnow()
    return {
        "id": 1,
        "url": product.url,
        "name": "Samsung Galaxy M14",
        "current_price": 11999,
        "target_price": product.target_price,
        "email": product.email,
        "created_at": now,
        "last_updated": now,
        "image_url": "https://m.media-amazon.com/images/I/81ZSn2rk9WL._SX679_.jpg"
    }

@app.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: int):
    now = datetime.utcnow()
    return {
        "id": product_id,
        "url": "https://www.amazon.in/dp/B0CV7KZLL4/",
        "name": "Samsung Galaxy M14",
        "current_price": 11999,
        "target_price": 12000,
        "email": "your.email@example.com",
        "created_at": now,
        "last_updated": now,
        "image_url": "https://m.media-amazon.com/images/I/81ZSn2rk9WL._SX679_.jpg"
    }

@app.get("/products/{product_id}/history", response_model=List[PriceHistory])
async def get_price_history(product_id: int):
    now = datetime.utcnow()
    return [
        {"product_id": product_id, "price": 13999, "timestamp": (now - timedelta(days=3))},
        {"product_id": product_id, "price": 12999, "timestamp": (now - timedelta(days=2))},
        {"product_id": product_id, "price": 12499, "timestamp": (now - timedelta(days=1))},
        {"product_id": product_id, "price": 11999, "timestamp": now},
    ]