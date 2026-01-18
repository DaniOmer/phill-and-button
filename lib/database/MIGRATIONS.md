# Guide des Migrations TypeORM

## Configuration

La configuration TypeORM est dans `lib/database/data-source.ts`. Elle utilise les variables d'environnement suivantes (chargées depuis `.env.local`) :

- `NEXT_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase
- `SUPABASE_DB_PASSWORD` : Mot de passe de la base de données PostgreSQL

⚠️ **Important** : Assurez-vous que votre fichier `.env.local` contient ces variables avant d'exécuter les migrations.

## Scripts disponibles

### Générer une migration à partir des entités

```bash
npm run migration:generate lib/database/migrations/NomDeLaMigration
```

### Créer une migration vide

```bash
npm run migration:create lib/database/migrations/NomDeLaMigration
```

### Exécuter les migrations en attente

```bash
npm run migration:run
```

### Annuler la dernière migration

```bash
npm run migration:revert
```

### Voir le statut des migrations

```bash
npm run migration:show
```

## Notes importantes

⚠️ **Les tables `products` et `profiles` existent déjà** via les migrations SQL Supabase (`supabase/migrations/001_create_tables.sql`).

TypeORM est configuré pour gérer les **futures migrations** uniquement. Si vous devez modifier le schéma de la base de données, utilisez TypeORM pour créer et exécuter les migrations.

## Structure des migrations

Les migrations sont stockées dans `lib/database/migrations/` et suivent le format :

```
[timestamp]-NomDeLaMigration.ts
```

## Comment TypeORM détecte les changements

TypeORM peut **automatiquement détecter les différences** entre vos entités TypeScript et l'état actuel de la base de données.

### Détection automatique

Quand vous utilisez `migration:generate`, TypeORM :

1. **Lit vos entités** dans `lib/database/entities/`
2. **Se connecte à la base de données** et lit le schéma actuel
3. **Compare** les deux et génère automatiquement le code SQL nécessaire

### Exemple d'utilisation

#### Scénario 1 : Créer les tables initiales (première fois)

```bash
# La migration InitialCreate a déjà été créée
npm run migration:run
```

#### Scénario 2 : Modifier une entité existante

1. **Modifier une entité** dans `lib/database/entities/Product.ts` :

   ```typescript
   @Column({ type: "text", nullable: true })
   sku: string | null; // Nouvelle colonne
   ```

2. **Générer la migration automatiquement** :

   ```bash
   npm run migration:generate lib/database/migrations/AddSkuToProduct
   ```

   TypeORM va détecter la nouvelle colonne et générer :

   ```typescript
   await queryRunner.query(`ALTER TABLE "products" ADD "sku" TEXT`);
   ```

3. **Vérifier le fichier généré** dans `lib/database/migrations/`

4. **Exécuter la migration** :
   ```bash
   npm run migration:run
   ```

### Notes importantes

- ✅ TypeORM détecte : ajout/suppression de colonnes, changements de types, contraintes
- ⚠️ TypeORM ne gère pas : RLS (Row Level Security), triggers Supabase, fonctions SQL personnalisées
- 💡 Pour RLS et triggers, utilisez les migrations SQL Supabase (`supabase/migrations/`)

### Workflow recommandé

1. **Tables et colonnes** → Migrations TypeORM
2. **RLS, triggers, fonctions** → Migrations SQL Supabase
