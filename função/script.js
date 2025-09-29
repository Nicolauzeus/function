class FunctionPlotter {
    constructor() {
        this.chart = null;
        this.currentFunctionType = 'linear';
        this.init();
    }

    init() {
        this.createCoefficientInputs();
        this.setupEventListeners();
        this.plotFunction();
    }

    createCoefficientInputs() {
        const coefficientsDiv = document.querySelector('.coefficients');
        
        const coefficientTemplates = {
            linear: [
                { id: 'a', label: 'a (coeficiente angular)', value: '1' },
                { id: 'b', label: 'b (coeficiente linear)', value: '0' }
            ],
            quadratic: [
                { id: 'a', label: 'a (coeficiente quadrático)', value: '1' },
                { id: 'b', label: 'b (coeficiente linear)', value: '0' },
                { id: 'c', label: 'c (termo constante)', value: '0' }
            ],
            cubic: [
                { id: 'a', label: 'a (coeficiente cúbico)', value: '1' },
                { id: 'b', label: 'b (coeficiente quadrático)', value: '0' },
                { id: 'c', label: 'c (coeficiente linear)', value: '0' },
                { id: 'd', label: 'd (termo constante)', value: '0' }
            ]
        };

        this.updateCoefficientInputs(coefficientTemplates.linear);
    }

    updateCoefficientInputs(coefficients) {
        const coefficientsDiv = document.querySelector('.coefficients');
        coefficientsDiv.innerHTML = '';

        coefficients.forEach(coef => {
            const div = document.createElement('div');
            div.className = 'coefficient-input';
            div.innerHTML = `
                <label for="${coef.id}">${coef.label}</label>
                <input type="number" id="${coef.id}" value="${coef.value}" step="0.1">
            `;
            coefficientsDiv.appendChild(div);
        });
    }

    setupEventListeners() {
        document.getElementById('functionType').addEventListener('change', (e) => {
            this.currentFunctionType = e.target.value;
            this.updateCoefficientInputsForType();
            this.plotFunction();
        });

        document.getElementById('plotButton').addEventListener('click', () => {
            this.plotFunction();
        });

        document.getElementById('clearButton').addEventListener('click', () => {
            this.clearChart();
        });

        // Atualizar quando coeficientes mudarem
        document.querySelector('.coefficients').addEventListener('input', () => {
            this.plotFunction();
        });

        document.getElementById('xMin').addEventListener('change', () => {
            this.plotFunction();
        });

        document.getElementById('xMax').addEventListener('change', () => {
            this.plotFunction();
        });
    }

    updateCoefficientInputsForType() {
        const templates = {
            linear: [
                { id: 'a', label: 'a (coeficiente angular)', value: '1' },
                { id: 'b', label: 'b (coeficiente linear)', value: '0' }
            ],
            quadratic: [
                { id: 'a', label: 'a (coeficiente quadrático)', value: '1' },
                { id: 'b', label: 'b (coeficiente linear)', value: '0' },
                { id: 'c', label: 'c (termo constante)', value: '0' }
            ],
            cubic: [
                { id: 'a', label: 'a (coeficiente cúbico)', value: '1' },
                { id: 'b', label: 'b (coeficiente quadrático)', value: '0' },
                { id: 'c', label: 'c (coeficiente linear)', value: '0' },
                { id: 'd', label: 'd (termo constante)', value: '0' }
            ]
        };

        this.updateCoefficientInputs(templates[this.currentFunctionType]);
    }

    getCoefficients() {
        const coefficients = {};
        const inputs = document.querySelectorAll('.coefficients input');
        
        inputs.forEach(input => {
            coefficients[input.id] = parseFloat(input.value) || 0;
        });

        return coefficients;
    }

    calculateFunction(x, coefficients) {
        switch (this.currentFunctionType) {
            case 'linear':
                return coefficients.a * x + coefficients.b;
            case 'quadratic':
                return coefficients.a * x * x + coefficients.b * x + coefficients.c;
            case 'cubic':
                return coefficients.a * x * x * x + coefficients.b * x * x + coefficients.c * x + coefficients.d;
            default:
                return 0;
        }
    }

    generateData() {
        const coefficients = this.getCoefficients();
        const xMin = parseFloat(document.getElementById('xMin').value) || -5;
        const xMax = parseFloat(document.getElementById('xMax').value) || 5;
        
        const data = [];
        const step = (xMax - xMin) / 100;

        for (let x = xMin; x <= xMax; x += step) {
            const y = this.calculateFunction(x, coefficients);
            data.push({ x, y });
        }

        return data;
    }

    getFunctionExpression() {
        const coef = this.getCoefficients();
        
        switch (this.currentFunctionType) {
            case 'linear':
                return `f(x) = ${coef.a}x ${coef.b >= 0 ? '+' : ''} ${coef.b}`;
            case 'quadratic':
                return `f(x) = ${coef.a}x² ${coef.b >= 0 ? '+' : ''} ${coef.b}x ${coef.c >= 0 ? '+' : ''} ${coef.c}`;
            case 'cubic':
                return `f(x) = ${coef.a}x³ ${coef.b >= 0 ? '+' : ''} ${coef.b}x² ${coef.c >= 0 ? '+' : ''} ${coef.c}x ${coef.d >= 0 ? '+' : ''} ${coef.d}`;
        }
    }

    calculateFunctionInfo() {
        const coef = this.getCoefficients();
        const info = [];
        
        info.push(`<strong>Expressão:</strong> ${this.getFunctionExpression()}`);

        switch (this.currentFunctionType) {
            case 'linear':
                if (coef.a !== 0) {
                    const raiz = -coef.b / coef.a;
                    info.push(`<strong>Raiz:</strong> x = ${raiz.toFixed(2)}`);
                    info.push(`<strong>Coeficiente angular:</strong> ${coef.a}`);
                    info.push(`<strong>Coeficiente linear:</strong> ${coef.b}`);
                }
                break;

            case 'quadratic':
                const delta = coef.b * coef.b - 4 * coef.a * coef.c;
                info.push(`<strong>Δ (delta):</strong> ${delta.toFixed(2)}`);
                
                if (delta >= 0) {
                    const x1 = (-coef.b + Math.sqrt(delta)) / (2 * coef.a);
                    const x2 = (-coef.b - Math.sqrt(delta)) / (2 * coef.a);
                    info.push(`<strong>Raízes:</strong> x₁ = ${x1.toFixed(2)}, x₂ = ${x2.toFixed(2)}`);
                } else {
                    info.push(`<strong>Raízes:</strong> Não reais`);
                }
                
                if (coef.a !== 0) {
                    const xv = -coef.b / (2 * coef.a);
                    const yv = this.calculateFunction(xv, coef);
                    info.push(`<strong>Vértice:</strong> (${xv.toFixed(2)}, ${yv.toFixed(2)})`);
                }
                break;

            case 'cubic':
                // Informações básicas para função cúbica
                info.push(`<strong>Grau:</strong> 3`);
                info.push(`<strong>Comportamento:</strong> ${coef.a > 0 ? 'Crescente' : 'Decrescente'} para x → ±∞`);
                break;
        }

        return info;
    }

    plotFunction() {
        const data = this.generateData();
        const ctx = document.getElementById('functionChart').getContext('2d');

        // Destruir chart anterior se existir
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: this.getFunctionExpression(),
                    data: data,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'x'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'f(x)'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });

        this.updateFunctionInfo();
    }

    updateFunctionInfo() {
        const info = this.calculateFunctionInfo();
        const infoContent = document.getElementById('infoContent');
        
        infoContent.innerHTML = info.map(item => 
            `<div class="info-item">${item}</div>`
        ).join('');
    }

    clearChart() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        
        document.getElementById('infoContent').innerHTML = '';
        this.updateCoefficientInputsForType();
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new FunctionPlotter();
});
