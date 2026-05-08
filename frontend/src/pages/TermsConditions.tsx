import React, { useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';

export function TermsConditions({ settings }: { settings: any }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "Revision Policy",
      content: "Revisions are contingent on the package selected. Clients can approach us for unlimited free amendments and we will revise their design with no extra charges, given that the design and concept remain intact. Revision turnaround time will be 48 hours."
    },
    {
      title: "Refund Policy",
      content: "Creative Orbit REFUND POLICY IS NOT APPLICABLE WHEN:\n\n• You choose a discounted coupon or you choose a promo/special service package\n• You have approved the initial design concept\n• You have requested revisions\n• You have canceled the order due to non-related reasons in regard to Creative Orbit and its policies\n• You have not contacted Creative Orbit for more than 2 weeks since the project initiated\n• You have violated Creative Orbit terms & conditions and privacy policy\n• You have approached another service provider or freelancer for the same project assigned to Creative Orbit\n• You have provided an incomplete project brief\n• You have demanded a change in any concept\n• You have exceeded the maximum time allowed to 'request for refund' and make claims\n• You have other reasons such as change of mind, dispute with your partners, or other similar reasons\n• You have approved the deliverables\n• You have accepted multiple revisions for any service\n• You have ordered a bundle service and dissatisfied with any specific service, refund can only be claimed against that specific service and 'not' the complete set of bundle services\n• You have failed to provide the initial design brief within 10 days of order placement"
    },
    {
      title: "How to Claim Your Refund",
      content: "To ensure that your refund request is processed effectively and is approved, please make sure that you meet the following requirements.\n\n1. Specify your concern and claim your refund through any of the following three modes:-\ni. Live Chat.\nii. Email. (info@creativeorbit.co.uk)\n\nWe will try to resolve your query and concern in light of our revision policy immediately or else will email you a refund request approval from our refund department. After the refund, the rights to your design would be transferred to Creative Orbit and you would not legally be allowed to display any version of the design sent by the company.\n\n2. Since the rights to design would now be transferred to Creative Orbit, you concur that you will have no right (immediate or circuitous) to use any reaction or other substance, work item or media, nor will you have any ownership interest for or to the same.\n\n3. Working in a joint effort with the Government Copyright Agencies, Creative Orbit would share Copyright Acquisition data for the refunded outlines that would confine the re-utilization of the designs as original designs in the future.\n\nIf you have any questions or concerns about our Refund Policy, please get in touch with us by emailing info@creativeorbit.co.uk.\n\nAll refund requests will be fulfilled as per the following arrangement:\n• If request for refund is made before the Initial concept delivery, you would be eligible for Full Refund (less 10% service & processing fee).\n• If request for refund is made within 48 hours, you would be eligible for 66% refund (less 10% service & processing fee).\n• If request for refund is made between 48 - 120 hours of the initial design delivery, you would be eligible for 33% refund (less 10% service & processing fee).\n\nNo refund request will be entertained after 120 hours of your initial design delivery, however since we believe in 100% customer satisfaction you're encouraged to contact us in case of any concern.\n\nAll refund requests should be communicated to the support department. Creative Orbit, based on the violation of your user agreement, reserves the right to approve/disapprove your request on an individual case to case basis.\n\nTurn around time for payments received via Credit Card, Stripe or Paypal is 90 days for full refund and 21 days for partial refund."
    }
  ];

  return (
    <main className="min-h-screen bg-primary selection:bg-accent-cyan/30 selection:text-accent-cyan flex flex-col">
      <Navigation settings={settings} />
      
      <div className="flex-grow pt-32 pb-20 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-cyan/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-purple/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Terms & <span className="text-gradient">Conditions</span>
            </h1>
            <div className="w-20 h-1 bg-accent-cyan rounded-full mb-8" />
            <p className="text-white/60 text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>

          <div className="space-y-12">
            {sections.map((section, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-display font-bold text-white border-l-4 border-accent-cyan pl-4">
                  {section.title}
                </h2>
                <div className="text-white/60 leading-relaxed space-y-4 pl-5">
                  {section.content.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer settings={settings} />
    </main>
  );
}
