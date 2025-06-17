import cv2
import numpy as np
import os

categories = [  # Chat Gipgip
    { "name": "General", "color": "rgba(32, 212, 140, 1)" },
    { "name": "Food", "color": "rgba(98, 240, 33, 1)" },
    { "name": "Car", "color": "rgba(254, 231, 21, 1)" },
    { "name": "Entertainment", "color": "rgba(225, 70, 13, 1)" },
    { "name": "Groceries", "color": "rgba(32, 98, 221, 1)" },
    { "name": "Flights", "color": "rgba(235, 148, 19, 1)" },
    { "name": "Accommodations", "color": "rgba(255, 9, 222, 1)" },
    { "name": "Shopping", "color": "rgba(20, 233, 233, 1)" },
    { "name": "Fees", "color": "rgba(255, 0, 0, 1)" },
    { "name": "Other", "color": "rgba(197, 197, 197, 1)" }
]


def rgba_string_to_bgr_tuple(rgba_str):
    rgba = rgba_str.replace("rgba(", "").replace(")", "").split(",")
    r, g, b = map(int, rgba[:3])
    return (b, g, r)  # OpenCV uses BGR


icons = os.listdir()
for cat in categories:
    icon = f'{cat["name"].lower()}.png'
    color_bgr = rgba_string_to_bgr_tuple(cat["color"])
    print(icon)
    img = cv2.imread(icon, cv2.IMREAD_UNCHANGED)
    if img is None:
        print(f"Image {icon} not found or failed to load.")
        continue

    if img.shape[2] != 4:
        print(f"Image {icon} does not have an alpha channel.")
        continue

    # Split into color and alpha channels
    b, g, r, a = cv2.split(img)

    # Create mask for non-transparent pixels
    mask = a > 0

    # Create new BGR layer filled with target color
    new_bgr = np.zeros_like(img[:, :, :3])
    new_bgr[:, :] = color_bgr

    # Apply the new color to the non-transparent parts
    img[mask] = np.concatenate((new_bgr[mask], a[mask, np.newaxis]), axis=1)

    # Save the updated image (overwrite or rename if needed)
    cv2.imwrite(f'colored{cat["name"]}.png', img)

print("✅ All icons recolored.")
