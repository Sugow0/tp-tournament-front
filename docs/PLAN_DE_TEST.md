# Plan de test — TP Tournament (Front)

| | |
|---|---|
| **Projet** | TP Tournament — application de gestion de tournois (thème D&D) |
| **Périmètre du document** | Front-end `tp-tournament-front` (React Router v7 / TypeScript) |
| **Version** | 1.0 |
| **Date** | 2026-06-11 |
| **Branche** | `dev` |

---

## 1. Objectif

Définir la stratégie, le périmètre, les niveaux et les critères de test du front-end afin de
garantir la non-régression des fonctionnalités et une couverture de code **≥ 95 %** sur le
code applicatif (composants, services, librairies).

## 2. Périmètre

### 2.1 Inclus dans le test

| Couche | Description | Niveau de test |
|---|---|---|
| `app/lib/**` | Logique métier pure (bracket, règles de combat, HTTP, auth, i18n) | Unitaire |
| `app/services/**` | Clients d'API (méthode, URL, payload) | Unitaire (mock `fetch`) |
| `app/hooks/**` | Hooks React (`useSession`, `useCurrentUser`) | Unitaire (RTL) |
| `app/components/**` | Composants d'UI (formulaires, cartes, panneaux, layout) | Composant (RTL + jsdom) |
| `app/routes/**` | Loaders / actions React Router et rendu des pages | Intégration (RTL) |
| `app/theme/**` | Jetons de thème | Unitaire |
| Parcours utilisateur | Création de tournoi, gestion de duel, classement | E2E (Playwright) |

### 2.2 Exclu du calcul de couverture

| Élément | Raison |
|---|---|
| `app/components/ui/**` | Primitives shadcn/Radix vendorisées (non maintenues par l'équipe) |
| `app/components/background/**` (`ArenaScene`) | Scène WebGL three.js décorative — non rendable sous jsdom (pas de contexte GL) |

Ces exclusions sont déclarées dans `vitest.config.ts` (`coverage.exclude`).

## 3. Stratégie de test

### 3.1 Pyramide de test

```
            ▲   E2E (Playwright)  — parcours critiques de bout en bout
           ───
          ─────  Intégration (routes : loaders / actions)
        ─────────
      ─────────────  Unitaire / Composant (lib, services, hooks, composants)
```

La majorité de l'effort porte sur les tests unitaires et composants (rapides,
déterministes, exécutés à chaque commit), complétés par des tests d'intégration au
niveau des routes et quelques scénarios E2E pour les parcours critiques.

### 3.2 Types de tests

- **Tests unitaires** : fonctions pures et services. Le réseau (`fetch`) est mocké ;
  on vérifie la méthode HTTP, le chemin et le corps de la requête.
- **Tests de composants** : rendu, props conditionnelles, états (activé/désactivé,
  vide/rempli), gestionnaires d'événements (clic, saisie, soumission). `react-i18next`
  est mocké en fonction identité (`t: (key) => key`) ; le routeur est fourni via
  `renderWithRouter` (`createMemoryRouter`).
- **Tests d'intégration (routes)** : exécution des `loader`/`action`, gestion des cas
  d'erreur (`ApiError`), redirections.
- **Tests E2E** : parcours utilisateur complets contre une API réelle (voir §6).

## 4. Environnement et outillage

| Outil | Usage |
|---|---|
| **Vitest 4** | Exécuteur de tests unitaires/composants |
| **@testing-library/react 16** | Rendu et requêtes orientées utilisateur |
| **@testing-library/user-event** | Simulation des interactions |
| **jsdom** | Environnement DOM pour les tests composants |
| **@vitest/coverage-v8** | Mesure de couverture (provider V8) |
| **Playwright** | Tests E2E (navigateur Chromium) |
| **Biome** | Lint + format (qualité statique) |

### Commandes

| Commande | Description |
|---|---|
| `pnpm test` | Exécute toute la suite unitaire/composant |
| `pnpm test:watch` | Mode interactif |
| `pnpm test:coverage` | Suite + rapport de couverture + **seuil bloquant à 95 %** |
| `pnpm e2e` | Tests Playwright (nécessite l'app et l'API lancées) |
| `pnpm lint` | Analyse statique Biome |

## 5. Critères de couverture (seuils)

La configuration `vitest.config.ts` impose des seuils bloquants. La CI échoue si l'un
d'eux n'est pas atteint :

| Métrique | Seuil minimal |
|---|---|
| Statements | 95 % |
| Branches | 95 % |
| Functions | 95 % |
| Lines | 95 % |

## 6. Tests E2E (Playwright)

Trois scénarios sont définis dans `e2e/` :

1. `create-tournament.spec.ts` — création d'un tournoi puis avancement de son statut.
2. `manage-duel.spec.ts` — création d'un duel, saisie du résultat, clôture.
3. `view-ranking.spec.ts` — consultation du classement et de la bannière de champion.

> **État actuel** : ces scénarios sont marqués `test.skip`. Ils nécessitent une **API
> déployée et une base de données de test** dédiée (`baseURL: http://localhost:5173`,
> `webServer: pnpm dev`). Ils doivent être activés une fois l'environnement
> d'intégration disponible.

## 7. Données de test

- Les **fixtures** sont construites en local dans chaque fichier de test à partir des
  types de `app/types/**` (aucune dépendance à un jeu de données partagé).
- Les appels réseau sont **systématiquement mockés** en tests unitaires/composants ;
  aucun test unitaire ne dépend d'un backend en fonctionnement.

## 8. Critères d'entrée et de sortie

### Entrée
- Le code compile (`pnpm typecheck`).
- Le lint passe (`pnpm lint`).

### Sortie (Definition of Done des tests)
- 100 % des tests unitaires/composants passent.
- Les 4 seuils de couverture (≥ 95 %) sont atteints.
- Aucune anomalie bloquante ouverte non documentée.

## 9. Risques et limites

| Risque | Mitigation |
|---|---|
| Scène WebGL non testable sous jsdom | Exclue de la couverture, isolée dans `background/` |
| E2E dépendants d'une API réelle | Scénarios `skip` documentés ; à activer en environnement d'intégration |
| Mocks divergeant du contrat backend réel | Vérification croisée des chemins/payloads avec les contrôleurs .NET |
| Régression silencieuse de couverture | Seuils bloquants en CI (échec sous 95 %) |

## 10. Traçabilité

Chaque composant, service et fonction de librairie possède un fichier de test
correspondant dans un dossier `__tests__/` adjacent. Le rapport d'exécution est
disponible dans `docs/RAPPORT_DE_TEST.md` et le rapport HTML de couverture est généré
sous `coverage/` par `pnpm test:coverage`.
