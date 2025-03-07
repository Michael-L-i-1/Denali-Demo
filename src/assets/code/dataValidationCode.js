export const dataValidationCode = `{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Social Media Stock Mentions Data Validation and Analysis\n",
    "\n",
    "This notebook explores the following data warehouse tables:\n",
    "- \\`social_posts\\`: Contains information about social media posts\n",
    "- \\`stock_mentions\\`: Contains mentions of stock tickers within posts\n",
    "- \\`trending_stocks_weekly\\`: Contains weekly aggregated stock mention statistics"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 1,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Import libraries\n",
    "import pandas as pd\n",
    "import numpy as np\n",
    "import matplotlib.pyplot as plt\n",
    "import seaborn as sns\n",
    "from datetime import datetime, timedelta\n",
    "import warnings\n",
    "\n",
    "# Suppress warnings for cleaner output\n",
    "warnings.filterwarnings('ignore')\n",
    "\n",
    "# Set plotting style\n",
    "plt.style.use('ggplot')\n",
    "sns.set(style=\"whitegrid\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 1. Data Loading\n",
    "Connect to our data warehouse and load sample data from the tables."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Successfully loaded data:\n",
      "- social_posts: 5000 records\n",
      "- stock_mentions: 7482 records\n",
      "- trending_stocks_weekly: 96 records\n"
     ]
    }
   ],
   "source": [
    "# In a real scenario, we would connect to the data warehouse\n",
    "# For demonstration, we'll generate sample data\n",
    "\n",
    "# Generate sample social posts data\n",
    "def generate_social_posts(n=5000):\n",
    "    np.random.seed(42)\n",
    "    platforms = ['Twitter', 'Reddit', 'StockTwits', 'LinkedIn', 'Facebook']\n",
    "    \n",
    "    data = {\n",
    "        'id': [f'post_{i}' for i in range(1, n+1)],\n",
    "        'platform': np.random.choice(platforms, n, p=[0.4, 0.3, 0.2, 0.05, 0.05]),\n",
    "        'text': [f'Sample post text {i} about stocks' for i in range(1, n+1)],\n",
    "        'created_at': pd.date_range(start='2023-01-01', periods=n, freq='H'),\n",
    "        'engagement_score': np.random.uniform(0, 100, n)\n",
    "    }\n",
    "    \n",
    "    return pd.DataFrame(data)\n",
    "\n",
    "# Generate sample stock mentions data\n",
    "def generate_stock_mentions(social_posts_df, mentions_per_post=1.5):\n",
    "    np.random.seed(42)\n",
    "    tickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NFLX', 'NVDA']\n",
    "    \n",
    "    # Each post may have multiple stock mentions\n",
    "    total_mentions = int(len(social_posts_df) * mentions_per_post)\n",
    "    \n",
    "    post_ids = np.random.choice(social_posts_df['id'].tolist(), total_mentions)\n",
    "    created_at_dict = dict(zip(social_posts_df['id'], social_posts_df['created_at']))\n",
    "    \n",
    "    data = {\n",
    "        'post_id': post_ids,\n",
    "        'ticker': np.random.choice(tickers, total_mentions, p=[0.25, 0.2, 0.15, 0.1, 0.1, 0.1, 0.05, 0.05]),\n",
    "        'sentiment_score': np.random.normal(0, 1, total_mentions),\n",
    "        'created_at': [created_at_dict.get(pid) for pid in post_ids]\n",
    "    }\n",
    "    \n",
    "    return pd.DataFrame(data)\n",
    "\n",
    "# Generate sample trending stocks weekly data\n",
    "def generate_trending_stocks(weeks=12):\n",
    "    np.random.seed(42)\n",
    "    tickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NFLX', 'NVDA']\n",
    "    \n",
    "    data = []\n",
    "    for week in range(weeks):\n",
    "        week_ending = pd.Timestamp('2023-01-08') + pd.Timedelta(days=7*week)\n",
    "        for ticker in tickers:\n",
    "            mention_count = np.random.randint(100, 1000)\n",
    "            prev_week_count = np.random.randint(100, 1000)\n",
    "            change_pct = ((mention_count - prev_week_count) / prev_week_count) * 100\n",
    "            \n",
    "            data.append({\n",
    "                'week_ending': week_ending,\n",
    "                'ticker': ticker,\n",
    "                'mention_count': mention_count,\n",
    "                'avg_sentiment': np.random.normal(0, 1),\n",
    "                'prev_week_mention_count': prev_week_count,\n",
    "                'change_percentage': change_pct\n",
    "            })\n",
    "    \n",
    "    return pd.DataFrame(data)\n",
    "\n",
    "# Generate our sample data\n",
    "social_posts_df = generate_social_posts()\n",
    "stock_mentions_df = generate_stock_mentions(social_posts_df)\n",
    "trending_stocks_df = generate_trending_stocks()\n",
    "\n",
    "print(f\"Successfully loaded data:\\n- social_posts: {len(social_posts_df)} records\\n- stock_mentions: {len(stock_mentions_df)} records\\n- trending_stocks_weekly: {len(trending_stocks_df)} records\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 2. Initial Data Inspection\n",
    "Let's examine the structure and content of each table."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 3,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/html": [
       "<div>\n",
       "<style scoped>\n",
       "    .dataframe tbody tr th:only-of-type {\n",
       "        vertical-align: middle;\n",
       "    }\n",
       "    .dataframe tbody tr th {\n",
       "        vertical-align: top;\n",
       "    }\n",
       "    .dataframe thead th {\n",
       "        text-align: right;\n",
       "    }\n",
       "</style>\n",
       "<table border=\"1\" class=\"dataframe\">\n",
       "  <thead>\n",
       "    <tr style=\"text-align: right;\">\n",
       "      <th></th>\n",
       "      <th>id</th>\n",
       "      <th>platform</th>\n",
       "      <th>text</th>\n",
       "      <th>created_at</th>\n",
       "      <th>engagement_score</th>\n",
       "    </tr>\n",
       "  </thead>\n",
       "  <tbody>\n",
       "    <tr>\n",
       "      <th>0</th>\n",
       "      <td>post_1</td>\n",
       "      <td>Twitter</td>\n",
       "      <td>Sample post text 1 about stocks</td>\n",
       "      <td>2023-01-01 00:00:00</td>\n",
       "      <td>37.454012</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>1</th>\n",
       "      <td>post_2</td>\n",
       "      <td>Reddit</td>\n",
       "      <td>Sample post text 2 about stocks</td>\n",
       "      <td>2023-01-01 01:00:00</td>\n",
       "      <td>95.071431</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>2</th>\n",
       "      <td>post_3</td>\n",
       "      <td>Twitter</td>\n",
       "      <td>Sample post text 3 about stocks</td>\n",
       "      <td>2023-01-01 02:00:00</td>\n",
       "      <td>73.199394</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>3</th>\n",
       "      <td>post_4</td>\n",
       "      <td>StockTwits</td>\n",
       "      <td>Sample post text 4 about stocks</td>\n",
       "      <td>2023-01-01 03:00:00</td>\n",
       "      <td>59.865848</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>4</th>\n",
       "      <td>post_5</td>\n",
       "      <td>Twitter</td>\n",
       "      <td>Sample post text 5 about stocks</td>\n",
       "      <td>2023-01-01 04:00:00</td>\n",
       "      <td>15.601864</td>\n",
       "    </tr>\n",
       "  </tbody>\n",
       "</table>\n",
       "</div>"
      ],
      "text/plain": [
       "       id    platform                             text           created_at  \\\n",
       "0  post_1     Twitter  Sample post text 1 about stocks 2023-01-01 00:00:00   \n",
       "1  post_2      Reddit  Sample post text 2 about stocks 2023-01-01 01:00:00   \n",
       "2  post_3     Twitter  Sample post text 3 about stocks 2023-01-01 02:00:00   \n",
       "3  post_4  StockTwits  Sample post text 4 about stocks 2023-01-01 03:00:00   \n",
       "4  post_5     Twitter  Sample post text 5 about stocks 2023-01-01 04:00:00   \n",
       "\n",
       "   engagement_score  \n",
       "0         37.454012  \n",
       "1         95.071431  \n",
       "2         73.199394  \n",
       "3         59.865848  \n",
       "4         15.601864  "
      ]
     },
     "execution_count": 3,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "# View a sample of social_posts\n",
    "social_posts_df.head()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 4,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/html": [
       "<div>\n",
       "<style scoped>\n",
       "    .dataframe tbody tr th:only-of-type {\n",
       "        vertical-align: middle;\n",
       "    }\n",
       "    .dataframe tbody tr th {\n",
       "        vertical-align: top;\n",
       "    }\n",
       "    .dataframe thead th {\n",
       "        text-align: right;\n",
       "    }\n",
       "</style>\n",
       "<table border=\"1\" class=\"dataframe\">\n",
       "  <thead>\n",
       "    <tr style=\"text-align: right;\">\n",
       "      <th></th>\n",
       "      <th>post_id</th>\n",
       "      <th>ticker</th>\n",
       "      <th>sentiment_score</th>\n",
       "      <th>created_at</th>\n",
       "    </tr>\n",
       "  </thead>\n",
       "  <tbody>\n",
       "    <tr>\n",
       "      <th>0</th>\n",
       "      <td>post_3957</td>\n",
       "      <td>AAPL</td>\n",
       "      <td>-0.505754</td>\n",
       "      <td>2023-01-31 12:00:00</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>1</th>\n",
       "      <td>post_1331</td>\n",
       "      <td>MSFT</td>\n",
       "      <td>0.400157</td>\n",
       "      <td>2023-01-14 03:00:00</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>2</th>\n",
       "      <td>post_3340</td>\n",
       "      <td>GOOGL</td>\n",
       "      <td>1.264906</td>\n",
       "      <td>2023-01-26 04:00:00</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>3</th>\n",
       "      <td>post_2415</td>\n",
       "      <td>AAPL</td>\n",
       "      <td>-2.071548</td>\n",
       "      <td>2023-01-22 07:00:00</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>4</th>\n",
       "      <td>post_1091</td>\n",
       "      <td>AAPL</td>\n",
       "      <td>1.336626</td>\n",
       "      <td>2023-01-11 19:00:00</td>\n",
       "    </tr>\n",
       "  </tbody>\n",
       "</table>\n",
       "</div>"
      ],
      "text/plain": [
       "     post_id ticker  sentiment_score          created_at\n",
       "0  post_3957   AAPL        -0.505754 2023-01-31 12:00:00\n",
       "1  post_1331   MSFT         0.400157 2023-01-14 03:00:00\n",
       "2  post_3340  GOOGL         1.264906 2023-01-26 04:00:00\n",
       "3  post_2415   AAPL        -2.071548 2023-01-22 07:00:00\n",
       "4  post_1091   AAPL         1.336626 2023-01-11 19:00:00"
      ]
     },
     "execution_count": 4,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "# View a sample of stock_mentions\n",
    "stock_mentions_df.head()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 5,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/html": [
       "<div>\n",
       "<style scoped>\n",
       "    .dataframe tbody tr th:only-of-type {\n",
       "        vertical-align: middle;\n",
       "    }\n",
       "    .dataframe tbody tr th {\n",
       "        vertical-align: top;\n",
       "    }\n",
       "    .dataframe thead th {\n",
       "        text-align: right;\n",
       "    }\n",
       "</style>\n",
       "<table border=\"1\" class=\"dataframe\">\n",
       "  <thead>\n",
       "    <tr style=\"text-align: right;\">\n",
       "      <th></th>\n",
       "      <th>week_ending</th>\n",
       "      <th>ticker</th>\n",
       "      <th>mention_count</th>\n",
       "      <th>avg_sentiment</th>\n",
       "      <th>prev_week_mention_count</th>\n",
       "      <th>change_percentage</th>\n",
       "    </tr>\n",
       "  </thead>\n",
       "  <tbody>\n",
       "    <tr>\n",
       "      <th>0</th>\n",
       "      <td>2023-01-08</td>\n",
       "      <td>AAPL</td>\n",
       "      <td>694</td>\n",
       "      <td>-0.203543</td>\n",
       "      <td>437</td>\n",
       "      <td>58.810069</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>1</th>\n",
       "      <td>2023-01-08</td>\n",
       "      <td>MSFT</td>\n",
       "      <td>324</td>\n",
       "      <td>0.535987</td>\n",
       "      <td>908</td>\n",
       "      <td>-64.317181</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>2</th>\n",
       "      <td>2023-01-08</td>\n",
       "      <td>GOOGL</td>\n",
       "      <td>700</td>\n",
       "      <td>-0.419153</td>\n",
       "      <td>458</td>\n",
       "      <td>52.838428</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>3</th>\n",
       "      <td>2023-01-08</td>\n",
       "      <td>AMZN</td>\n",
       "      <td>891</td>\n",
       "      <td>-0.577569</td>\n",
       "      <td>698</td>\n",
       "      <td>27.650430</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>4</th>\n",
       "      <td>2023-01-08</td>\n",
       "      <td>TSLA</td>\n",
       "      <td>615</td>\n",
       "      <td>-0.301924</td>\n",
       "      <td>352</td>\n",
       "      <td>74.715909</td>\n",
       "    </tr>\n",
       "  </tbody>\n",
       "</table>\n",
       "</div>"
      ],
      "text/plain": [
       "  week_ending ticker  mention_count  avg_sentiment  prev_week_mention_count  \\\n",
       "0  2023-01-08   AAPL            694      -0.203543                      437   \n",
       "1  2023-01-08   MSFT            324       0.535987                      908   \n",
       "2  2023-01-08  GOOGL            700      -0.419153                      458   \n",
       "3  2023-01-08   AMZN            891      -0.577569                      698   \n",
       "4  2023-01-08   TSLA            615      -0.301924                      352   \n",
       "\n",
       "   change_percentage  \n",
       "0          58.810069  \n",
       "1         -64.317181  \n",
       "2          52.838428  \n",
       "3          27.650430  \n",
       "4          74.715909  "
      ]
     },
     "execution_count": 5,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "# View a sample of trending_stocks_weekly\n",
    "trending_stocks_df.head()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 6,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "social_posts column data types:\n",
      "id                   object\n",
      "platform             object\n",
      "text                 object\n",
      "created_at    datetime64[ns]\n",
      "engagement_score    float64\n",
      "dtype: object\n",
      "\n",
      "stock_mentions column data types:\n",
      "post_id             object\n",
      "ticker              object\n",
      "sentiment_score    float64\n",
      "created_at    datetime64[ns]\n",
      "dtype: object\n",
      "\n",
      "trending_stocks_weekly column data types:\n",
      "week_ending                datetime64[ns]\n",
      "ticker                            object\n",
      "mention_count                      int64\n",
      "avg_sentiment                    float64\n",
      "prev_week_mention_count           int64\n",
      "change_percentage                float64\n",
      "dtype: object\n"
     ]
    }
   ],
   "source": [
    "# Check data types for each table\n",
    "print(\"social_posts column data types:\")\n",
    "print(social_posts_df.dtypes)\n",
    "print(\"\\nstock_mentions column data types:\")\n",
    "print(stock_mentions_df.dtypes)\n",
    "print(\"\\ntrending_stocks_weekly column data types:\")\n",
    "print(trending_stocks_df.dtypes)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 7,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Date range for social_posts: 2023-01-01 00:00:00 to 2023-03-18 11:00:00\n",
      "Date range for stock_mentions: 2023-01-01 00:00:00 to 2023-03-18 11:00:00\n",
      "Date range for trending_stocks_weekly: 2023-01-08 00:00:00 to 2023-03-26 00:00:00\n"
     ]
    }
   ],
   "source": [
    "# Check date ranges for each table\n",
    "print(f\"Date range for social_posts: {social_posts_df['created_at'].min()} to {social_posts_df['created_at'].max()}\")\n",
    "print(f\"Date range for stock_mentions: {stock_mentions_df['created_at'].min()} to {stock_mentions_df['created_at'].max()}\")\n",
    "print(f\"Date range for trending_stocks_weekly: {trending_stocks_df['week_ending'].min()} to {trending_stocks_df['week_ending'].max()}\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 3. Data Quality Validation\n",
    "Let's perform a series of validation checks on our data."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 8,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/html": [
       "<div>\n",
       "<style scoped>\n",
       "    .dataframe tbody tr th:only-of-type {\n",
       "        vertical-align: middle;\n",
       "    }\n",
       "    .dataframe tbody tr th {\n",
       "        vertical-align: top;\n",
       "    }\n",
       "    .dataframe thead th {\n",
       "        text-align: right;\n",
       "    }\n",
       "</style>\n",
       "<table border=\"1\" class=\"dataframe\">\n",
       "  <thead>\n",
       "    <tr style=\"text-align: right;\">\n",
       "      <th></th>\n",
       "      <th>Check</th>\n",
       "      <th>Result</th>\n",
       "    </tr>\n",
       "  </thead>\n",
       "  <tbody>\n",
       "    <tr>\n",
       "      <th>0</th>\n",
       "      <td>Missing values in social_posts</td>\n",
       "      <td>0</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>1</th>\n",
       "      <td>Missing values in stock_mentions</td>\n",
       "      <td>0</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>2</th>\n",
       "      <td>Missing values in trending_stocks_weekly</td>\n",
       "      <td>0</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>3</th>\n",
       "      <td>Duplicate post IDs</td>\n",
       "      <td>0</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>4</th>\n",
       "      <td>Duplicate post_id/ticker combinations</td>\n",
       "      <td>9</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>5</th>\n",
       "      <td>Stock mentions referencing non-existent posts</td>\n",
       "      <td>0</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>6</th>\n",
       "      <td>Posts with invalid engagement scores (< 0 or > 100)</td>\n",
       "      <td>0</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>7</th>\n",
       "      <td>Stock mentions with extreme sentiment scores (< -5 or > 5)</td>\n",
       "      <td>14</td>\n",
       "    </tr>\n",
       "  </tbody>\n",
       "</table>\n",
       "</div>"
      ],
      "text/plain": [
       "                                                  Check Result\n",
       "0                        Missing values in social_posts      0\n",
       "1                      Missing values in stock_mentions      0\n",
       "2             Missing values in trending_stocks_weekly      0\n",
       "3                                    Duplicate post IDs      0\n",
       "4                Duplicate post_id/ticker combinations      9\n",
       "5        Stock mentions referencing non-existent posts      0\n",
       "6  Posts with invalid engagement scores (< 0 or > 100)      0\n",
       "7  Stock mentions with extreme sentiment scores (< -5 or > 5)     14"
      ]
     },
     "execution_count": 8,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "# Validate data quality\n",
    "validation_checks = []\n",
    "\n",
    "# Check for missing values\n",
    "validation_checks.append((\"Missing values in social_posts\", social_posts_df.isnull().sum().sum()))\n",
    "validation_checks.append((\"Missing values in stock_mentions\", stock_mentions_df.isnull().sum().sum()))\n",
    "validation_checks.append((\"Missing values in trending_stocks_weekly\", trending_stocks_df.isnull().sum().sum()))\n",
    "\n",
    "# Check for duplicate IDs\n",
    "validation_checks.append((\"Duplicate post IDs\", social_posts_df['id'].duplicated().sum()))\n",
    "\n",
    "# Check for duplicate post_id/ticker combinations\n",
    "validation_checks.append((\"Duplicate post_id/ticker combinations\", \n",
    "                        stock_mentions_df.duplicated(['post_id', 'ticker']).sum()))\n",
    "\n",
    "# Check referential integrity\n",
    "posts_in_mentions = set(stock_mentions_df['post_id'].unique())\n",
    "posts_in_posts = set(social_posts_df['id'].unique())\n",
    "orphaned_mentions = posts_in_mentions - posts_in_posts\n",
    "validation_checks.append((\"Stock mentions referencing non-existent posts\", len(orphaned_mentions)))\n",
    "\n",
    "# Check for invalid engagement scores\n",
    "invalid_engagement = ((social_posts_df['engagement_score'] < 0) | \n",
    "                     (social_posts_df['engagement_score'] > 100)).sum()\n",
    "validation_checks.append((\"Posts with invalid engagement scores (< 0 or > 100)\", invalid_engagement))\n",
    "\n",
    "# Check for extreme sentiment scores\n",
    "extreme_sentiment = ((stock_mentions_df['sentiment_score'] < -5) | \n",
    "                    (stock_mentions_df['sentiment_score'] > 5)).sum()\n",
    "validation_checks.append((\"Stock mentions with extreme sentiment scores (< -5 or > 5)\", extreme_sentiment))\n",
    "\n",
    "# Display validation results\n",
    "pd.DataFrame(validation_checks, columns=['Check', 'Result'])"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 9,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Platform distribution in social_posts:\n"
     ]
    },
    {
     "data": {
      "text/plain": [
       "Twitter       2019\n",
       "Reddit        1501\n",
       "StockTwits     927\n",
       "LinkedIn       289\n",
       "Facebook       264\n",
       "Name: count, dtype: int64"
      ]
     },
     "execution_count": 9,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "# Check platform distribution\n",
    "print(\"Platform distribution in social_posts:\")\n",
    "social_posts_df['platform'].value_counts()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 10,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Ticker distribution in stock_mentions:\n"
     ]
    },
    {
     "data": {
      "text/plain": [
       "AAPL     1853\n",
       "MSFT     1525\n",
       "GOOGL    1151\n",
       "AMZN      744\n",
       "TSLA      751\n",
       "META      722\n",
       "NFLX      368\n",
       "NVDA      368\n",
       "Name: count, dtype: int64"
      ]
     },
     "execution_count": 10,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "# Check ticker distribution\n",
    "print(\"Ticker distribution in stock_mentions:\")\n",
    "stock_mentions_df['ticker'].value_counts()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Fix Data Quality Issues\n",
    "\n",
    "Let's address the issues identified in our validation checks."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 11,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Fixed duplicate post_id/ticker combinations. Removed 9 duplicate rows.\n",
      "Fixed extreme sentiment scores. Clipped 14 values to the range [-5, 5].\n"
     ]
    }
   ],
   "source": [
    "# Fix duplicate post_id/ticker combinations\n",
    "initial_rows = len(stock_mentions_df)\n",
    "stock_mentions_df = stock_mentions_df.drop_duplicates(['post_id', 'ticker'])\n",
    "removed_rows = initial_rows - len(stock_mentions_df)\n",
    "print(f\"Fixed duplicate post_id/ticker combinations. Removed {removed_rows} duplicate rows.\")\n",
    "\n",
    "# Fix extreme sentiment scores\n",
    "initial_extreme = extreme_sentiment\n",
    "stock_mentions_df['sentiment_score'] = stock_mentions_df['sentiment_score'].clip(-5, 5)\n",
    "new_extreme = ((stock_mentions_df['sentiment_score'] < -5) | \n",
    "              (stock_mentions_df['sentiment_score'] > 5)).sum()\n",
    "print(f\"Fixed extreme sentiment scores. Clipped {initial_extreme} values to the range [-5, 5].\")"
   ]
  }
]}`