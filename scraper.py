from playwright.sync_api import sync_playwright
import time
import re
from typing import Dict, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AmazonScraper:
    def __init__(self):
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(headless=True)
        self.context = self.browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        )

    def __del__(self):
        self.context.close()
        self.browser.close()
        self.playwright.stop()

    def extract_price(self, price_text: str) -> Optional[float]:
        """Extract price from text."""
        if not price_text:
            return None
        # Remove currency symbol and commas, then convert to float
        price = re.sub(r'[^\d.]', '', price_text)
        try:
            return float(price)
        except ValueError:
            return None

    def get_product_info(self, url: str) -> Dict:
        """Get product information from Amazon URL."""
        try:
            page = self.context.new_page()
            page.goto(url, wait_until="networkidle")
            
            # Wait for price element to load
            page.wait_for_selector("#priceblock_ourprice, #priceblock_dealprice, .a-price .a-offscreen", timeout=10000)
            
            # Get product name
            name = page.query_selector("#productTitle")
            name_text = name.inner_text().strip() if name else None
            
            # Get price
            price_element = page.query_selector("#priceblock_ourprice, #priceblock_dealprice, .a-price .a-offscreen")
            price_text = price_element.inner_text() if price_element else None
            price = self.extract_price(price_text)
            
            # Get image URL
            image_element = page.query_selector("#landingImage")
            image_url = image_element.get_attribute("src") if image_element else None
            
            return {
                "name": name_text,
                "current_price": price,
                "image_url": image_url,
                "url": url
            }
            
        except Exception as e:
            logger.error(f"Error scraping product: {str(e)}")
            return {
                "name": None,
                "current_price": None,
                "image_url": None,
                "url": url,
                "error": str(e)
            }
        finally:
            page.close()

    def search_other_platforms(self, product_name: str) -> Dict:
        """Search for the same product on other platforms."""
        # TODO: Implement multi-platform search using AI
        return {} 