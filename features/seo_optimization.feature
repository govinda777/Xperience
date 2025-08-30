Feature: SEO Optimization
  As a website owner
  I want my website to be optimized for search engines
  So that users can find my services easily

  Background:
    Given I am on the Xperience website

  Scenario: Home page SEO metadata
    Given I am on the home page
    Then the page title should be "Xperience - Mentoria para Empreendedores | IA do Empreendedor"
    And the meta description should contain "Transforme sua ideia em um negócio de sucesso"
    And the meta keywords should contain "mentoria empresarial, consultoria para empreendedores"
    And the canonical URL should be "https://xperience.com.br/"
    And the Open Graph image should be set

  Scenario: Plans page SEO metadata
    Given I am on the plans page
    Then the page title should be "Planos de Mentoria e Encubadora | Xperience"
    And the meta description should contain "Escolha o plano ideal para seu negócio"
    And the meta keywords should contain "planos de mentoria, encubadora de negócios"
    And the canonical URL should be "https://xperience.com.br/plans"

  Scenario: Structured data markup
    Given I am on any page
    Then I should see structured data for organization
    And I should see structured data for services
    And I should see structured data for contact information

  Scenario: Page loading performance
    Given I navigate to any page
    Then the page should load within 3 seconds
    And the Core Web Vitals should be within acceptable ranges
    And images should be optimized and lazy-loaded

  Scenario: Mobile SEO optimization
    Given I am on a mobile device
    Then the page should be mobile-friendly
    And the viewport should be properly configured
    And touch targets should be appropriately sized

  Scenario: URL structure optimization
    Given I navigate through the website
    Then URLs should be clean and descriptive
    And URLs should follow a logical hierarchy
    And URLs should not contain unnecessary parameters

  Scenario: Internal linking structure
    Given I am on any page
    Then I should see relevant internal links
    And the navigation should be consistent
    And important pages should be easily accessible

  Scenario: Image SEO optimization
    Given I am viewing pages with images
    Then all images should have alt text
    And image file names should be descriptive
    And images should be properly sized for web

  Scenario: Content optimization
    Given I am reading page content
    Then headings should follow proper hierarchy (H1, H2, H3)
    And content should include relevant keywords naturally
    And content should be unique and valuable

  Scenario: Social media integration
    Given I am on any page
    Then Open Graph tags should be properly set
    And Twitter Card tags should be configured
    And social sharing buttons should be available
