import { PageEnter } from "@/components/page-enter";
import { SectionHeader } from "@/components/section-header";

export default function TermsPage() {
  return (
    <PageEnter className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-7">
        <SectionHeader
          eyebrow="Legal"
          title="Terms of Service"
          description="Effective date: February 8, 2026. These terms govern your access to and use of the Ren Fujita website."
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-[#171b24] p-6 text-sm leading-7 text-muted">
        <div>
          <h2 className="text-base font-semibold text-white">1. Acceptance of Terms</h2>
          <p className="mt-1">
            By accessing this website, you agree to these Terms of Service. If you do not agree, please do not use the site.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-white">2. Content and Copyright</h2>
          <p className="mt-1">
            All photographs, text, and metadata on this website are the property of Ren Fujita unless otherwise stated. You may not copy,
            reproduce, distribute, sell, train AI models on, or republish any content without prior written permission.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-white">3. Permitted Use</h2>
          <p className="mt-1">
            You may browse publicly available content for personal, non-commercial viewing only. You must not scrape, automate bulk downloads,
            attempt to bypass access controls, or interfere with the operation or security of this website.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-white">4. Public and Private Content</h2>
          <p className="mt-1">
            Some content is intentionally private and visible only to the owner. Any attempt to access private photos, albums, or admin routes
            without authorization is strictly prohibited.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-white">5. Account Access</h2>
          <p className="mt-1">
            Administrative access is restricted to the site owner. Credential abuse, impersonation attempts, or unauthorized account access may
            result in blocked access and legal action where applicable.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-white">6. External Links and Third-Party Content</h2>
          <p className="mt-1">
            This website may contain links to third-party websites or image sources. Ren Fujita is not responsible for third-party content,
            policies, or availability.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-white">7. Disclaimer</h2>
          <p className="mt-1">
            This site is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. Availability, content, and features may
            change, pause, or be removed at any time without notice.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-white">8. Limitation of Liability</h2>
          <p className="mt-1">
            To the maximum extent permitted by law, Ren Fujita is not liable for any indirect, incidental, consequential, or special damages
            arising from your use of, or inability to use, this website.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-white">9. Changes to These Terms</h2>
          <p className="mt-1">
            These terms may be updated from time to time. The effective date will be revised when updates are made. Continued use of the site
            after updates constitutes acceptance of the revised terms.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-white">10. Governing Law</h2>
          <p className="mt-1">These terms are governed by the applicable laws of the owner&apos;s jurisdiction, without regard to conflict of law principles.</p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-white">11. Contact</h2>
          <p className="mt-1">For permissions, licensing, or legal inquiries, please contact the site owner directly.</p>
        </div>
      </section>
    </PageEnter>
  );
}
