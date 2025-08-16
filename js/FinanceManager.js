// Classe de gestion des données financières
// Cette classe gère toutes les opérations liées aux transactions financières
// y compris le stockage, la récupération, la validation et les statistiques
export class FinanceManager {
  constructor() {
    // Initialisation du tableau des transactions
    this.transactions = [];
    // Clé de stockage pour localStorage
    this.storageKey = 'financeTrackerData';
  }

  // Gestion des données - Chargement depuis localStorage
  loadData() {
    try {
      // Tenter de récupérer les données depuis localStorage
      const savedData = localStorage.getItem(this.storageKey);
      if (savedData) {
        // Si des données existent, les parser depuis JSON
        this.transactions = JSON.parse(savedData);
      } else {
        // Si aucune donnée n'existe, initialiser avec des données d'exemple
        this.initializeSampleData();
      }
    } catch (error) {
      // Gérer les erreurs de parsing ou de stockage
      console.error('Erreur lors du chargement des données:', error);
      // Initialiser avec des données d'exemple en cas d'erreur
      this.initializeSampleData();
    }
  }

  // Sauvegarde des données dans localStorage
  saveData() {
    try {
      // Convertir les transactions en JSON et les sauvegarder
      localStorage.setItem(this.storageKey, JSON.stringify(this.transactions));
    } catch (error) {
      // Gérer les erreurs de sauvegarde
      console.error('Erreur lors de la sauvegarde des données:', error);
    }
  }

  // Initialisation avec des données d'exemple
  initializeSampleData() {
    // Créer des transactions d'exemple réalistes
    const sampleTransactions = [
      {
        // Générer un ID unique pour chaque transaction
        id: this.generateId(),
        // Type de transaction: revenu ou dépense
        type: 'income',
        // Catégorie de la transaction
        category: 'Salaire',
        // Description détaillée
        description: 'Salaire mensuel',
        // Montant de la transaction
        amount: 3500,
        // Date de la transaction (format ISO)
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
      },
      {
        id: this.generateId(),
        type: 'expense',
        category: 'Logement',
        description: 'Loyer',
        amount: 1200,
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString().split('T')[0]
      },
      {
        id: this.generateId(),
        type: 'expense',
        category: 'Alimentation',
        description: 'Courses alimentaires',
        amount: 250,
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString().split('T')[0]
      }
    ];

    // Assigner les transactions d'exemple et sauvegarder
    this.transactions = sampleTransactions;
    this.saveData();
  }

  // Gestion des transactions - Ajout d'une nouvelle transaction
  addTransaction(transactionData) {
    // Créer un objet transaction complet avec toutes les propriétés nécessaires
    const transaction = {
      // Générer un ID unique
      id: this.generateId(),
      // Copier toutes les données fournies
      ...transactionData,
      // Convertir le montant en nombre décimal
      amount: parseFloat(transactionData.amount),
      // Ajouter la date de création
      createdAt: new Date().toISOString()
    };

    // Ajouter la transaction au début du tableau (ordre chronologique inverse)
    this.transactions.unshift(transaction);
    // Sauvegarder les données mises à jour
    this.saveData();
    // Retourner la transaction créée
    return transaction;
  }

  // Mise à jour d'une transaction existante
  updateTransaction(id, transactionData) {
    // Trouver l'index de la transaction à mettre à jour
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      // Mettre à jour la transaction en conservant l'ID et en ajoutant les nouvelles données
      this.transactions[index] = {
        // Conserver les propriétés existantes
        ...this.transactions[index],
        // Appliquer les nouvelles données
        ...transactionData,
        // Convertir le montant en nombre décimal
        amount: parseFloat(transactionData.amount),
        // Ajouter la date de mise à jour
        updatedAt: new Date().toISOString()
      };
      // Sauvegarder les changements
      this.saveData();
      // Retourner la transaction mise à jour
      return this.transactions[index];
    }
    // Retourner null si la transaction n'est pas trouvée
    return null;
  }

  // Suppression d'une transaction
  deleteTransaction(id) {
    // Trouver l'index de la transaction à supprimer
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      // Supprimer la transaction du tableau
      this.transactions.splice(index, 1);
      // Sauvegarder les changements
      this.saveData();
      // Retourner true pour indiquer le succès
      return true;
    }
    // Retourner false si la transaction n'est pas trouvée
    return false;
  }

  // Récupération d'une transaction spécifique par ID
  getTransaction(id) {
    // Utiliser find pour récupérer la transaction avec l'ID correspondant
    return this.transactions.find(t => t.id === id);
  }

  // Récupération de toutes les transactions triées par date
  getAllTransactions() {
    // Créer une copie du tableau et trier par date décroissante
    return [...this.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Filtrage des transactions selon différents critères
  getFilteredTransactions(filters) {
    // Créer une copie du tableau des transactions
    let filtered = [...this.transactions];

    // Appliquer le filtre par catégorie si spécifié
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    // Appliquer le filtre par type si spécifié
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Appliquer le filtre de recherche si spécifié
    if (filters.search) {
      // Convertir le terme de recherche en minuscules
      const searchTerm = filters.search.toLowerCase();
      // Filtrer les transactions contenant le terme dans la description ou la catégorie
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm) ||
        t.category.toLowerCase().includes(searchTerm)
      );
    }

    // Trier par date décroissante et retourner
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Calcul des statistiques financières
  getStats() {
    // Récupérer le mois et l'année actuels
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Filtrer les transactions du mois actuel
    const monthlyTransactions = this.transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    // Calculer les revenus mensuels
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculer les dépenses mensuelles
    const monthlyExpense = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculer le total des revenus
    const totalIncome = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculer le total des dépenses
    const totalExpense = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Retourner toutes les statistiques calculées
    return {
      balance: totalIncome - totalExpense,
      monthlyIncome,
      monthlyExpense,
      totalTransactions: this.transactions.length,
      totalIncome,
      totalExpense
    };
  }

  // Données pour les graphiques - Données mensuelles
  getMonthlyData() {
    // Objet pour stocker les données mensuelles
    const monthlyData = {};
    
    // Parcourir toutes les transactions
    this.transactions.forEach(transaction => {
      // Extraire le mois et l'année
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      // Initialiser le mois s'il n'existe pas
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }
      
      // Ajouter le montant au type correspondant
      monthlyData[monthKey][transaction.type] += transaction.amount;
    });

    // Retourner les données triées par mois, limitées aux 12 derniers mois
    return Object.keys(monthlyData)
      .sort()
      .slice(-12)
      .map(month => ({
        month,
        ...monthlyData[month]
      }));
  }

  // Données pour les graphiques - Données par catégorie
  getCategoryData() {
    // Objet pour stocker les données par catégorie
    const categoryData = {};
    
    // Filtrer uniquement les dépenses
    this.transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        // Initialiser la catégorie si elle n'existe pas
        if (!categoryData[transaction.category]) {
          categoryData[transaction.category] = 0;
        }
        // Ajouter le montant à la catégorie
        categoryData[transaction.category] += transaction.amount;
      });

    // Retourner les catégories triées par montant décroissant, limitées aux 8 premières
    return Object.keys(categoryData)
      .map(category => ({
        category,
        amount: categoryData[category]
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);
  }

  // Catégories prédéfinies pour les transactions
  getCategories() {
    // Catégories de revenus
    const incomeCategories = [
      'Salaire',
      'Freelance',
      'Investissements',
      'Allocations',
      'Remboursements',
      'Vente',
      'Autre revenu'
    ];

    // Catégories de dépenses
    const expenseCategories = [
      'Logement',
      'Alimentation',
      'Transport',
      'Santé',
      'Loisirs',
      'Vêtements',
      'Éducation',
      'Télécommunications',
      'Services financiers',
      'Assurances',
      'Autre dépense'
    ];

    // Retourner les catégories organisées par type
    return { income: incomeCategories, expense: expenseCategories };
  }

  // Utilitaires - Génération d'un ID unique
  generateId() {
    // Utiliser Date.now() et Math.random() pour créer un ID unique
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Utilitaires - Formatage d'un montant en devise
  formatCurrency(amount) {
    // Utiliser l'API Intl pour formater le montant en euros
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  // Utilitaires - Formatage d'une date
  formatDate(dateString) {
    // Formater la date selon le format français
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  }
}
