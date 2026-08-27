import os
from PIL import Image
import numpy as np

def make_transparent(input_path, output_paths):
    img = Image.open(input_path).convert('RGBA')
    arr = np.array(img, dtype=np.float32)
    H, W, _ = arr.shape
    cx, cy = W / 2.0, H / 2.0

    r = arr[:, :, 0]
    g = arr[:, :, 1]
    b = arr[:, :, 2]

    # Calculate color saturation / chrominance distance from gray
    chroma = np.maximum(np.abs(r - g), np.maximum(np.abs(g - b), np.abs(r - b)))
    brightness = (r + g + b) / 3.0

    # Distance from center
    y_coords, x_coords = np.ogrid[:H, :W]
    dist_from_center = np.sqrt((x_coords - cx) ** 2 + (y_coords - cy) ** 2)

    # 1. Identify checkerboard background colors:
    # Checkerboard Tone A (Light Gray): brightness around 205-225, low chroma
    is_gray_tile = (brightness >= 196) & (brightness <= 232) & (chroma < 15)
    # Checkerboard Tone B (White): brightness >= 244, low chroma
    is_white_tile = (brightness >= 243) & (chroma < 12)

    is_bg_color = (is_gray_tile | is_white_tile)

    # 2. Flood-fill / connected mask from outer edges to avoid removing internal whites/grays
    from scipy.ndimage import binary_fill_holes, binary_dilation, binary_erosion
    # We can use simple BFS flood-fill if scipy is or isn't available
    from collections import deque

    bg_mask = np.zeros((H, W), dtype=bool)
    visited = np.zeros((H, W), dtype=bool)
    queue = deque()

    # Seed from all 4 boundaries
    for x in range(W):
        if is_bg_color[0, x]:
            queue.append((0, x))
            visited[0, x] = True
        if is_bg_color[H-1, x]:
            queue.append((H-1, x))
            visited[H-1, x] = True

    for y in range(H):
        if is_bg_color[y, 0] and not visited[y, 0]:
            queue.append((y, 0))
            visited[y, 0] = True
        if is_bg_color[y, W-1] and not visited[y, W-1]:
            queue.append((y, W-1))
            visited[y, W-1] = True

    # 8-connectivity BFS
    neighbors = [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)]
    while queue:
        cy_curr, cx_curr = queue.popleft()
        bg_mask[cy_curr, cx_curr] = True

        for dy, dx in neighbors:
            ny, nx = cy_curr + dy, cx_curr + dx
            if 0 <= ny < H and 0 <= nx < W and not visited[ny, nx]:
                # Don't flood fill into central avatar area (dist < 195)
                if dist_from_center[ny, nx] > 190 and is_bg_color[ny, nx]:
                    visited[ny, nx] = True
                    queue.append((ny, nx))
                elif dist_from_center[ny, nx] > 190 and chroma[ny, nx] < 8 and brightness[ny, nx] > 190:
                    visited[ny, nx] = True
                    queue.append((ny, nx))

    # Also catch isolated background checkerboard squares between circuit branches
    # Outside the central avatar, any pixel matching checkerboard tones with low chroma is background
    isolated_bg = (dist_from_center > 210) & is_bg_color
    bg_mask = bg_mask | isolated_bg

    # Create smooth alpha channel
    alpha = np.ones((H, W), dtype=np.uint8) * 255
    alpha[bg_mask] = 0

    # Smooth transition around circuit borders
    # For pixels adjacent to transparent pixels, apply soft anti-aliasing
    for step in range(2):
        near_edge = np.zeros_like(bg_mask)
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            shifted = np.roll(np.roll(bg_mask, dy, axis=0), dx, axis=1)
            near_edge |= (shifted & ~bg_mask & (dist_from_center > 200))
        
        # If it has low chroma and high brightness, soften alpha
        soften = near_edge & (chroma < 20) & (brightness > 180)
        alpha[soften] = np.minimum(alpha[soften], np.clip((chroma[soften] / 20.0) * 255, 0, 255).astype(np.uint8))

    # Always ensure central face has 100% solid opacity
    face_mask = dist_from_center <= 200
    alpha[face_mask] = 255

    result_arr = np.dstack((arr[:, :, :3].astype(np.uint8), alpha))
    result_img = Image.fromarray(result_arr, 'RGBA')

    for out_path in output_paths:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        result_img.save(out_path, format='PNG')
        print(f"Saved transparent image to: {out_path}")

if __name__ == '__main__':
    make_transparent('src/assets/joinapp.jpg', [
        'src/assets/joinapp.png',
        'public/joinapp.png'
    ])
