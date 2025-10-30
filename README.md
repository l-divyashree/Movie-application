# 🎬 Movie Booking Application

> A production-ready movie booking web application similar to BookMyShow, built with React, Spring Boot, and MySQL.

![Application Overview](./screenshots/app-overview.png)

[![Build Status](https://github.com/l-divyashree/Movie-application/workflows/CI/CD/badge.svg)](https://github.com/l-divyashree/Movie-application/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)](https://spring.io/projects/spring-boot)

## 📸 Screenshots


## 🗺️ Roadmap

# CinemaFlix — Movie Booking Application

This repository contains the CinemaFlix movie booking web application (React frontend + Spring Boot backend). Below are curated screenshots for the User Dashboard and Admin Dashboard, plus instructions to add the images into the repository so they appear in the README.

If you already placed screenshots into the `./screenshots` folder, skip the copying step and simply commit.

---

## Screenshots

### User Dashboard

1. Overview / Hero

![User - Overview](./screenshots/user-overview-1.png)

2. Featured movies grid

![User - Grid 1](./screenshots/user-grid-1.png)

3. More movie cards

![User - Grid 2](./screenshots/user-grid-2.png)

4. Show selection / dates & shows

![User - Show Selection](./screenshots/user-show-selection.png)

5. Seat selection

![User - Seats](./screenshots/user-seats.png)

6. Payment summary

![User - Payment](./screenshots/user-payment.png)

---

### Admin Dashboard

1. Admin - Dashboard overview

![Admin - Overview](./screenshots/admin-overview-1.png)

2. Admin - Movies management

![Admin - Movies](./screenshots/admin-movies-1.png)

3. Admin - Shows management

![Admin - Shows](./screenshots/admin-shows-1.png)

4. Admin - Bookings list

![Admin - Bookings](./screenshots/admin-bookings-1.png)

5. Admin - Users list

![Admin - Users](./screenshots/admin-users-1.png)

6. Admin - Venues

![Admin - Venues](./screenshots/admin-venues-1.png)

7. Admin - Seats layout editor

![Admin - Seats Editor](./screenshots/admin-seats-1.png)

8. Admin - Analytics

![Admin - Analytics](./screenshots/admin-analytics-1.png)

---

## How to add your screenshots (Windows / PowerShell)

Run these commands in PowerShell (from the project root). They copy your screenshots into the repo `./screenshots` folder with friendly names used in this README.

> Tip: open PowerShell as the same user that owns the Pictures files (usually your user account).

```powershell
# Create screenshots folder if it doesn't exist
New-Item -ItemType Directory -Force -Path .\screenshots

# --- User dashboard images ---
Copy-Item "C:\Users\P12C4F3\OneDrive - Dayforce HCM Inc\Pictures\Screenshots\Screenshot 2025-10-30 105101.png" .\screenshots\user-overview-1.png
Copy-Item "C:\Users\P12C4F3\OneDrive - Dayforce HCM Inc\Pictures\Screenshots\Screenshot 2025-10-30 105116.png" .\screenshots\user-grid-1.png
Copy-Item "C:\Users\P12C4F3\OneDrive - Dayforce HCM Inc\Pictures\Screenshots\Screenshot 2025-10-30 105136.png" .\screenshots\user-grid-2.png
Copy-Item "C:\Users\P12C4F3\OneDrive - Dayforce HCM Inc\Pictures\Screenshots\Screenshot 2025-10-30 105147.png" .\screenshots\user-show-selection.png
Copy-Item "C:\Users\P12C4F3\OneDrive - Dayforce HCM Inc\Pictures\Screenshots\Screenshot 2025-10-30 105208.png" .\screenshots\user-seats.png
Copy-Item "C:\Users\P12C4F3\OneDrive - Dayforce HCM Inc\Pictures\Screenshots\Screenshot 2025-10-30 105232.png" .\screenshots\user-payment.png

# --- Admin dashboard images ---
Copy-Item "C:\Users\P12C4F3\OneDrive - Dayforce HCM Inc\Pictures\Screenshots\Screenshot 2025-10-30 104805.png" .\screenshots\admin-overview-1.png
Copy-Item "C:\Users\P12C4F3\OneDrive - Dayforce HCM Inc\Pictures\Screenshots\Screenshot 2025-10-30 104830.png" .\screenshots\admin-movies-1.png
Copy-Item "C:\Users\P12C4F3\OneDrive - Dayforce HCM Inc\Pictures\Screenshots\Screenshot 2025-10-30 104843.png" .\screenshots\admin-shows-1.png
Copy-Item "C:\Users\P12C4F3\OneDrive - Dayforce HCM Inc\Pictures\Screenshots\Screenshot 2025-10-30 104858.png" .\screenshots\admin-bookings-1.png
Copy-Item "C:\Users\P12C4F3\OneDrive - Dayforce HCM Inc\Pictures\Screenshots\Screenshot 2025-10-30 104910.png" .\screenshots\admin-users-1.png
Copy-Item "C:\Users\P12C4F3\OneDrive - Dayforce HCM Inc\Pictures\Screenshots\Screenshot 2025-10-30 104920.png" .\screenshots\admin-venues-1.png
Copy-Item "C:\Users\P12C4F3\OneDrive - Dayforce HCM Inc\Pictures\Screenshots\Screenshot 2025-10-30 104952.png" .\screenshots\admin-seats-1.png
Copy-Item "C:\Users\P12C4F3\OneDrive - Dayforce HCM Inc\Pictures\Screenshots\Screenshot 2025-10-30 105031.png" .\screenshots\admin-analytics-1.png
Copy-Item "C:\Users\P12C4F3\OneDrive - Dayforce HCM Inc\Pictures\Screenshots\Screenshot 2025-10-30 105043.png" .\screenshots\admin-more-1.png
```

After running the copy commands, add and commit the files with:

```powershell
git add screenshots/* README.md
git commit -m "Add screenshot gallery and README update"
git push origin main
```

---

## Notes & tips

- If an image is large, open it and save a compressed PNG or JPG to keep the repo size reasonable.
- If Git complains about file size, consider using Git LFS or hosting large images externally and linking to them.
- If you want me to embed specific captions or reorder images, tell me how you want them grouped and I will update `README.md`.

---

If you'd like, I can also provide:
- A small script to batch-compress images (PowerShell + ImageMagick or a Node script),
- An HTML gallery page inside the repo, or
- Automated Git LFS setup commands.

Run the PowerShell copy commands above and then push; tell me when it's done and I'll verify the README preview and suggest any layout tweaks.