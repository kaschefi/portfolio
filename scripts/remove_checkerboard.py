import os
from PIL import Image
import numpy as np
import scipy.ndimage as ndi

def make_transparent_cat(input_path, output_paths):
    img = Image.open(input_path).convert('RGB')
    arr = np.array(img, dtype=np.uint8)
    H, W, _ = arr.shape

    r = arr[:, :, 0].astype(np.float32)
    g = arr[:, :, 1].astype(np.float32)
    b = arr[:, :, 2].astype(np.float32)

    # Low chroma (grayscale) and high brightness (white / light-gray checkerboard tiles)
    chroma = np.maximum(np.abs(r - g), np.maximum(np.abs(g - b), np.abs(r - b)))
    brightness = (r + g + b) / 3.0

    # Checkerboard tiles: brightness >= 180 and chroma < 18
    is_checkerboard = (brightness >= 180) & (chroma < 18)

    # Find connected components of checkerboard pixels
    labeled, num_features = ndi.label(is_checkerboard)
    print(f"Found {num_features} potential checkerboard regions")

    # Border-touching components are definitely outer background
    border_mask = np.zeros((H, W), dtype=bool)
    border_mask[0, :] = True
    border_mask[-1, :] = True
    border_mask[:, 0] = True
    border_mask[:, -1] = True

    border_labels = np.unique(labeled[border_mask])
    border_labels = border_labels[border_labels > 0]

    bg_mask = np.isin(labeled, border_labels)

    # Cavities & trapped checkerboard pockets between ears/cats/paws
    for lbl in range(1, num_features + 1):
        if lbl not in border_labels:
            mask = (labeled == lbl)
            size = np.sum(mask)
            b_vals = brightness[mask]
            has_gray = np.any((b_vals >= 195) & (b_vals <= 225))
            has_white = np.any(b_vals >= 245)
            # Checkerboard pockets have both ~200 gray and ~255 white tiles
            if has_gray and has_white and size > 20:
                print(f"  Removing trapped checkerboard pocket #{lbl} ({size} pixels)")
                bg_mask |= mask

    # Alpha channel: 0 for background, 255 for cat artwork
    alpha = np.ones((H, W), dtype=np.uint8) * 255
    alpha[bg_mask] = 0

    from PIL import ImageEnhance
    base_rgb = Image.fromarray(arr, 'RGB')
    # Enhance contrast slightly to keep dark outlines deep and rich under 3D lighting
    enhanced_rgb = ImageEnhance.Contrast(base_rgb).enhance(1.12)
    enhanced_rgb = ImageEnhance.Color(enhanced_rgb).enhance(1.06)
    enhanced_arr = np.array(enhanced_rgb)

    result_arr = np.dstack((enhanced_arr, alpha))
    result_img = Image.fromarray(result_arr, 'RGBA')

    for out_path in output_paths:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        result_img.save(out_path, format='PNG')
        print(f"[OK] Saved transparent PNG to: {out_path}")

if __name__ == '__main__':
    make_transparent_cat('src/assets/cat.jpg', [
        'src/assets/claude_code.png',
        'public/claude_code.png',
        'src/assets/cat.png',
        'public/cat.png'
    ])
