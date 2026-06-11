# Rapport de test — TP Tournament (Front)

| | |
|---|---|
| **Projet** | TP Tournament — application de gestion de tournois (thème D&D) |
| **Périmètre** | Front-end `tp-tournament-front` (React Router v7 / TypeScript) |
| **Version testée** | branche `dev` |
| **Date d'exécution** | 2026-06-11 |
| **Outils** | Vitest 4 + Testing Library + jsdom, couverture V8 |
| **Référence** | `docs/PLAN_DE_TEST.md` |

---

## 1. Synthèse

| Indicateur | Résultat |
|---|---|
| Fichiers de test | **89** |
| Tests exécutés | **437** |
| Tests réussis | **437 (100 %)** |
| Tests en échec | 0 |
| Seuils de couverture (95 %) | ✅ **Atteints** (gate vert, exit code 0) |

**Verdict : SUCCÈS.** L'ensemble de la suite passe et les quatre seuils de couverture
sont franchis.

## 2. Couverture de code

Périmètre mesuré : `app/components/**`, `app/services/**`, `app/lib/**`
(hors `ui/**` et `background/**`, cf. plan de test §2.2).

| Métrique | Avant | Après | Seuil | Statut |
|---|---|---|---|---|
| Statements | 65,3 % | **98,5 %** (474/481) | 95 % | ✅ |
| Branches | 61,4 % | **96,3 %** (257/267) | 95 % | ✅ |
| Functions | 69,8 % | **96,7 %** (208/215) | 95 % | ✅ |
| Lines | 65,9 % | **98,5 %** (452/459) | 95 % | ✅ |

Le rapport HTML détaillé est généré sous `coverage/index.html` via `pnpm test:coverage`.

### Points résiduels (non bloquants)

| Fichier | Couverture | Zones non couvertes |
|---|---|---|
| `app/components/layout/Navbar.tsx` | 73 % lignes | Menu mobile (lignes 105-138) |
| `app/lib/auth.ts` | branches 64 % | Gardes SSR `!hasWindow()` (non atteignables sous jsdom) |
| `app/lib/http.ts` | branches 87 % | Branche `import.meta.env.VITE_API_URL` (valeur d'environnement) |

Ces éléments restent sous le seuil agrégé de 95 % et n'empêchent pas la validation.

## 3. Répartition des tests par couche

| Couche | Fichiers de test | Type |
|---|---|---|
| `app/lib` | 5 | Unitaire |
| `app/services` | 16 | Unitaire (mock `fetch`) |
| `app/hooks` | 1 | Unitaire (RTL) |
| `app/theme` | 1 | Unitaire |
| `app/components` | 50 | Composant (RTL + jsdom) |
| `app/routes` | 16 | Intégration (loaders/actions) |
| **Total** | **89** | |

## 4. Tests E2E (Playwright)

| Scénario | Fichier | État |
|---|---|---|
| Création de tournoi + avancement de statut | `e2e/create-tournament.spec.ts` | ⏭️ `skip` |
| Création / résultat / clôture de duel | `e2e/manage-duel.spec.ts` | ⏭️ `skip` |
| Consultation classement + bannière champion | `e2e/view-ranking.spec.ts` | ⏭️ `skip` |

> Les scénarios E2E sont actuellement désactivés (`test.skip`) : ils requièrent une API
> déployée et une base de données de test. À réactiver en environnement d'intégration.

## 5. Anomalies détectées

L'analyse statique et la revue de code menées en parallèle de la campagne de test ont
mis en évidence les anomalies suivantes. **Elles ne sont pas encore corrigées** (statut
*Ouvert*) et ne sont pas couvertes par les tests existants (suite verte avant
correction).

| # | Sévérité | Localisation | Description | Statut |
|---|---|---|---|---|
| 1 | **Majeure** | `app/lib/http.ts:33` | `apiFetch` appelle `res.json()` même sur une réponse **204 No Content** → `SyntaxError` côté client alors que le serveur a réussi. Impacte `deactivateSkin` (DELETE skin), `attachTournament` (rattachement saison), `addFriend`/`removeFriend`. | Ouvert |
| 2 | **Majeure** | `app/routes/tournaments._index.tsx:24` | Erreur affichée comme clé brute : `t("errors.createFailed")` est résolu dans le namespace `common` (inexistant) → l'utilisateur voit `errors.createFailed` au lieu du message FR. Valeur attendue : `errors:tournament.createFailed`. | Ouvert |
| 3 | **Moyenne** | `app/components/combat/CombatBoard.tsx:79` | `useEffect([], …)` ne se rejoue pas au changement de tour : `selectedId` du joueur 1 reste sélectionné quand le joueur 2 prend la main (fuite d'état, contraire à l'intention « hot-seat »). Dépendance attendue : `[activeSlot]`. | Ouvert |
| 4 | **Moyenne** | `app/lib/auth.ts:28` | `getAccessToken()` met en cache le token au niveau module et ne relit jamais `localStorage` ; la synchronisation **multi-onglets** (`storage`) de `useSession` renvoie alors une valeur périmée (déconnexion/connexion non reflétée). | Ouvert |
| 5 | **Mineure** | `app/components/duel/CreateDuelForm.tsx:22` | Les deux `<select>` (joueur 1 / joueur 2) n'ont pas de `defaultValue` → ils pointent par défaut sur le même joueur ; une soumission sans modification crée un duel d'un joueur contre lui-même. | Ouvert |

### Anomalies latentes (priorité basse)

- `app/routes/tournaments.$id.tsx` (`generateBracket`) : passage du statut à `IN_PROGRESS`
  puis création des duels en boucle **sans gestion d'erreur** → bracket partiel en cas
  d'échec en cours de boucle (état incohérent, non transactionnel).
- `app/routes/battlepass.$seasonId.tsx:31` : l'action `addTier` appelle
  `getBattlepassBySeason` sans garde 404 (le loader, lui, la gère).
- Parsing des paramètres de route via `Number(params.x)` sans contrôle `NaN` (uniforme
  sur toutes les routes `$id`/`$seasonId`/`$duelId`).

## 6. Conclusion

La campagne de test unitaire/composant/intégration est **conforme aux critères de
sortie** du plan de test : 437 tests verts, couverture ≥ 95 % sur les quatre métriques,
seuils rendus bloquants en CI.

Actions recommandées :
1. **Corriger les anomalies 1 à 5** et ajouter les tests de non-régression associés
   (notamment un cas 204 dans `app/lib/__tests__/http.test.ts`).
2. **Activer les scénarios E2E** une fois l'environnement d'intégration (API + BDD)
   disponible.
3. Compléter la couverture du menu mobile de `Navbar.tsx` pour renforcer la marge.
