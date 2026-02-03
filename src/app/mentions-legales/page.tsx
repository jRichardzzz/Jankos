"use client";

import Link from "next/link";

export default function MentionsLegales() {
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Mentions Légales</h1>
          
          <div className="prose prose-invert prose-gray max-w-none space-y-8">
            <p className="text-gray-400 leading-relaxed">
              Conformément aux dispositions des articles 6-III et 19 de la Loi pour la Confiance dans l&apos;Économie Numérique (LCEN), les présentes mentions légales sont portées à la connaissance des utilisateurs du site.
            </p>

            <div className="bg-white/5 rounded-xl p-6 space-y-3">
              <p><strong className="text-white">Nom du site :</strong> <span className="text-gray-300">Jankos.cc</span></p>
              <p><strong className="text-white">URL du site :</strong> <span className="text-gray-300">https://jankos.cc</span></p>
              <p><strong className="text-white">Propriétaire / responsable de la publication :</strong> <span className="text-gray-300">Jordan Richard DELAUNAY</span></p>
              <p><strong className="text-white">Email :</strong> <span className="text-amber-400">contact@jankos.cc</span></p>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Hébergement</h2>
              <div className="bg-white/5 rounded-xl p-6 space-y-2">
                <p><strong className="text-white">Hébergeur :</strong> <span className="text-gray-300">Vercel Inc.</span></p>
                <p><strong className="text-white">Adresse :</strong> <span className="text-gray-300">440 N Barranca Ave #4133, Covina, CA 91723, USA</span></p>
                <p><strong className="text-white">Site web :</strong> <span className="text-gray-300">https://vercel.com</span></p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Description des services</h2>
              <p className="text-gray-400 mb-4">Le site Jankos.cc propose notamment :</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Des agents IA pour la création de miniatures YouTube</li>
                <li>Un générateur d&apos;idées de vidéos virales</li>
                <li>Un outil de stratégie SEO et mots-clés YouTube</li>
                <li>Des contenus pédagogiques pour créateurs de contenu</li>
                <li>Un système de crédits pour accéder aux services</li>
              </ul>
              <p className="text-gray-400 mt-4">Ces services sont proposés à titre informatif, pédagogique et commercial selon les cas.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Responsabilité</h2>
              <p className="text-gray-400">
                Le propriétaire du site s&apos;efforce de fournir des informations aussi précises que possible, mais ne saurait garantir l&apos;exactitude, la complétude ou l&apos;actualité des contenus.
              </p>
              <p className="text-gray-400 mt-4">
                L&apos;utilisateur reconnaît utiliser les informations du site sous sa responsabilité exclusive. Le site ne pourra être tenu responsable d&apos;éventuels dommages directs ou indirects liés à l&apos;utilisation du site ou à une indisponibilité temporaire du service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Propriété intellectuelle</h2>
              <p className="text-gray-400">
                L&apos;ensemble des contenus présents sur le site (textes, images, vidéos, graphismes, logo, agents IA, etc.) est la propriété exclusive de Jankos.cc, sauf mention contraire.
              </p>
              <p className="text-gray-400 mt-4">
                Toute reproduction, exploitation, diffusion ou modification, même partielle, sans autorisation préalable écrite, est strictement interdite.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Données personnelles</h2>
              <p className="text-gray-400 mb-4">
                Les données personnelles collectées (formulaires, inscriptions, commandes) sont utilisées uniquement dans le cadre :
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>De la gestion des services proposés</li>
                <li>De la communication avec les utilisateurs</li>
                <li>De l&apos;amélioration de l&apos;expérience utilisateur</li>
              </ul>
              <p className="text-gray-400 mt-4">
                Conformément au Règlement Général sur la Protection des Données (RGPD), chaque utilisateur dispose d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition.
              </p>
              <p className="text-gray-400 mt-4">
                Toute demande peut être adressée à : <span className="text-amber-400">contact@jankos.cc</span>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Cookies</h2>
              <p className="text-gray-400 mb-4">Le site peut être amené à utiliser des cookies à des fins :</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Techniques (fonctionnement du site)</li>
                <li>Statistiques (analyse de fréquentation)</li>
                <li>D&apos;amélioration de l&apos;expérience utilisateur</li>
              </ul>
              <p className="text-gray-400 mt-4">L&apos;utilisateur peut refuser les cookies en configurant son navigateur.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Paiements et remboursements</h2>
              <p className="text-gray-400">
                Les crédits et abonnements sont accessibles après validation du paiement. Conformément à la législation sur les contenus numériques, aucun remboursement ne pourra être effectué après l&apos;utilisation des crédits.
              </p>
              <p className="text-gray-400 mt-4">
                Les crédits non utilisés peuvent faire l&apos;objet d&apos;un remboursement dans un délai de 14 jours suivant l&apos;achat, conformément au droit de rétractation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Droit applicable</h2>
              <p className="text-gray-400">
                Les présentes mentions légales sont soumises au droit du Delaware (propriété Richard Group LLC). Tout litige relèvera de la compétence des tribunaux des USA.
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
