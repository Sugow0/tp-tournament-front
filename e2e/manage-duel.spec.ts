/**
 * E2E : Création et gestion d'un duel
 *
 * Ces tests ne peuvent pas être exécutés en l'état :
 * - L'API ASP.NET Core n'est pas déployée sur un environnement de test
 * - La base de données de test n'est pas provisionnée
 *
 * Pré-requis pour les activer :
 *   1. Déployer l'API sur une URL accessible (VITE_API_URL dans .env.test)
 *   2. Provisionner une BDD vierge réinitialisée avant chaque run
 *   3. Lancer : pnpm exec playwright test e2e/manage-duel.spec.ts
 *
 * Scénario prévu :
 *   1. Tournoi IN_PROGRESS + 2 joueurs + 0 duels
 *   2. Créer duel → vérifier "Arthur vs Lancelot" + badge "En attente"
 *   3. Saisir PLAYER1_WIN → vérifier label "Victoire joueur 1"
 *   4. Terminer (90s) → vérifier durée "1:30" + formulaires d'action masqués
 */

import { test } from "@playwright/test";

test.skip("create duel, set outcome, end duel — requires deployed API + test DB", () => {
  // À implémenter quand l'environnement de test est disponible
});
