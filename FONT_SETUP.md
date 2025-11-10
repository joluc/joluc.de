# Font Setup Guide

## Current Font Configuration

Your website is currently configured with modern, professional fonts that have a similar aesthetic to Lelo:

### **Body Text: Inter**
- Clean, modern sans-serif
- Excellent readability
- Great for technical content
- Similar geometric feel to Lelo

### **Headings: Space Grotesk**
- Modern, geometric sans-serif
- Strong, professional appearance
- Perfect for headlines and titles
- Very similar to Lelo's aesthetic

## Using the Actual Lelo Font

If you decide to purchase the Lelo font from [Camelot Typefaces](https://camelottypefaces.com/), here's how to implement it:

### 1. Purchase and Download
- Visit [Camelot Typefaces](https://camelottypefaces.com/)
- Purchase the Lelo font license
- Download the font files (WOFF2 and WOFF formats)

### 2. Upload Font Files
Create a `fonts` directory in your `static` folder and upload the font files:
```
static/
  fonts/
    Lelo-Regular.woff2
    Lelo-Regular.woff
    Lelo-Medium.woff2
    Lelo-Medium.woff
    Lelo-Bold.woff2
    Lelo-Bold.woff
```

### 3. Update CSS
Uncomment the font-face declarations in `static/css/lelo-font.css` and update the file paths.

### 4. Update SCSS Variables
In `assets/sass/0-settings/_variables.scss`, update the font families:

```scss
// For body text
$base-font-family: 'Lelo', 'Inter', Helvetica Neue, Helvetica, Arial, sans-serif;

// For headings
$heading-font-family: 'Lelo', 'Space Grotesk', Helvetica Neue, Helvetica, Arial, sans-serif;
```

### 5. Include the CSS
Add the Lelo font CSS to your head.html:

```html
<link href="/css/lelo-font.css" rel="stylesheet">
```

## Alternative Free Fonts

If you want to try other free alternatives with a similar aesthetic:

### **Poppins** (Google Fonts)
- Modern, geometric sans-serif
- Great for both body and headings
- Very similar to Lelo

### **Nunito Sans** (Google Fonts)
- Clean, modern design
- Excellent readability
- Good alternative to Lelo

### **Work Sans** (Google Fonts)
- Professional, geometric design
- Great for technical content
- Similar to Lelo's aesthetic

## Current Font Benefits

The current font combination (Inter + Space Grotesk) offers:

- **Professional appearance** that matches your cloud engineering focus
- **Excellent readability** for technical content
- **Modern aesthetic** similar to Lelo
- **Fast loading** (Google Fonts optimization)
- **Cross-platform consistency**
- **No licensing costs**

## Font Loading Optimization

The current setup includes:
- Font preloading for faster rendering
- Font-display: swap for better performance
- Optimized font weights (300, 400, 500, 600, 700)

## Recommendations

For your cloud engineering and observability focus, I recommend:

1. **Keep the current setup** - It's professional, fast, and free
2. **Consider Lelo for branding** - If you want a unique look for your personal brand
3. **Test thoroughly** - Always test fonts across different devices and browsers

The current font combination provides an excellent foundation that's both professional and modern, perfectly suited for your cloud engineering expertise.
