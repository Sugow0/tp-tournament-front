/**
 * E2E : Création d'un tournoi et avancement de statut
 *
 * Ces tests ne peuvent pas être exécutés en l'état :
 * - L'API ASP.NET Core n'est pas déployée sur un environnement de test
 * - La base de données de test n't est pas provisionnée
 *
 * Pré-requis pour les activer :
 *   1. Déployer l'API sur une URL accessible (VITE_API_URL dans .env.test)
 *   2. Provisionner une BDD vierge réinitialisée avant chaque run
 *   3. Lancer : pnpm exec playwright test e2e/create-tournament.spec.ts
 *
 * Scénario prévu :
 *   1. GET /api/tournaments → [] → EmptyState visible
 *   2. Ouvrir "Nouveau Tournoi" → saisir "Avalon Cup" → soumettre
 *   3. Vérifier carte "Avalon Cup" + badge "Ouvert"
 *   4. Cliquer carte → /tournaments/1
 *   5. Vérifier stepper step 1 active
 *   6. Cliquer "Commencer le tournoi" → stepper avance à IN_PROGRESS
 */

import { test } from "@playwright/test";

test.skip("create tournament and advance status — requires deployed API + test DB", () => {
  // À implémenter quand l'environnement de test est disponible
});
