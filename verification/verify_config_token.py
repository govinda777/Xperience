from playwright.sync_api import sync_playwright
import json

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Mock the API responses
    # Mock /api/health
    page.route("**/api/health", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps({
            "globalStatus": "healthy",
            "timestamp": "2023-10-27T10:00:00Z",
            "uptime": 12345,
            "totalLatency_ms": 50,
            "results": [],
            "summary": {"healthy": 0, "degraded": 0, "unhealthy": 0}
        })
    ))

    # Mock /api/health-config
    page.route("**/api/health-config", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps({
            "postgres": {"name": "Postgres", "enabled": True, "critical": True, "timeout": 5000, "thresholds": {"healthy": 100, "degraded": 500}},
            "redis": {"name": "Redis", "enabled": True, "critical": False, "timeout": 3000, "thresholds": {"healthy": 50, "degraded": 200}}
        })
    ))

    # Navigate to the health page.
    print("Navigating to /health...")
    page.goto("http://localhost:5173/health")

    # Wait for dashboard
    print("Waiting for dashboard title...")
    page.wait_for_selector("text=Xperience - Health Dashboard", timeout=10000)

    # Click on "Configurar" button
    print("Clicking 'Configurar'...")
    page.click("text=Configurar")

    # Wait for Config Panel
    print("Waiting for Config Panel...")
    try:
        page.wait_for_selector("text=Configuração de Serviços", timeout=5000)
        print("Config Panel visible.")
    except Exception as e:
        print(f"Config Panel not found: {e}")
        page.screenshot(path="verification/config_error.png")
        raise e

    # Check for Token Input
    print("Checking for Token Input...")
    # Use a more specific locator if possible, or retry
    # Placeholder is "Token para salvar"
    token_input = page.get_by_placeholder("Token para salvar")

    if token_input.is_visible():
        print("SUCCESS: Token input is visible.")
    else:
        print("FAILURE: Token input is NOT visible.")

    # Screenshot
    page.screenshot(path="verification/health_config_panel.png")
    print("Screenshot saved to verification/health_config_panel.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
