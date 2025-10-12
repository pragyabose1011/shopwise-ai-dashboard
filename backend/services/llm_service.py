import random
import logging
from config import Config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.api_key = Config.OPENAI_API_KEY
        if self.api_key and self.api_key != 'your-openai-api-key-here':
            try:
                import openai
                openai.api_key = self.api_key
                self.use_openai = True
            except ImportError:
                self.use_openai = False
                logger.warning("OpenAI library not installed, using mock explanations")
        else:
            self.use_openai = False
            logger.warning("OpenAI API key not configured, using mock explanations")

    def generate_explanation(self, user_profile, product, recommendation_context):
        """Generate explanation for why a product is recommended to a user"""
        if self.use_openai:
            return self._generate_openai_explanation(user_profile, product, recommendation_context)
        else:
            return self._generate_mock_explanation(user_profile, product, recommendation_context)

    def _generate_mock_explanation(self, user_profile, product, recommendation_context):
        """Generate mock explanation when OpenAI is not available"""
        templates = [
            "Based on your interest in {category} products and previous purchases, this {product_name} aligns perfectly with your preferences. Your rating history shows you appreciate quality items in this price range.",

            "Users with similar shopping patterns to yours have highly rated this {product_name}. Your preference for {category} products makes this an ideal recommendation for you.",

            "This {product_name} complements your recent purchases and falls within your typical spending range. Your engagement with similar {category} items suggests you'll find this valuable.",

            "Given your positive ratings for {category} products and your shopping behavior, this {product_name} represents excellent value and quality that matches your standards.",

            "Your interaction history indicates a strong preference for {category} items. This {product_name} has received excellent reviews from users with similar tastes to yours.",

            "Based on your purchase history and the high ratings you've given to similar products, this {product_name} in the {category} category is likely to meet your expectations.",

            "This {product_name} is recommended because of your demonstrated interest in quality {category} products and your consistent preference for items in this price range."
        ]

        # Select random template and fill in details
        template = random.choice(templates)

        explanation = template.format(
            category=product.get('category', 'quality').lower(),
            product_name=product.get('name', 'item').lower(),
        )

        # Add context-specific information
        if recommendation_context.get('algorithm') == 'collaborative':
            explanation += " Similar users have given this product high ratings."
        elif recommendation_context.get('algorithm') == 'content-based':
            explanation += " The product features match your demonstrated preferences."
        elif recommendation_context.get('algorithm') == 'hybrid':
            explanation += " This recommendation combines both your preferences and community feedback."

        return explanation
