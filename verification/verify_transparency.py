from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Mock API /api/submissions
    page.route("**/api/submissions", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"submissions": [{"id": "sub_123", "nomeAnon": "Jo**", "emailAnon": "j**@e**.com", "mensagem": "Test Message Public View", "data": "2023-10-27T10:00:00Z"}], "total": 1}'
    ))

    # Mock API /api/leads (POST)
    page.route("**/api/leads", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"success": true, "id": "sub_generated_id"}'
    ))

    try:
        # 1. Verify Transparency Page
        print("Navigating to Transparency Page...")
        page.goto("http://localhost:4173/transparencia")
        expect(page.get_by_text("Transparência Xperience")).to_be_visible(timeout=10000)
        expect(page.get_by_text("Test Message Public View")).to_be_visible()
        page.screenshot(path="verification/transparency_page.png")
        print("Transparency Page Verified.")

        # 2. Verify Contact Form Submission
        print("Navigating to Contact Page...")
        page.goto("http://localhost:4173/contact")

        # Fill form
        # Scope to the contact form to avoid footer/newsletter conflict
        form = page.locator("form").first
        form.get_by_placeholder("Nome").fill("John Doe")
        form.get_by_placeholder("E-mail").fill("john@example.com")
        form.get_by_placeholder("Telefone").fill("1234567890")

        # Select segment (combobox or select)
        page.locator("select").select_option("retail")

        # Fill needs
        page.locator("textarea").fill("I need help with AI.")

        # Check terms
        page.get_by_role("checkbox").check()

        # Submit
        page.get_by_role("button", name="Enviar mensagem").click()

        # Verify Success Message and ID
        expect(page.get_by_text("Mensagem enviada com sucesso!")).to_be_visible()
        expect(page.get_by_text("ID Público: sub_generated_id")).to_be_visible()
        page.screenshot(path="verification/contact_success.png")
        print("Contact Form Verified.")

        # 3. Verify Leads Manager
        print("Navigating to Leads Manager...")
        page.goto("http://localhost:4173/leads")
        expect(page.get_by_text("Gerenciador de Submissões")).to_be_visible()
        expect(page.get_by_text("sub_123")).to_be_visible()
        page.screenshot(path="verification/leads_manager.png")
        print("Leads Manager Verified.")

    except Exception as e:
        print(f"Verification failed: {e}")
        page.screenshot(path="verification/error.png")
        raise e
    finally:
        browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
