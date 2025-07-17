import { Page, expect } from "@playwright/test";

export async function acceptInitialCookies(page: Page) {
  console.log("Attempting to accept initial cookie consent dialog...");
  const consentDialog = page.locator(
    'div.fc-dialog.fc-choice-dialog[role="dialog"][aria-label="Software Testing Board asks for your consent to use your personal data to:"]',
  );
  const consentButton = consentDialog.locator(
    "button.fc-button.fc-cta-consent.fc-primary-button p.fc-button-label",
    { hasText: "Consent" },
  );
  try {
    await expect(consentDialog).toBeVisible({ timeout: 15000 });
    console.log("Initial cookie consent dialog is visible.");

    await expect(consentButton).toBeEnabled({ timeout: 10000 });
    await expect(consentButton).toBeVisible({ timeout: 10000 });
    console.log("Consent button is interactable. Clicking it...");

    await consentButton.click();
    console.log("Consent button clicked.");

    await expect(consentDialog).not.toBeVisible({ timeout: 15000 });
    console.log("Initial cookie consent dialog successfully closed.");
  } catch (error) {
    console.warn(
      "Initial cookie consent dialog not found or not closed. Proceeding without explicit acceptance.",
      error,
    );
  }
}

export async function dismissAnnoyances(page: Page) {
  console.log("Running anti-annoyance cleanup...");

  const newsletterModal = page.locator(".modal-popup .action-close");
  try {
    await newsletterModal.waitFor({ state: "visible", timeout: 5000 });
    await newsletterModal.click();
    console.log("Closed newsletter popup.");
  } catch {
    console.log(" No newsletter popup found.");
  }

  await page.evaluate(() => {
    const banners = document.querySelectorAll(
      ".message.global.demo, .cookie-status-bar, .fc-dialog",
    );
    banners.forEach((b) => b.remove());
  });
  console.log("Demo/store overlays removed via JS.");

  const loadingMask = page.locator(".loading-mask");
  if (await loadingMask.isVisible().catch(() => false)) {
    await expect(loadingMask).toBeHidden({ timeout: 15000 });
    console.log("Loading mask hidden.");
  }
}
