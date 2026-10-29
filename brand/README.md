# brand

`logo.svg` is the header logo: Jeff's handwritten "JEFF BLANK" in yellow marker under "WRITTEN BY", on the right half of `handwriting/poster.pdf`. It was vectorized into one path with `fill="currentColor"`.

**To swap the logo** (for example, for the better handwriting sample that's coming), replace this one file and run `python3 build.py`.
- The build inlines the SVG into the header, so it takes the theme's ink color.
- Width is set in CSS (`.logo-svg`), and height follows the new file's viewBox.

Re-trace a new sample with `handwriting/derived/trace.py`: crop box, threshold 20, close 1.2, SIG=0.7 blur. Change the crop box and the color key to suit the new image.
