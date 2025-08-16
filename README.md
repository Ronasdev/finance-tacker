# 💰 Finance Tracker - Gestionnaire de Finances Personnelles

Une application web moderne et intuitive pour suivre vos finances personnelles avec des graphiques interactifs et une interface élégante.

## 🌟 Fonctionnalités

### 📊 Tableau de bord interactif
- **Solde actuel** avec indicateur visuel
- **Revenus et dépenses mensuels** en temps réel
- **Nombre total de transactions** effectuées

### 💳 Gestion des transactions
- **Ajout rapide** de transactions (revenus/dépenses)
- **Catégories prédéfinies** pour une organisation optimale
- **Modification et suppression** des transactions existantes
- **Recherche et filtrage** avancés

### 📈 Visualisations
- **Graphique mensuel** des revenus vs dépenses
- **Répartition par catégories** des dépenses
- **Interface responsive** qui s'adapte à tous les écrans

### 💾 Sauvegarde locale
- **Stockage dans le navigateur** avec localStorage
- **Export CSV** des données
- **Données persistantes** entre les sessions

### 🎨 Interface moderne
- **Design épuré** et moderne
- **Animations fluides**
- **Mode sombre** supporté
- **100% responsive**

## 🚀 Démarrage rapide

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Aucune installation requise !

### Installation locale
```bash
# Cloner le repository
git clone https://github.com/votre-username/finance-tracker.git

# Naviguer dans le dossier
cd finance-tracker

# Ouvrir index.html dans votre navigateur
# Ou utiliser un serveur local :
python -m http.server 8000
# Puis visiter http://localhost:8000
```

### Utilisation avec Vite (optionnel)
```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# Build pour la production
npm run build
```

## 📁 Structure du projet

```
finance-tracker/
├── index.html              # Page principale
├── main.js                 # Point d'entrée de l'application
├── style.css              # Styles globaux
├── js/
│   ├── FinanceManager.js  # Gestion des données financières
│   ├── UIManager.js       # Gestion de l'interface utilisateur
│   └── ChartManager.js    # Gestion des graphiques
├── public/
│   └── vite.svg          # Icône Vite
└── README.md             # Ce fichier
```

## 🛠️ Technologies utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Styles modernes avec variables CSS
- **JavaScript ES6+** - Classes, modules, async/await
- **Canvas API** - Graphiques personnalisés
- **localStorage** - Stockage local des données
- **Intl API** - Formatage localisé des dates et montants

## 🎯 Utilisation

### Ajouter une transaction
1. Cliquez sur le bouton **"Ajouter une transaction"**
2. Sélectionnez le type (Revenu ou Dépense)
3. Choisissez une catégorie
4. Entrez le montant et une description
5. Sélectionnez la date
6. Cliquez sur **"Ajouter"**

### Filtrer les transactions
- **Par catégorie** : Utilisez le menu déroulant des catégories
- **Par type** : Revenus, Dépenses ou Toutes
- **Par recherche** : Tapez dans la barre de recherche

### Exporter les données
- Cliquez sur **"Exporter"** pour télécharger vos données en format CSV

## 📊 Catégories disponibles

### Revenus
- Salaire
- Freelance
- Investissements
- Allocations
- Remboursements
- Vente
- Autre revenu

### Dépenses
- Logement
- Alimentation
- Transport
- Santé
- Loisirs
- Vêtements
- Éducation
- Télécommunications
- Services financiers
- Assurances
- Autre dépense

## 🔧 Développement

### Architecture
L'application suit une architecture modulaire avec séparation des responsabilités :

- **FinanceManager** : Gestion des données et calculs financiers
- **UIManager** : Gestion de l'interface et des interactions utilisateur
- **ChartManager** : Rendu des graphiques et visualisations

### API des classes

#### FinanceManager
```javascript
// Méthodes principales
addTransaction(data)          // Ajouter une transaction
updateTransaction(id, data)   // Modifier une transaction
deleteTransaction(id)         // Supprimer une transaction
getStats()                    // Obtenir les statistiques
getFilteredTransactions(filters) // Filtrer les transactions
```

#### UIManager
```javascript
// Méthodes principales
openModal(title)              // Ouvrir le modal
closeModal()                  // Fermer le modal
getFormData()                 // Récupérer les données du formulaire
renderTransactions(transactions) // Afficher les transactions
```

#### ChartManager
```javascript
// Méthodes principales
updateMonthlyChart(transactions)    // Mettre à jour le graphique mensuel
updateCategoryChart(transactions)   // Mettre à jour le graphique par catégorie
```

## 🐛 Problèmes connus

- Les données sont stockées localement dans le navigateur
- Pas de synchronisation cloud (feature future)
- Support limité aux navigateurs anciens

## 🗺️ Roadmap

- [ ] Synchronisation cloud
- [ ] Mode hors-ligne
- [ ] Import de données bancaires
- [ ] Budgets et objectifs
- [ ] Rapports détaillés
- [ ] Application mobile
- [ ] Support multi-devises

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- **Votre Nom** - *Travail initial* - [VotreGitHub](https://github.com/votre-username)

## 🙏 Remerciements

- Icônes par [Font Awesome](https://fontawesome.com)
- Polices par [Google Fonts](https://fonts.google.com)
- Inspiré par les meilleures pratiques de design moderne

---

## 📞 Support

Pour toute question ou problème, n'hésitez pas à ouvrir une [issue](https://github.com/votre-username/finance-tracker/issues) sur GitHub.

**⭐ N'oubliez pas de mettre une étoile si ce projet vous est utile !**
