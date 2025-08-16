// Import des classes de gestion depuis leurs fichiers respectifs
// Ces modules gèrent différentes parties de l'application
import { FinanceManager } from './js/FinanceManager.js';
import { UIManager } from './js/UIManager.js';
import { ChartManager } from './js/ChartManager.js';

// Classe principale de l'application Finance Tracker
// Cette classe coordonne toutes les fonctionnalités de l'application
class FinanceApp {
  constructor() {
    // Initialisation des gestionnaires principaux
    // Chaque gestionnaire a une responsabilité spécifique
    this.financeManager = new FinanceManager(); // Gère les données financières
    this.uiManager = new UIManager(); // Gère l'interface utilisateur
    this.chartManager = new ChartManager(); // Gère les graphiques et visualisations
    
    // Lancer l'initialisation de l'application
    this.init();
  }

  // Méthode d'initialisation principale
  init() {
    // Vérifier si le DOM est déjà chargé ou non
    // Si le DOM est encore en cours de chargement, attendre qu'il soit prêt
    if (document.readyState === 'loading') {
      // Ajouter un écouteur d'événement pour le chargement complet du DOM
      document.addEventListener('DOMContentLoaded', () => this.initializeApp());
    } else {
      // Si le DOM est déjà chargé, initialiser immédiatement
      this.initializeApp();
    }
  }

  // Méthode d'initialisation de l'application
  initializeApp() {
    // Étape 1: Charger les données financières depuis le stockage local
    this.financeManager.loadData();
    
    // Étape 2: Configurer tous les écouteurs d'événements de l'interface
    this.setupEventListeners();
    
    // Étape 3: Mettre à jour l'interface avec les données chargées
    this.updateUI();
    
    // Étape 4: Définir la date par défaut dans le formulaire
    this.setDefaultDate();
  }

  // Configuration de tous les écouteurs d'événements de l'application
  setupEventListeners() {
    // Récupération de tous les éléments DOM nécessaires
    // Vérification de l'existence de chaque élément avant d'ajouter des écouteurs
    const addBtn = document.getElementById('add-transaction-btn');
    const exportBtn = document.getElementById('export-btn');
    const closeBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const overlay = document.getElementById('modal-overlay');
    const form = document.getElementById('transaction-form');
    const typeSelect = document.getElementById('transaction-type');
    const categoryFilter = document.getElementById('category-filter');
    const typeFilter = document.getElementById('type-filter');
    const searchInput = document.getElementById('search-input');
    const transactionsList = document.getElementById('transactions-list');

    // Écouteur pour le bouton d'ajout de transaction
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        // Ouvrir le modal d'ajout de transaction
        this.uiManager.openModal();
      });
    }

    // Écouteur pour le bouton d'export des données
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        // Exporter les données vers un fichier CSV
        this.exportData();
      });
    }

    // Écouteur pour le bouton de fermeture du modal
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        // Fermer le modal
        this.uiManager.closeModal();
      });
    }

    // Écouteur pour le bouton d'annulation
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        // Fermer le modal et annuler l'opération
        this.uiManager.closeModal();
      });
    }

    // Écouteur pour le clic sur l'overlay (fond sombre du modal)
    if (overlay) {
      overlay.addEventListener('click', () => {
        // Fermer le modal si on clique en dehors
        this.uiManager.closeModal();
      });
    }

    // Écouteur pour la soumission du formulaire
    if (form) {
      form.addEventListener('submit', (e) => {
        // Empêcher le rechargement de la page par défaut
        e.preventDefault();
        // Traiter la soumission du formulaire
        this.handleFormSubmit();
      });
    }

    // Écouteur pour le changement de type de transaction
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        // Mettre à jour les catégories disponibles selon le type
        this.uiManager.updateCategoriesForType(e.target.value);
      });
    }

    // Écouteur pour le filtre par catégorie
    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => {
        // Mettre à jour la liste des transactions filtrées
        this.updateTransactionsList();
      });
    }

    // Écouteur pour le filtre par type
    if (typeFilter) {
      typeFilter.addEventListener('change', () => {
        // Mettre à jour la liste des transactions filtrées
        this.updateTransactionsList();
      });
    }

    // Écouteur pour la recherche en temps réel
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        // Mettre à jour la liste des transactions filtrées
        this.updateTransactionsList();
      });
    }

    // Écouteur pour les actions sur les transactions (éditer/supprimer)
    if (transactionsList) {
      transactionsList.addEventListener('click', (e) => {
        // Récupérer l'ID de la transaction cliquée
        const transactionId = e.target.closest('.transaction-item')?.dataset.transactionId;
        
        // Vérifier quel bouton a été cliqué
        if (e.target.closest('.edit-btn') && transactionId) {
          // Éditer la transaction
          this.editTransaction(transactionId);
        } else if (e.target.closest('.delete-btn') && transactionId) {
          // Supprimer la transaction
          this.deleteTransaction(transactionId);
        }
      });
    }
  }

  // Traitement de la soumission du formulaire
  handleFormSubmit() {
    // Récupérer les données du formulaire
    const formData = this.uiManager.getFormData();
    
    // Valider les données du formulaire
    if (!this.validateFormData(formData)) {
      // Si validation échouée, arrêter le traitement
      return;
    }

    // Récupérer le formulaire et vérifier si on est en mode édition
    const form = document.getElementById('transaction-form');
    const editingId = form?.dataset.editingId;
    
    // Traiter selon le mode (ajout ou édition)
    if (editingId) {
      // Mode édition: mettre à jour la transaction existante
      this.financeManager.updateTransaction(editingId, formData);
    } else {
      // Mode ajout: créer une nouvelle transaction
      this.financeManager.addTransaction(formData);
    }

    // Fermer le modal et mettre à jour l'interface
    this.uiManager.closeModal();
    this.updateUI();
    // Afficher une notification de succès
    this.showNotification('Transaction enregistrée avec succès', 'success');
  }

  // Validation des données du formulaire
  validateFormData(data) {
    // Vérifier que tous les champs requis sont remplis
    if (!data.type || !data.amount || !data.category || !data.description || !data.date) {
      // Afficher une notification d'erreur
      this.showNotification('Veuillez remplir tous les champs', 'error');
      return false;
    }

    // Vérifier que le montant est positif
    if (data.amount <= 0) {
      // Afficher une notification d'erreur
      this.showNotification('Le montant doit être supérieur à zéro', 'error');
      return false;
    }

    // Validation réussie
    return true;
  }

  // Méthode pour éditer une transaction
  editTransaction(id) {
    // Récupérer la transaction à éditer
    const transaction = this.financeManager.getTransaction(id);
    if (transaction) {
      // Ouvrir le modal en mode édition
      this.uiManager.openModal('Modifier la Transaction');
      // Pré-remplir le formulaire avec les données existantes
      this.uiManager.fillForm(transaction);
      // Stocker l'ID de la transaction en cours d'édition
      const form = document.getElementById('transaction-form');
      if (form) {
        form.dataset.editingId = id;
      }
    }
  }

  // Méthode pour supprimer une transaction
  deleteTransaction(id) {
    // Demander confirmation à l'utilisateur
    if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      // Supprimer la transaction
      this.financeManager.deleteTransaction(id);
      // Mettre à jour l'interface
      this.updateUI();
      // Afficher une notification de succès
      this.showNotification('Transaction supprimée', 'success');
    }
  }

  // Mise à jour complète de l'interface utilisateur
  updateUI() {
    // Mettre à jour les statistiques
    this.updateStats();
    // Mettre à jour la liste des transactions
    this.updateTransactionsList();
    // Mettre à jour les graphiques
    this.updateCharts();
    // Mettre à jour le filtre de catégories
    this.uiManager.updateCategoryFilter(this.financeManager.getCategories());
  }

  // Mise à jour des statistiques affichées
  updateStats() {
    // Récupérer les statistiques depuis le gestionnaire financier
    const stats = this.financeManager.getStats();
    
    // Récupérer les éléments DOM pour afficher les statistiques
    const balanceEl = document.getElementById('balance-value');
    const incomeEl = document.getElementById('income-value');
    const expenseEl = document.getElementById('expense-value');
    const countEl = document.getElementById('transactions-count');

    // Mettre à jour le solde
    if (balanceEl) {
      balanceEl.textContent = this.formatCurrency(stats.balance);
      // Appliquer une classe CSS différente si le solde est négatif
      balanceEl.className = stats.balance >= 0 ? 'stat-value' : 'stat-value negative';
    }

    // Mettre à jour les revenus mensuels
    if (incomeEl) {
      incomeEl.textContent = this.formatCurrency(stats.monthlyIncome);
    }

    // Mettre à jour les dépenses mensuelles
    if (expenseEl) {
      expenseEl.textContent = this.formatCurrency(stats.monthlyExpense);
    }

    // Mettre à jour le nombre total de transactions
    if (countEl) {
      countEl.textContent = stats.totalTransactions;
    }
  }

  // Mise à jour de la liste des transactions filtrées
  updateTransactionsList() {
    // Récupérer les filtres actifs
    const filters = this.uiManager.getFilters();
    // Récupérer les transactions filtrées
    const filteredTransactions = this.financeManager.getFilteredTransactions(filters);
    
    // Afficher les transactions filtrées
    this.uiManager.renderTransactions(filteredTransactions);
    
    // Gérer l'affichage du message "aucune transaction"
    const noTransactionsEl = document.getElementById('no-transactions');
    const transactionsListEl = document.getElementById('transactions-list');
    
    if (filteredTransactions.length === 0) {
      // Afficher le message "aucune transaction"
      if (noTransactionsEl) noTransactionsEl.style.display = 'block';
      if (transactionsListEl) transactionsListEl.style.display = 'none';
    } else {
      // Cacher le message et afficher la liste
      if (noTransactionsEl) noTransactionsEl.style.display = 'none';
      if (transactionsListEl) transactionsListEl.style.display = 'flex';
    }
  }

  // Mise à jour des graphiques
  updateCharts() {
    // Récupérer toutes les transactions
    const transactions = this.financeManager.getAllTransactions();
    // Mettre à jour le graphique mensuel
    this.chartManager.updateMonthlyChart(transactions);
    // Mettre à jour le graphique par catégorie
    this.chartManager.updateCategoryChart(transactions);
  }

  // Export des données vers CSV
  exportData() {
    // Récupérer toutes les transactions
    const transactions = this.financeManager.getAllTransactions();
    // Générer le contenu CSV
    const csvContent = this.generateCSV(transactions);
    // Télécharger le fichier CSV
    this.downloadCSV(csvContent, 'transactions.csv');
    // Afficher une notification de succès
    this.showNotification('Données exportées avec succès', 'success');
  }

  // Génération du contenu CSV
  generateCSV(transactions) {
    // Définir les en-têtes du CSV
    const headers = ['Date', 'Type', 'Catégorie', 'Description', 'Montant'];
    
    // Transformer les transactions en lignes CSV
    const rows = transactions.map(t => [
      t.date,
      t.type === 'income' ? 'Revenu' : 'Dépense',
      t.category,
      t.description,
      t.amount.toFixed(2)
    ]);

    // Construire le contenu CSV complet
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  // Téléchargement du fichier CSV
  downloadCSV(content, filename) {
    // Créer un blob avec le contenu CSV
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Configurer le lien de téléchargement
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    // Ajouter le lien au DOM, cliquer, puis le supprimer
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Définir la date par défaut dans le formulaire
  setDefaultDate() {
    const dateInput = document.getElementById('transaction-date');
    if (dateInput) {
      // Définir la date d'aujourd'hui comme date par défaut
      const today = new Date().toISOString().split('T')[0];
      dateInput.value = today;
    }
  }

  // Formatage d'un montant en devise locale
  formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  // Affichage d'une notification temporaire
  showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Ajouter la notification au DOM
    document.body.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Animation de sortie après 3 secondes
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      // Supprimer la notification du DOM après l'animation
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Initialiser l'application au chargement
new FinanceApp();
