from PIL import Image

def remove_magenta_background(sub_path, output_path):
    img = Image.open(sub_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    # Magenta screen color is roughly #FF00FF (255, 0, 255)
    for item in datas:
        # Strict magenta removal: High R/B, Low G
        if item[0] > 200 and item[2] > 200 and item[1] < 100:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)

    # Trim the transparent borders
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)

    img.save(output_path, "PNG")

if __name__ == "__main__":
    remove_magenta_background(
        "/Users/d071390/.gemini/antigravity/brain/f435e56a-a3ec-4574-a039-01fa38f1ba7e/joluc_lego_flat_side_v5_1768223673094.png",
        "/Users/d071390/dev/src/github.com/joluc/joluc.de/static/images/joluc_lego.png"
    )
