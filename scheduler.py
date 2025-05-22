from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from sqlalchemy.orm import Session
from datetime import datetime
import logging
from typing import List
from . import database
from . import scraper
from . import email_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PriceTracker:
    def __init__(self, db: Session):
        self.db = db
        self.scraper = scraper.AmazonScraper()
        self.scheduler = BackgroundScheduler()
        self.scheduler.start()

    def start_tracking(self):
        """Start the price tracking scheduler."""
        self.scheduler.add_job(
            self.check_prices,
            trigger=IntervalTrigger(minutes=30),
            id='price_check',
            replace_existing=True
        )
        logger.info("Price tracking scheduler started")

    def check_prices(self):
        """Check prices for all tracked products."""
        try:
            products = self.db.query(database.Product).all()
            for product in products:
                self.update_product_price(product)
        except Exception as e:
            logger.error(f"Error in price check: {str(e)}")

    def update_product_price(self, product):
        """Update price for a single product."""
        try:
            # Get current price from Amazon
            product_info = self.scraper.get_product_info(product.url)
            
            if product_info["current_price"] is not None:
                # Update product price
                product.current_price = product_info["current_price"]
                product.last_updated = datetime.utcnow()
                
                # Add to price history
                price_history = database.PriceHistory(
                    product_id=product.id,
                    price=product_info["current_price"]
                )
                self.db.add(price_history)
                
                # Check if price alert should be sent
                if (product.target_price and 
                    product.email and 
                    product_info["current_price"] <= product.target_price):
                    self.send_price_alert(product, product_info["current_price"])
                
                self.db.commit()
                logger.info(f"Updated price for product {product.id}: {product_info['current_price']}")
            
        except Exception as e:
            logger.error(f"Error updating price for product {product.id}: {str(e)}")
            self.db.rollback()

    def send_price_alert(self, product, current_price):
        """Send price alert email."""
        try:
            subject = f"Price Alert: {product.name}"
            body = f"""
            The price of {product.name} has dropped to ₹{current_price}!
            
            Your target price was: ₹{product.target_price}
            Current price: ₹{current_price}
            
            View the product here: {product.url}
            """
            
            email_service.send_email(product.email, subject, body)
            logger.info(f"Price alert sent for product {product.id}")
            
        except Exception as e:
            logger.error(f"Error sending price alert: {str(e)}")

    def stop_tracking(self):
        """Stop the price tracking scheduler."""
        self.scheduler.shutdown()
        logger.info("Price tracking scheduler stopped") 