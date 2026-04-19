import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy — Craftick",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F5F0]">
        <div className="pt-36 pb-20 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-[family-name:var(--font-heading)] text-4xl text-[#1C1C1C] font-light mb-8">
              Privacy Policy
            </h1>
            <div className="prose prose-sm text-[#6B6560] font-[family-name:var(--font-body)] space-y-4">
              <p>
                We operate as{" "}
                <a
                  href="https://craftick.in"
                  className="text-[#B5903A] hover:underline"
                >
                  http://www.craftick.in
                </a>
                . This page informs you of our policies regarding the collection, use and disclosure of Personal Information we receive from users of the Site.
              </p>
              <p>
                We use your Personal Information only for providing and improving the Site. By using the Site, you agree to the collection and use of information in accordance with this policy.
              </p>
              <p>
                While using our Site, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to your name (&quot;Personal Information&quot;).
              </p>
              <p>
                We may use your Personal Information to contact you with newsletters, marketing or promotional materials and other information.
              </p>
              <p>
                We reserve the right to update or change our Privacy Policy at any time and you should check this Privacy Policy periodically. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy.
              </p>
              <p>
                If you have any questions about this Privacy Policy, please contact us.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
