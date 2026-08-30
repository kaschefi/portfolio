import os
from PIL import Image

def convert(src, dst, quality=88, lossless=False):
    if not os.path.exists(src):
        return
    with Image.open(src) as im:
        if lossless:
            im.save(dst, 'WEBP', lossless=True, method=6)
        else:
            im.save(dst, 'WEBP', quality=quality, method=6)
    
    orig_kb = os.path.getsize(src) / 1024
    new_kb = os.path.getsize(dst) / 1024
    print(f"[OPTIMIZED] {src} ({orig_kb:.1f} KB) -> {dst} ({new_kb:.1f} KB) [-{(1 - new_kb/orig_kb)*100:.1f}%]")

# 1. Public assets
public_conversions = [
    ('public/cat.png', 'public/cat.webp', 85, False),
    ('public/claude_code.png', 'public/claude_code.webp', 85, False),
    ('public/cozmo_hardware_sketch.png', 'public/cozmo_hardware_sketch.webp', 85, False),
    ('public/joinapp.png', 'public/joinapp.webp', 88, False),
    ('public/robotIcon.png', 'public/robotIcon.webp', 88, False),
    ('public/router_benchmark.png', 'public/router_benchmark.webp', 90, False),
    ('public/sawyerRobot.png', 'public/sawyerRobot.webp', 88, False),
    ('public/sawyerRobot_clean.png', 'public/sawyerRobot_clean.webp', 88, False),
    ('public/sawyerRobot_full.png', 'public/sawyerRobot_full.webp', 88, False),
    ('public/xcode_waveform.png', 'public/xcode_waveform.webp', 85, False),
    ('public/antigravity_icon.png', 'public/antigravity_icon.webp', 92, False),
    ('public/moka-icon.png', 'public/moka-icon.webp', 92, False),
    ('public/moka_icon.png', 'public/moka_icon.webp', 92, False),
]

for src, dst, q, loss in public_conversions:
    convert(src, dst, quality=q, lossless=loss)

# 2. Src/assets
src_conversions = [
    ('src/assets/antigravity_icon.png', 'src/assets/antigravity_icon.webp', 92, False),
    ('src/assets/cat.png', 'src/assets/cat.webp', 85, False),
    ('src/assets/claude_code.png', 'src/assets/claude_code.webp', 85, False),
    ('src/assets/joinapp.png', 'src/assets/joinapp.webp', 88, False),
    ('src/assets/router_benchmark.png', 'src/assets/router_benchmark.webp', 90, False),
    ('src/assets/sawyerRobot.png', 'src/assets/sawyerRobot.webp', 88, False),
    ('src/assets/me.png', 'src/assets/me.webp', 85, False),
    ('src/assets/robotme.png', 'src/assets/robotme.webp', 85, False),
]

for src, dst, q, loss in src_conversions:
    convert(src, dst, quality=q, lossless=loss)

print("Image conversion completed successfully.")
