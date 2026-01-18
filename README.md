# Phill & Button - E-commerce

Application e-commerce Next.js pour la marque de vêtements haut de gamme Phill & Button. Gestion des produits via dashboard admin, commandes via WhatsApp.

## Stack Technique

- **Next.js 16** (App Router, TypeScript)
- **tRPC v11** - API typée end-to-end
- **Supabase** - PostgreSQL + Auth + Storage
- **Tailwind CSS** - Styling utility-first
- **shadcn/ui** - Composants UI
- **Zod** - Validation des données
- **React Hook Form** - Gestion des formulaires

## Installation

### 1. Cloner et installer les dépendances

```bash
git clone <repo-url>
cd phill-and-button
npm install
```

### 2. Configurer Supabase

1. Créer un projet sur [Supabase](https://supabase.com)
2. Copier le fichier `.env.example` en `.env.local` :

```bash
cp .env.example .env.local
```

3. Remplir les variables d'environnement avec vos clés Supabase :
   - `NEXT_PUBLIC_SUPABASE_URL` - URL du projet
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clé anonyme
   - `SUPABASE_SERVICE_ROLE_KEY` - Clé service role (admin)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` - Numéro WhatsApp Business

### 3. Exécuter les migrations SQL

Dans l'éditeur SQL de Supabase, exécuter dans l'ordre :

1. `supabase/migrations/001_create_tables.sql` - Tables et RLS
2. `supabase/migrations/002_create_storage.sql` - Bucket images
3. `supabase/seed.sql` (optionnel) - Données de test

### 4. Créer un admin

1. Créer un compte via Supabase Auth (email/password)
2. Dans l'éditeur SQL, exécuter :

```sql
UPDATE profiles SET role = 'admin' WHERE id = 'USER_UUID_HERE';
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000)

## Structure du Projet

```
├── app/
│   ├── (admin)/admin/     # Dashboard admin
│   ├── (auth)/login/      # Page de connexion
│   ├── (main)/            # Pages publiques
│   │   ├── store/         # Catalogue produits
│   │   └── product/[id]/  # Détail produit
│   └── api/trpc/          # Handler tRPC
├── components/
│   ├── admin/             # Composants admin
│   ├── homepage/          # Sections homepage
│   ├── public/            # Composants publics
│   └── ui/                # shadcn/ui
├── lib/
│   ├── supabase/          # Clients Supabase
│   └── trpc/              # Client tRPC
├── server/trpc/           # Routers tRPC
├── types/                 # Types TypeScript
└── supabase/              # Migrations SQL
```

## Fonctionnalités

### Public

- **Homepage** : Hero, produits tendance, lookbook, témoignages
- **Boutique** : Grille produits, recherche, filtres par catégorie
- **Page produit** : Détails, stock, bouton WhatsApp pour commander

### Admin

- **Dashboard** : Statistiques (total produits, tendances, ruptures)
- **Gestion produits** : CRUD complet, toggle tendance
- **Upload images** : Vers Supabase Storage

## Scripts

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Linter ESLint
```

## Variables d'Environnement

| Variable                        | Description                            |
| ------------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL du projet Supabase                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase                  |
| `SUPABASE_SERVICE_ROLE_KEY`     | Clé admin Supabase (ne pas exposer)    |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`   | Numéro WhatsApp (format: 221771234567) |

## Déploiement

### Vercel (recommandé)

1. Connecter le repo à Vercel
2. Configurer les variables d'environnement
3. Déployer

```bash
vercel
```

## Licence

Propriétaire - Phill & Button
