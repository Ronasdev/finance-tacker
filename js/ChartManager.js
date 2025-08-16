// Classe de gestion des graphiques et visualisations
// Cette classe gère l'affichage des graphiques mensuels et par catégorie
export class ChartManager {
  constructor() {
    // Initialisation des références aux éléments DOM
    this.monthlyChartCanvas = document.getElementById('monthly-chart');
    this.categoryChartContainer = document.getElementById('category-chart');
    this.monthlyChart = null;
    
    // Initialiser le graphique mensuel
    this.initializeMonthlyChart();
  }

  // Initialisation du graphique mensuel
  initializeMonthlyChart() {
    // Vérifier que le canvas existe
    if (!this.monthlyChartCanvas) return;
    
    // Récupérer le contexte 2D du canvas
    const ctx = this.monthlyChartCanvas.getContext('2d');
    
    // Configuration des dimensions du graphique
    this.chartWidth = this.monthlyChartCanvas.width = 800;
    this.chartHeight = this.monthlyChartCanvas.height = 300;
    
    // Ajustement pour les écrans haute résolution (Retina)
    const dpr = window.devicePixelRatio || 1;
    this.monthlyChartCanvas.width = this.chartWidth * dpr;
    this.monthlyChartCanvas.height = this.chartHeight * dpr;
    ctx.scale(dpr, dpr);
    
    // Configuration du style responsive
    this.monthlyChartCanvas.style.width = '100%';
    this.monthlyChartCanvas.style.height = '300px';
  }

  // Mise à jour du graphique mensuel avec de nouvelles données
  updateMonthlyChart(transactions) {
    // Traiter les données mensuelles
    const monthlyData = this.getMonthlyData(transactions);
    // Dessiner le graphique avec les données traitées
    this.drawMonthlyChart(monthlyData);
  }

  // Mise à jour du graphique par catégorie
  updateCategoryChart(transactions) {
    // Traiter les données par catégorie
    const categoryData = this.getCategoryData(transactions);
    // Afficher le graphique par catégorie
    this.drawCategoryChart(categoryData);
  }

  // Traitement des données mensuelles
  getMonthlyData(transactions) {
    // Objet pour stocker les données mensuelles
    const monthlyData = {};
    const months = [];
    
    // Créer les 6 derniers mois
    for (let i = 5; i >= 0; i--) {
      // Calculer la date pour chaque mois
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('fr-FR', { month: 'short' });
      
      // Stocker les informations du mois
      months.push(monthKey);
      monthlyData[monthKey] = {
        month: monthLabel,
        income: 0,
        expense: 0
      };
    }
    
    // Remplir avec les données des transactions
    transactions.forEach(transaction => {
      // Extraire le mois de la transaction
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      // Ajouter le montant au mois correspondant
      if (monthlyData[monthKey]) {
        monthlyData[monthKey][transaction.type] += transaction.amount;
      }
    });

    // Retourner les données dans l'ordre chronologique
    return months.map(month => monthlyData[month]);
  }

  // Traitement des données par catégorie
  getCategoryData(transactions) {
    // Objet pour stocker les données par catégorie
    const categoryData = {};
    
    // Filtrer uniquement les dépenses et les regrouper par catégorie
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        // Initialiser la catégorie si elle n'existe pas
        if (!categoryData[transaction.category]) {
          categoryData[transaction.category] = 0;
        }
        // Ajouter le montant à la catégorie
        categoryData[transaction.category] += transaction.amount;
      });

    // Retourner les catégories triées par montant décroissant
    return Object.keys(categoryData)
      .map(category => ({
        category,
        amount: categoryData[category]
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6); // Limiter aux 6 premières catégories
  }

  // Dessin du graphique mensuel
  drawMonthlyChart(data) {
    // Vérifier que le canvas existe
    if (!this.monthlyChartCanvas) return;
    
    // Récupérer le contexte 2D
    const ctx = this.monthlyChartCanvas.getContext('2d');
    
    // Configuration des marges et dimensions
    const padding = 60;
    const chartWidth = this.chartWidth - 2 * padding;
    const chartHeight = this.chartHeight - 2 * padding;
    
    // Nettoyer le canvas avant de redessiner
    ctx.clearRect(0, 0, this.chartWidth, this.chartHeight);
    
    // Vérifier s'il y a des données à afficher
    if (data.length === 0) {
      // Afficher un message si aucune donnée n'est disponible
      this.drawEmptyChart(ctx, 'Aucune donnée disponible');
      return;
    }
    
    // Calculer la valeur maximale pour l'échelle
    const maxValue = Math.max(...data.map(d => Math.max(d.income, d.expense))) * 1.1;
    const barWidth = chartWidth / (data.length * 2 + data.length);
    
    // Configuration du style des axes
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    
    // Dessiner l'axe Y
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.stroke();
    
    // Dessiner l'axe X
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();
    
    // Dessiner la grille horizontale
    ctx.strokeStyle = '#F3F4F6';
    for (let i = 1; i <= 4; i++) {
      const y = padding + (chartHeight * i) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }
    
    // Afficher les valeurs sur l'axe Y
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Inter';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const value = maxValue * (4 - i) / 4;
      const y = padding + (chartHeight * i) / 4;
      ctx.fillText(this.formatCurrency(value), padding - 10, y + 5);
    }
    
    // Dessiner les barres de données
    data.forEach((item, index) => {
      // Calculer la position X de la barre
      const x = padding + index * (barWidth * 2 + barWidth / 2) + barWidth / 4;
      
      // Dessiner la barre des revenus
      const incomeHeight = (item.income / maxValue) * chartHeight;
      ctx.fillStyle = '#10B981'; // Couleur verte pour les revenus
      ctx.fillRect(x, padding + chartHeight - incomeHeight, barWidth, incomeHeight);
      
      // Dessiner la barre des dépenses
      const expenseHeight = (item.expense / maxValue) * chartHeight;
      ctx.fillStyle = '#EF4444'; // Couleur rouge pour les dépenses
      ctx.fillRect(x + barWidth + 5, padding + chartHeight - expenseHeight, barWidth, expenseHeight);
      
      // Afficher les labels des mois
      ctx.fillStyle = '#6B7280';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(item.month, x + barWidth / 2 + 2.5, padding + chartHeight + 20);
    });
    
    // Dessiner la légende du graphique
    this.drawLegend(ctx);
  }

  // Dessin du graphique par catégorie
  drawCategoryChart(data) {
    // Vérifier que le conteneur existe
    if (!this.categoryChartContainer) return;
    
    // Vérifier s'il y a des données à afficher
    if (data.length === 0) {
      // Afficher un message si aucune donnée n'est disponible
      this.categoryChartContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-secondary); padding: 3rem;">
          <i class="fas fa-chart-pie" style="font-size: 2rem; opacity: 0.3;"></i>
          <p style="margin-top: 1rem;">Aucune dépense à afficher</p>
        </div>
      `;
      return;
    }
    
    // Calculer le total des dépenses
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    
    // Définir une palette de couleurs pour les catégories
    const colors = [
      '#EF4444', '#F97316', '#F59E0B', '#EAB308',
      '#84CC16', '#22C55E', '#06B6D4', '#3B82F6'
    ];
    
    // Générer le HTML pour afficher les catégories
    this.categoryChartContainer.innerHTML = data.map((item, index) => {
      // Calculer le pourcentage
      const percentage = (item.amount / total * 100).toFixed(1);
      // Sélectionner une couleur de la palette
      const color = colors[index % colors.length];
      
      return `
        <div class="category-item">
          <div class="category-info">
            <div class="category-color" style="background: ${color}"></div>
            <span class="category-name">${item.category}</span>
          </div>
          <div class="category-amount">${this.formatCurrency(item.amount)} (${percentage}%)</div>
          <div class="category-bar">
            <div class="category-progress" style="width: ${percentage}%; background: ${color}"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Dessin de la légende du graphique
  drawLegend(ctx) {
    // Position de la légende
    const legendY = this.chartHeight - 20;
    const legendX = this.chartWidth / 2 - 80;
    
    // Configuration du style du texte
    ctx.font = '12px Inter';
    ctx.textAlign = 'left';
    
    // Légende pour les revenus
    ctx.fillStyle = '#10B981';
    ctx.fillRect(legendX, legendY, 15, 12);
    ctx.fillStyle = '#6B7280';
    ctx.fillText('Revenus', legendX + 20, legendY + 9);
    
    // Légende pour les dépenses
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(legendX + 80, legendY, 15, 12);
    ctx.fillStyle = '#6B7280';
    ctx.fillText('Dépenses', legendX + 105, legendY + 9);
  }

  // Dessin d'un graphique vide avec message
  drawEmptyChart(ctx, message) {
    // Configuration du style du texte
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '16px Inter';
    ctx.textAlign = 'center';
    // Afficher le message au centre du graphique
    ctx.fillText(message, this.chartWidth / 2, this.chartHeight / 2);
  }

  // Formatage d'un montant pour l'affichage
  formatCurrency(amount) {
    // Formater les grands montants en utilisant 'k' pour les milliers
    if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'k€';
    }
    return Math.round(amount) + '€';
  }

  // Gestion du redimensionnement responsive
  handleResize() {
    // Récupérer le conteneur parent
    const container = this.monthlyChartCanvas.parentElement;
    const newWidth = container.offsetWidth;
    
    // Vérifier si la largeur a changé
    if (newWidth !== this.chartWidth) {
      // Mettre à jour la largeur et redessiner le graphique
      this.chartWidth = newWidth;
      this.initializeMonthlyChart();
    }
  }
}

// Écouter les changements de taille de la fenêtre
window.addEventListener('resize', () => {
  // Vérifier que le gestionnaire de graphiques existe
  if (window.chartManager) {
    window.chartManager.handleResize();
  }
});
