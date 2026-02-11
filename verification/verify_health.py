from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the health page.
    # With VITE_MOCK_AUTH=true, we should be logged in automatically.
    print("Navigating to /health...")
    page.goto("http://localhost:5173/health")

    # Wait for the page to load
    # We expect to see "Xperience - Health Dashboard"
    print("Waiting for dashboard title...")
    try:
        page.wait_for_selector("text=Xperience - Health Dashboard", timeout=10000)
        print("Dashboard title found.")
    except Exception as e:
        print(f"Dashboard title not found: {e}")
        # Take screenshot anyway to see what's there
        page.screenshot(path="verification/health_error.png")
        # Check if "Acesso Restrito" is visible
        if page.is_visible("text=Acesso Restrito"):
             print("FAILURE: 'Acesso Restrito' is still visible!")
        else:
             print("SUCCESS: 'Acesso Restrito' is NOT visible.")

    # Check for "Acesso Restrito" specifically
    is_restricted = page.is_visible("text=Acesso Restrito")
    if is_restricted:
        print("FAILURE: 'Acesso Restrito' prompt is visible.")
    else:
        print("SUCCESS: 'Acesso Restrito' prompt is NOT visible.")

    # Take a screenshot
    page.screenshot(path="verification/health_dashboard.png")
    print("Screenshot saved to verification/health_dashboard.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
