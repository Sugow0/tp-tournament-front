/**
 * E2E : Consultation du classement final
 *
 * Ces tests ne peuvent pas être exécutés en l'état :
 * - L'API ASP.NET Core n'est pas déployée sur un environnement de test
 * - La base de données de test n'est pas provisionnée
 *
 * Pré-requis pour les activer :
 *   1. Déployer l'API sur une URL accessible (VITE_API_URL dans .env.test)
 *   2. Provisionner une BDD vierge réinitialisée avant chaque run
 *   3. Lancer : pnpm exec playwright test e2e/view-ranking.spec.ts
 *
 * Scénario prévu :
 *   1. Tournoi CLOSED + ranking (Arthur=12, Merlin=8, Lancelot=0/disqualifié) + champion=Arthur
 *   2. Naviguer /tournaments/1/ranking
 *   3. ChampionBanner : nom "Arthur", score "12", icône couronne visible
 *   4. Tableau : ordre correct, Lancelot affiché score 0 + statut disqualifié
 *   5. Retour overview → stepper complet, bouton AdvanceTournament absent
 */

import { test } from "@playwright/test";

test.skip("view ranking and champion banner — requires deployed API + test DB", () => {
  // À implémenter quand l'environnement de test est disponible
});
