// Classe de gestion de l'interface utilisateur
// Cette classe gère toutes les interactions visuelles et les éléments d'interface
// y compris les modals, les formulaires, les filtres et l'affichage des transactions
export class UIManager {
  constructor() {
    // Initialisation des références aux éléments DOM principaux
    this.modal = document.getElementById('transaction-modal');
    this.overlay = document.getElementById('modal-overlay');
    this.form = document.getElementById('transaction-form');
    // Stocker les catégories disponibles
    this.categories = null;
  }

  // Gestion du modal - Ouverture
  openModal(title = 'Nouvelle Transaction') {
    // Mettre à jour le titre du modal
    document.getElementById('modal-title').textContent = title;
    // Mettre à jour le texte du bouton de soumission
    document.getElementById('submit-text').textContent = title.includes('Modifier') ? 'Modifier' : 'Ajouter';
    
    // Afficher le modal avec animation
    this.modal.classList.add('show');
    this.overlay.classList.add('show');
    
    // Mettre le focus sur le premier champ après un court délai
    setTimeout(() => {
      document.getElementById('transaction-type').focus();
    }, 100);

    // Réinitialiser le formulaire si c'est une nouvelle transaction
    if (!title.includes('Modifier')) {
      this.resetForm();
    }
  }

  // Gestion du modal - Fermeture
  closeModal() {
    // Masquer le modal avec animation
    this.modal.classList.remove('show');
    this.overlay.classList.remove('show');
    // Réinitialiser le formulaire
    this.resetForm();
  }

  // Réinitialisation du formulaire
  resetForm() {
    // Réinitialiser tous les champs du formulaire
    this.form.reset();
    // Supprimer l'ID d'édition si présent
    this.form.removeAttribute('data-editing-id');
    
    // Réinitialiser les catégories
    const categorySelect = document.getElementById('transaction-category');
    categorySelect.innerHTML = '<option value="">Sélectionner une catégorie</option>';
    
    // Remettre la date par défaut (aujourd'hui)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('transaction-date').value = today;
  }

  // Gestion du formulaire - Récupération des données
  getFormData() {
    // Récupérer les valeurs de tous les champs du formulaire
    return {
      type: document.getElementById('transaction-type').value,
      amount: document.getElementById('transaction-amount').value,
      category: document.getElementById('transaction-category').value,
      description: document.getElementById('transaction-description').value,
      date: document.getElementById('transaction-date').value
    };
  }

  // Pré-remplissage du formulaire avec des données existantes
  fillForm(transaction) {
    // Remplir chaque champ avec les données de la transaction
    document.getElementById('transaction-type').value = transaction.type;
    document.getElementById('transaction-amount').value = transaction.amount;
    document.getElementById('transaction-description').value = transaction.description;
    document.getElementById('transaction-date').value = transaction.date;
    
    // Mettre à jour les catégories selon le type puis sélectionner la bonne catégorie
    this.updateCategoriesForType(transaction.type);
    // Utiliser setTimeout pour attendre la mise à jour des catégories
    setTimeout(() => {
      document.getElementById('transaction-category').value = transaction.category;
    }, 50);
  }

  // Mise à jour des catégories selon le type de transaction
  updateCategoriesForType(type) {
    // Récupérer le sélecteur de catégories
    const categorySelect = document.getElementById('transaction-category');
    // Réinitialiser les options
    categorySelect.innerHTML = '<option value="">Sélectionner une catégorie</option>';

    // Vérifier que le type et les catégories sont définis
    if (!type || !this.categories) return;

    // Récupérer les catégories disponibles pour ce type
    const availableCategories = this.categories[type] || [];
    
    // Créer une option pour chaque catégorie
    availableCategories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  }

  // Gestion des filtres - Récupération des valeurs actuelles
  getFilters() {
    // Récupérer les valeurs de tous les filtres actifs
    return {
      category: document.getElementById('category-filter').value,
      type: document.getElementById('type-filter').value,
      search: document.getElementById('search-input').value.trim()
    };
  }

  // Mise à jour du filtre de catégories avec toutes les catégories disponibles
  updateCategoryFilter(categories) {
    // Stocker les catégories pour utilisation ultérieure
    this.categories = categories;
    const categoryFilter = document.getElementById('category-filter');
    
    // Sauvegarder la valeur actuelle du filtre
    const currentValue = categoryFilter.value;
    
    // Vider les options existantes
    categoryFilter.innerHTML = '<option value="">Toutes les catégories</option>';
    
    // Combiner toutes les catégories (revenus et dépenses)
    const allCategories = [...categories.income, ...categories.expense];
    // Supprimer les doublons et trier
    const uniqueCategories = [...new Set(allCategories)].sort();
    
    // Créer une option pour chaque catégorie unique
    uniqueCategories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
    
    // Restaurer la valeur précédente si elle existe encore
    categoryFilter.value = currentValue;
  }

  // Rendu des transactions - Affichage de la liste
  renderTransactions(transactions) {
    // Récupérer le conteneur de la liste
    const container = document.getElementById('transactions-list');
    
    // Si aucune transaction, vider le conteneur
    if (transactions.length === 0) {
      container.innerHTML = '';
      return;
    }

    // Générer le HTML pour chaque transaction et l'ajouter au conteneur
    container.innerHTML = transactions.map(transaction => this.createTransactionElement(transaction)).join('');
  }

  // Création d'un élément HTML pour une transaction
  createTransactionElement(transaction) {
    // Formater la date et le montant
    const formattedDate = this.formatDate(transaction.date);
    const formattedAmount = this.formatCurrency(transaction.amount);
    // Déterminer si c'est un revenu
    const isIncome = transaction.type === 'income';
    
    // Retourner le HTML complet pour l'affichage de la transaction
    return `
      <div class="transaction-item" data-transaction-id="${transaction.id}">
        <div class="transaction-left">
          <div class="transaction-icon ${transaction.type}">
            <i class="fas ${isIncome ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
          </div>
          <div class="transaction-details">
            <h4>${this.escapeHtml(transaction.description)}</h4>
            <p>${this.escapeHtml(transaction.category)}</p>
          </div>
        </div>
        <div class="transaction-right">
          <div class="transaction-amount">
            <span class="amount ${transaction.type}">
              ${isIncome ? '+' : '-'} ${formattedAmount}
            </span>
            <span class="date">${formattedDate}</span>
          </div>
          <div class="transaction-actions">
            <button class="action-btn edit-btn" title="Modifier">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn delete" title="Supprimer">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Utilitaires - Formatage d'un montant en devise
  formatCurrency(amount) {
    // Utiliser l'API Intl pour formater le montant en euros
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  // Utilitaires - Formatage d'une date avec texte relatif
  formatDate(dateString) {
    // Créer des objets Date pour la date donnée et maintenant
    const date = new Date(dateString);
    const now = new Date();
    // Calculer la différence en millisecondes
    const diffTime = Math.abs(now - date);
    // Convertir en jours
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Retourner des textes relatifs pour les dates récentes
    if (diffDays === 1) {
      return 'Aujourd\'hui';
    } else if (diffDays === 2) {
      return 'Hier';
    } else if (diffDays <= 7) {
      return `Il y a ${diffDays - 1} jours`;
    } else {
      // Pour les dates plus anciennes, formater avec le mois
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      }).format(date);
    }
  }

  // Utilitaires - Échappement HTML pour éviter les injections
  escapeHtml(text) {
    // Créer un élément div temporaire
    const div = document.createElement('div');
    // Définir le texte (échappe automatiquement le HTML)
    div.textContent = text;
    // Retourner le HTML échappé
    return div.innerHTML;
  }

  // Animations - Affichage d'un indicateur de chargement
  showLoading(element) {
    // Sauvegarder le contenu original
    const originalContent = element.innerHTML;
    // Remplacer par l'indicateur de chargement
    element.innerHTML = '<span class="loading"></span>';
    // Retourner le contenu original pour restauration
    return originalContent;
  }

  // Animations - Masquage de l'indicateur de chargement
  hideLoading(element, originalContent) {
    // Restaurer le contenu original
    element.innerHTML = originalContent;
  }

  // Gestion des erreurs - Affichage d'une erreur de champ
  showFieldError(fieldId, message) {
    // Récupérer le champ concerné
    const field = document.getElementById(fieldId);
    // Vérifier s'il y a déjà une erreur affichée
    const existingError = field.parentNode.querySelector('.field-error');
    
    // Supprimer l'erreur existante si présente
    if (existingError) {
      existingError.remove();
    }
    
    // Créer un nouvel élément d'erreur
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    // Appliquer le style CSS pour l'erreur
    errorElement.style.cssText = `
      color: var(--danger-color);
      font-size: 0.75rem;
      margin-top: 0.25rem;
    `;
    
    // Ajouter l'erreur après le champ
    field.parentNode.appendChild(errorElement);
    // Changer la couleur de bordure du champ
    field.style.borderColor = 'var(--danger-color)';
    
    // Supprimer l'erreur après la première interaction
    field.addEventListener('input', () => {
      this.clearFieldError(fieldId);
    }, { once: true });
  }

  // Gestion des erreurs - Suppression d'une erreur de champ
  clearFieldError(fieldId) {
    // Récupérer le champ concerné
    const field = document.getElementById(fieldId);
    // Récupérer l'élément d'erreur
    const error = field.parentNode.querySelector('.field-error');
    
    // Supprimer l'élément d'erreur s'il existe
    if (error) {
      error.remove();
    }
    
    // Restaurer la couleur de bordure par défaut
    field.style.borderColor = '';
  }

  // Gestion des erreurs - Suppression de toutes les erreurs
  clearAllFieldErrors() {
    // Supprimer tous les éléments d'erreur
    document.querySelectorAll('.field-error').forEach(error => error.remove());
    // Restaurer la couleur de bordure pour tous les champs
    document.querySelectorAll('input, select').forEach(field => {
      field.style.borderColor = '';
    });
  }
}
