export const twitterExtractorCode = `import tweepy
import json
import boto3
import datetime
import os
import logging
from botocore.exceptions import ClientError

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger()

def get_twitter_data():
    """Fetch data from X (Twitter) and return it as a list of dictionaries."""
    try:
        # Get credentials from environment variables
        api_key = os.environ.get("TWITTER_API_KEY")
        api_secret = os.environ.get("TWITTER_API_SECRET")
        access_token = os.environ.get("TWITTER_ACCESS_TOKEN")
        access_token_secret = os.environ.get("TWITTER_ACCESS_TOKEN_SECRET")
        bearer_token = os.environ.get("TWITTER_BEARER_TOKEN")
        
        # Set up authentication with Tweepy (supporting both v1 and v2 API options)
        # V2 API (preferred)
        client = tweepy.Client(
            bearer_token=bearer_token,
            consumer_key=api_key, 
            consumer_secret=api_secret,
            access_token=access_token, 
            access_token_secret=access_token_secret
        )
        
        # Search terms for stock-related content
        search_queries = [
            "stocks", "investing", "stockmarket", "wallstreetbets", 
            "$AAPL", "$MSFT", "$TSLA", "$AMZN", "$GOOG",
            "#investing", "#stocks", "#finance", "#trading"
        ]
        
        tweets_data = []
        
        # For each search term, collect tweets
        for query in search_queries:
            logger.info(f"Searching tweets for: {query}")
            
            try:
                # Using Twitter API v2
                response = client.search_recent_tweets(
                    query=query,
                    max_results=100,  # Adjust based on your API tier
                    tweet_fields=['created_at', 'author_id', 'public_metrics', 'conversation_id', 'lang'],
                    user_fields=['username', 'name', 'profile_image_url'],
                    expansions=['author_id']
                )
                
                # Handle includes for user data
                users = {user.id: user for user in response.includes['users']} if 'users' in response.includes else {}
                
                # Process tweets
                if response.data:
                    for tweet in response.data:
                        user = users.get(tweet.author_id)
                        
                        tweet_data = {
                            "id": tweet.id,
                            "text": tweet.text,
                            "created_at": tweet.created_at.isoformat(),
                            "author_id": tweet.author_id,
                            "username": user.username if user else None,
                            "display_name": user.name if user else None,
                            "retweet_count": tweet.public_metrics['retweet_count'],
                            "reply_count": tweet.public_metrics['reply_count'],
                            "like_count": tweet.public_metrics['like_count'],
                            "quote_count": tweet.public_metrics['quote_count'],
                            "conversation_id": tweet.conversation_id,
                            "lang": tweet.lang,
                            "query": query
                        }
                        
                        tweets_data.append(tweet_data)
                
                logger.info(f"Collected {len(response.data) if response.data else 0} tweets for query: {query}")
                
            except Exception as e:
                logger.error(f"Error processing query {query}: {str(e)}")
                # Continue with other queries even if one fails
                continue
                
        logger.info(f"Successfully collected {len(tweets_data)} tweets from X")
        return tweets_data
        
    except Exception as e:
        logger.error(f"Error fetching data from X: {str(e)}")
        raise

def upload_to_s3(data, bucket_name):
    """Upload the data to S3 with proper path organization."""
    try:
        s3_client = boto3.client('s3')
        
        # Create the path using current date
        now = datetime.datetime.now()
        year = now.strftime("%Y")
        month = now.strftime("%m")
        day = now.strftime("%d")
        timestamp = now.strftime("%Y%m%d_%H%M%S")
        
        # Define the S3 path - changed 'reddit' to 'twitter'
        s3_path = f"social_media_raw/twitter/{year}/{month}/{day}/data_batch_{timestamp}.json"
        
        # Convert data to JSON
        json_data = json.dumps(data)
        
        # Upload to S3
        s3_client.put_object(
            Bucket=bucket_name,
            Key=s3_path,
            Body=json_data
        )
        
        logger.info(f"Successfully uploaded data to s3://{bucket_name}/{s3_path}")
        return f"s3://{bucket_name}/{s3_path}"
        
    except Exception as e:
        logger.error(f"Error uploading to S3: {str(e)}")
        raise

def main():
    """Main function to run the X data collection process."""
    try:
        # Get S3 bucket name from environment variable
        bucket_name = os.environ.get("S3_BUCKET_NAME")
        if not bucket_name:
            raise ValueError("S3_BUCKET_NAME environment variable is not set")
        
        # Fetch data from X
        data = get_twitter_data()
        
        # Upload data to S3
        s3_path = upload_to_s3(data, bucket_name)
        
        logger.info(f"Process completed successfully. Data saved to {s3_path}")
        return True
    
    except Exception as e:
        logger.error(f"Error in main process: {str(e)}")
        return False

if __name__ == "__main__":
    main()`; 