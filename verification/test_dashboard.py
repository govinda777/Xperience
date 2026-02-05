from playwright.sync_api import sync_playwright, expect

def verify_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to Dashboard
        # Since VITE_MOCK_AUTH is true, we should be authenticated
        print("Navigating to dashboard...")
        page.goto("http://localhost:5173/dashboard")

        # Wait for content to load
        page.wait_for_load_state("networkidle")

        # Assertions
        print("Checking for dashboard elements...")
        expect(page.get_by_role("heading", name="Área Logada")).to_be_visible()
        expect(page.get_by_role("heading", name="Agentes")).to_be_visible()
        expect(page.get_by_role("heading", name="Relatórios")).to_be_visible()
        expect(page.get_by_role("heading", name="Projetos")).to_be_visible()
        expect(page.get_by_role("heading", name="Configurações")).to_be_visible()

        print("Taking screenshot...")
        page.screenshot(path="verification/dashboard_restored.png")

        # Verify navigation to Agents
        print("Clicking Agentes...")
        page.get_by_role("heading", name="Agentes").click()
        page.wait_for_load_state("networkidle")

        print("Checking for Agents page content...")
        # Check for content from src/pages/Agents/index.tsx
        # It has <h1 className="text-3xl font-bold text-gray-800">Meus Agentes de IA</h1>
        expect(page.get_by_role("heading", name="Meus Agentes de IA")).to_be_visible()

        browser.close()
        print("Verification complete.")

if __name__ == "__main__":
    verify_dashboard()
