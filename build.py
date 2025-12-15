import os
import subprocess
import shutil

# Configuration
PICS_DIR = 'pics'
ASSETS_DIR = 'assets'
HTML_FILE = 'index.html'
TARGET_HEIGHT = 600

def main():
    # Ensure assets dir exists (we keep existing assets like logo if any, but our script creates gallery_*)
    if not os.path.exists(ASSETS_DIR):
        os.makedirs(ASSETS_DIR)

    # Get list of images
    valid_extensions = ('.jpg', '.jpeg', '.png', '.webp')
    files = [f for f in os.listdir(PICS_DIR) if f.lower().endswith(valid_extensions)]
    files.sort() # Consistent order

    html_items = []

    print(f"Found {len(files)} images in {PICS_DIR}...")

    for i, filename in enumerate(files):
        source_path = os.path.join(PICS_DIR, filename)
        # Sanitized output filename
        dest_filename = f"gallery_{i+1}.jpg"
        dest_path = os.path.join(ASSETS_DIR, dest_filename)

        print(f"Processing {filename} -> {dest_filename}")

        # Use sips to resize (macOS built-in)
        # --resampleHeightWidthMax 1000 ensures the largest dimension is 1000px
        try:
            subprocess.run([
                'sips',
                '--resampleHeightWidthMax', '1000',
                '--setProperty', 'format', 'jpeg',
                source_path,
                '--out', dest_path
            ], check=True, stdout=subprocess.DEVNULL)
        except subprocess.CalledProcessError as e:
            print(f"Error processing {filename}: {e}")
            continue

        html_items.append(f'                <div class="carousel-item"><img src="assets/{dest_filename}" alt="Studio Swarts Project {i+1}"></div>')

    # Duplicate items for infinite loop (at least enough to cover screen width twice)
    # With 23 images, 2 sets is plenty.
    final_html_list = html_items + html_items

    # Update index.html
    with open(HTML_FILE, 'r') as f:
        content = f.read()

    start_marker = '<!-- CAROUSEL_START -->'
    end_marker = '<!-- CAROUSEL_END -->'

    if start_marker in content and end_marker in content:
        start_idx = content.find(start_marker) + len(start_marker)
        end_idx = content.find(end_marker)

        new_content = content[:start_idx] + '\n' + '\n'.join(final_html_list) + '\n                ' + content[end_idx:]

        with open(HTML_FILE, 'w') as f:
            f.write(new_content)
        print("Updated index.html with new images.")
    else:
        print("Could not find carousel markers in index.html")

if __name__ == '__main__':
    main()
