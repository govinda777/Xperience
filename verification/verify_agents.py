from playwright.sync_api import sync_playwright, expect

def verify_agents_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Navigate to Agents page
        print("Navigating to /agents...")
        try:
            page.goto("http://localhost:5173/agents")
        except Exception as e:
            print(f"Error navigating: {e}")
            return

        # 2. Verify List View
        print("Verifying List View...")
        expect(page.get_by_text("Meus Agentes")).to_be_visible()

        # Check for empty state button or header button
        # Assuming empty state first
        create_btn = page.get_by_role("button", name="Novo Agente").first
        if not create_btn.is_visible():
             create_btn = page.get_by_text("Criar Primeiro Agente")

        expect(create_btn).to_be_visible()

        # 3. Open Modal
        print("Opening Modal...")
        create_btn.click()

        expect(page.get_by_text("Criar Novo Agente")).to_be_visible()

        # 4. Fill Form
        print("Filling Form...")
        page.get_by_placeholder("Ex: Consultor de Vendas").fill("Playwright Bot")
        page.get_by_placeholder("Ex: Especialista em Marketing").fill("Tester")

        # Select Command
        # The select is styled, but it's a <select> element.
        # We can select by value or label.
        page.select_option("select", value="new_project")

        # 5. Submit
        print("Submitting...")
        page.get_by_role("button", name="Criar Agente").click()

        # 6. Verify Chat Interface
        print("Verifying Chat...")
        # Should see agent name
        expect(page.get_by_role("heading", name="Playwright Bot")).to_be_visible()
        # Should see input
        expect(page.get_by_placeholder("Digite sua mensagem...")).to_be_visible()

        # 7. Screenshot
        print("Taking screenshot...")
        page.screenshot(path="/home/jules/verification/agents_flow.png")

        browser.close()
        print("Verification complete.")

if __name__ == "__main__":
    verify_agents_flow()
