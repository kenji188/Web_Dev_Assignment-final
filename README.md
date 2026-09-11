My Bookshop

My Bookshop is a responsive and accessible e-commerce website designed for browsing and purchasing books. It was developed by Tyler Shaw as a university project for Website Development.

Key Features:
Accessible Navigation: The site includes a hidden "Skip to main content" link that becomes visible when users press the tab key, allowing people with motor ability issues to navigate easily.

Screen Reader Optimization: Interactive elements like the dark mode toggle utilize the aria-label attribute, while decorative elements are hidden using aria-hidden="true". The payment form includes explicit <label> tags and uses aria-live="polite" to read validation errors out loud automatically.

Dynamic Theme Toggling: A user-controlled button switches between Dark and Light modes using CSS variables to reduce eyestrain and aid users with light sensitivity. These preferences are saved locally using localStorage.

Real-time Input Masking: To support cognitive usability, the checkout form automatically formats credit card numbers with spaces every four digits and adds a slash to the expiry date as the user types.

Payment Validation: The JavaScript validates the card input to ensure it is a 16-digit MasterCard beginning with 51-55.

Live Search: Users can filter the homepage book grid dynamically by typing an author or title into the search bar.

API Integration: The checkout process sends JSON payment data to the mudfoot.doc.stu.mmu.ac.uk API and uses sessionStorage to pass data between pages.

File Structure:

index.html: The main landing page featuring the searchable grid of featured books.

pay.html: The checkout page containing the accessible payment form and order summary.

success.html: The confirmation screen displaying a success animation and the last four digits of the user's card.

style.css: The central stylesheet defining variables, layout grids, and dark mode rules.

script.js: The JavaScript logic handling session storage, theme toggling, form validation, input masking, and API POST requests.

Web Dev report.docx: The developer's documentation explaining the site's accessibility and usability implementations.
