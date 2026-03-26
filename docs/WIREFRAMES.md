# UI Structure & Wireframes

This document details the screen structures, routing maps, and component hierarchies for both the Next.js Web Application and the React Native Expo Mobile App.

## Theme & Aesthetics Directive
- **Typography:** `Outfit` (for headings) and `Inter` (for body text). Excellent Greek rendering natively.
- **Colors:** Premium palette. E.g., Deep Navy (`#0A192F`) primary, vibrant interactive accents (Teal `#64FFDA` or Soft Orange `#FF6B6B`), standard clean white backdrops for data layers.
- **Micro-interactions:** Skeleton loaders, soft hover lift states for cards, and smooth modal fade-ins.

---

## 1. Web Application (Next.js)

### 1.1 App Routing Map
- `/` - Home Page
- `/search` - Main Search Platform (Map + List split screen)
- `/institute/[id]` - Unique Institute Profile 
- `/owner` - Owner Dashboard
- `/owner/institute/[id]/edit` - Institute Manager
- `/admin` - Super Admin Portal

### 1.2 Screen: Home Page (`/`)
**Goal:** High conversion, explain value proposition quickly.
- **Header:** Sticky Navbar with Logo, "For Owners", "Login / Signup" buttons.
- **Hero Section:**
  - Dynamic gradient background.
  - Headline: "Find the Best Tutors & Institutes Near You" (in Greek).
  - **Hero Search Bar:** 
    1. Input: Subject (Dropdown/Autocomplete)
    2. Input: Location (City/Area or "Use My Location" GPS button)
    3. Action: Search Button -> Directs to `/search`.
- **Top Categories (Grid):** Visual cards for Μαθηματικά, Ξένες Γλώσσες, etc.
- **Featured Institutes (Carousel):** Horizontal scroll of highly-rated/featured centers.
- **Footer:** Links, Privacy, Terms, Contact Admin.

### 1.3 Screen: Search Platform (`/search`)
**Goal:** Map-centric discovery platform.
*Layout:* Split Screen (Left: Filters & List List | Right: Interactive Map).
- **Left Panel:**
  - **Filter Bar:** Subject chips, Radius Slider (1, 3, 5, 10, 20km), Sort By (Distance, Best Match).
  - **Results Feed:** Vertical list of `InstituteCards`.
    - *InstituteCard Component:* Image thumbnail, Name, Nearest Branch distance (e.g., "1.2 km away"), Tags (Services). Action: Heart icon (Favorite).
- **Right Panel:**
  - Mapbox / Google Maps filling the viewport height.
  - Custom map markers (pins) representing branches. Clicking a pin highlights the card on the left.

### 1.4 Screen: Institute Profile (`/institute/[id]`)
**Goal:** Convert visitor into a lead via Contact form.
- **Header Section (Hero):** Cover Photo, Logo, Institute Name, "Verified" badge.
- **Content Splitting:**
  - **Main Column (70%):**
    - "About Us" text.
    - "Services Offered" layout (chips/bubbles).
    - "Branches & Schedules" UI (Dropdown or Tabs per branch). Shows map for each branch location.
  - **Sticky Sidebar (30%):**
    - Prominent Call-to-Action: "Send Request / Inquiry".
    - Phone Number Reveal button.
    - Email Address Reveal.
    - Floating Map of nearest branch.

### 1.5 Screen: Contact Modal / Slide-over
**Triggered from:** Institute Profile.
- Form Fields: Full Name, Email, Phone, Dropdown of Institute Services, Text Area.
- Action: "Submit Request".

---

## 2. Mobile App (React Native Expo)

### 2.1 Tab Navigation Structure
The core navigation operates via a Bottom Tab Navigator.
1. **Explore (Home/Search)**
2. **Favorites**
3. **Profile (Account/Settings)**

### 2.2 Screen: Explore (Default Tab)
- **Top Bar:** Search Input (Subject + Area) that drops down to a full-screen search view when tapped.
- **Floating Action Button (FAB):** "Map View" toggle.
- **Content:**
  - "Near Me" horizontal quick scroll. Requires automatic background GPS poll (with permission).
  - Vertical list of categories.
- **Map Mode:** Toggling the FAB flips the screen to a full Map interface with bottom sheet showing the highlighted pin's details.

### 2.3 Screen: Mobile Institute Profile
- Deep-linked from a search result.
- **Parallax Header:** Institute cover image stretching on pull-down.
- **Sticky Footer C-T-A:** A persistent bottom bar with "Call Now" (Initiates native dialer) and "Message" (Opens Contact Form).

---

## 3. Owner & Admin Portals (Role-based web views)

### 3.1 Owner Dashboard
- **Sidebar Navigation:** My Institutes, Contact Inquiries, Account Strategy.
- **Dashboard Home:** Metrics (Number of branches, services, unread contact requests).
- **Branch Editing UI:** 
  - Dynamic forms.
  - Map pin-dropper: Owner types address, map centers, owner securely drops the exact pinpoint to grab Latitude/Longitude for the database.

### 3.2 Admin Data Grid
- Heavy table layouts (shadcn/ui or MUI DataGrid equivalent).
- Fast toggles to "Approve" or "Reject" newly submitted Institutes.
