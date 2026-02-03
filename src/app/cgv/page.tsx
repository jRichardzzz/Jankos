"use client";

import Link from "next/link";

export default function CGV() {
  return (
    <div className="min-h-screen bg-[hsl(224,71%,4%)] text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(224,71%,4%)]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-amber-500/30 flex items-center justify-center">
              <span className="text-amber-500 font-bold">J</span>
            </div>
            <span className="font-bold text-white">JANKOS<span className="text-amber-500">.cc</span></span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Conditions Générales de Vente</h1>
          
          <div className="prose prose-invert prose-gray max-w-none space-y-8">
            <p className="text-gray-400 leading-relaxed">
              Les présentes Conditions Générales de Vente régissent les ventes effectuées sur le site :
            </p>

            <div className="bg-white/5 rounded-xl p-6 space-y-3">
              <p><strong className="text-white">Site :</strong> <span className="text-gray-300">Jankos.cc</span></p>
              <p><strong className="text-white">Propriétaire :</strong> <span className="text-gray-300">Jordan Richard DELAUNAY</span></p>
              <p><strong className="text-white">Email :</strong> <span className="text-amber-400">contact@jankos.cc</span></p>
              <p><strong className="text-white">URL :</strong> <span className="text-gray-300">https://jankos.cc</span></p>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Objet</h2>
              <p className="text-gray-400 mb-4">
                Les présentes Conditions Générales de Vente ont pour objet de définir les modalités de vente des produits et services proposés par Jankos.cc, à savoir :
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Crédits pour l&apos;utilisation des agents IA</li>
                <li>Abonnements mensuels et annuels</li>
                <li>Génération de miniatures YouTube (Alice)</li>
                <li>Génération d&apos;idées virales (Douglas)</li>
                <li>Stratégie SEO et mots-clés (Roman)</li>
              </ul>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-4">
                <p className="text-amber-200 text-sm">⚠️ Toute commande implique l&apos;acceptation pleine et entière des présentes CGV.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Accès aux services</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Les crédits sont disponibles immédiatement après paiement.</li>
                <li>L&apos;accès est strictement personnel et ne peut être partagé.</li>
                <li>Les générations sont liées au compte utilisateur.</li>
              </ul>
              <p className="text-gray-400 mt-4">
                En cas de problème technique, l&apos;utilisateur peut contacter le support à : <span className="text-amber-400">contact@jankos.cc</span>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Prix</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Les prix sont exprimés en euros.</li>
                <li>Jankos.cc se réserve le droit de modifier les prix à tout moment.</li>
                <li>Le prix facturé est celui affiché au moment de la commande.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Commande</h2>
              <p className="text-gray-400">
                Toute commande vaut acceptation du prix et de la description du produit.
              </p>
              <p className="text-gray-400 mt-4">
                Jankos.cc se réserve le droit de refuser ou d&apos;annuler toute commande en cas de suspicion de fraude ou de problème de paiement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Paiement</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Les moyens de paiement acceptés sont ceux proposés sur le site (carte bancaire via Stripe).</li>
                <li>Le paiement est exigible immédiatement.</li>
                <li>Les transactions sont sécurisées par notre prestataire de paiement.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Crédits et produits numériques</h2>
              <p className="text-gray-400">
                Conformément à la loi, les produits numériques (crédits, abonnements, générations) ne sont ni remboursables ni échangeables une fois utilisés.
              </p>
              <div className="bg-white/5 rounded-xl p-6 mt-4">
                <h3 className="font-semibold text-white mb-3">Utilisation des crédits :</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>1 miniature = 10 crédits</li>
                  <li>1 recherche d&apos;idées virales = 10 crédits</li>
                  <li>1 analyse SEO = 20 crédits</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Droit de rétractation</h2>
              <p className="text-gray-400 mb-4">
                L&apos;acheteur dispose d&apos;un délai de 14 jours à compter de l&apos;achat pour exercer son droit de rétractation sur les crédits non utilisés.
              </p>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <p className="text-amber-200 text-sm">⚠️ Les crédits déjà utilisés ne peuvent faire l&apos;objet d&apos;un remboursement.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Abonnements</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Les abonnements sont renouvelés automatiquement.</li>
                <li>L&apos;utilisateur peut annuler son abonnement à tout moment depuis son espace personnel.</li>
                <li>L&apos;annulation prend effet à la fin de la période en cours.</li>
                <li>Les crédits non utilisés à la fin du mois ne sont pas reportés.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Responsabilité</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Jankos.cc ne saurait être tenu responsable des dommages indirects liés à l&apos;utilisation du site ou des services.</li>
                <li>La responsabilité est limitée au montant de la commande.</li>
                <li>Les images générées sont sous la responsabilité de l&apos;utilisateur quant à leur utilisation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Propriété intellectuelle</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Tous les contenus du site sont protégés par le droit d&apos;auteur.</li>
                <li>Les images générées par les utilisateurs leur appartiennent.</li>
                <li>Toute reproduction du site est interdite sans autorisation préalable.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">11. Données personnelles</h2>
              <p className="text-gray-400">
                Les données collectées sont utilisées pour la gestion des commandes et des comptes.
              </p>
              <p className="text-gray-400 mt-4">
                Conformément au RGPD, tout utilisateur peut demander l&apos;accès ou la suppression de ses données à : <span className="text-amber-400">contact@jankos.cc</span>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">12. Droit applicable</h2>
              <p className="text-gray-400">
                Les présentes CGV sont soumises au droit du Delaware (propriété Richard Group LLC). Tout litige relèvera de la compétence des tribunaux des USA.
              </p>
            </section>

            <div className="border-t border-white/10 pt-8 mt-8">
              <p className="text-gray-500 text-sm">Dernière mise à jour : Février 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
