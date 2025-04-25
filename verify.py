import csv
import cv2
import os
import requests

# Import CSV file
with open('trading_cards.csv', 'r') as csvfile:
    reader = csv.DictReader(csvfile)
    cards = [row for row in reader]

# Debugging: Print the first card to check keys
if cards:
    print("Sample card data:", cards[0])

# Helper function to download an image from a URL
def download_image(url, save_path):
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(save_path, 'wb') as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)
            return save_path
        else:
            raise Exception(f"Failed to download image: {url} (Status code: {response.status_code})")
    except Exception as e:
        print(f"Error downloading image from {url}: {e}")
        return None

# Computer Vision Scan
def scan_card(card):
    try:
        # Download the image locally
        image_url = card['front_image']
        local_image_path = f"temp_{os.path.basename(image_url)}"
        local_image_path = download_image(image_url, local_image_path)
        
        if not local_image_path:
            raise FileNotFoundError(f"Image could not be downloaded: {image_url}")
        
        # Read the image
        img_bgr = cv2.imread(local_image_path)
        if img_bgr is None:
            raise FileNotFoundError(f"Image not found: {local_image_path}")
        
        # Convert to grayscale
        img_gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        
        # Apply thresholding
        _, img_binary = cv2.threshold(img_gray, 1, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        
        # Clean up the downloaded image
        os.remove(local_image_path)
        
        return img_binary
    except Exception as e:
        print(f"Error scanning card {card.get('name', 'Unknown')}: {e}")
        return None

# Search Database and log new cards
def search_database(card, img_binary):
    try:
        # Placeholder for actual database comparison logic
        if img_binary is not None:
            print(f"Processing card: {card.get('name', 'Unknown')}")
        else:
            print(f"Skipping card {card.get('name', 'Unknown')} due to scan error.")
    except Exception as e:
        print(f"Error searching database for card {card.get('name', 'Unknown')}: {e}")

# Main Program
if __name__ == "__main__":
    for card in cards:
        img_binary = scan_card(card)
        search_database(card, img_binary)