class FunctionPlotter {
    constructor() {
        this.chart = null;
        this.currentFunctionType = 'linear';
        this.xMin = -5;
        this.xMax = 5;
        this.yMin = -10;
        this.yMax = 10;
        this.zoomFactor = 1.2;
        
        this.init();
    }

    init() {
        this.createCoefficientInputs();
        this.setupEventListeners();
        this.plotFunction();
    }

    createCoefficientInputs() {
        this.updateCoefficientInputsForType();
    }

    updateCoefficientInputsForType() {
        const coefficientsDiv = document.querySelector('.coefficients');
        
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

        coefficientsDiv.innerHTML = '';
        const coefficients = templates[this.currentFunctionType];

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

        document.getElementById('zoomIn').addEventListener('click', () => {
            this.zoom(1/this.zoomFactor);
        });

        document.getElementById('zoomOut').addEventListener('click', () => {
            this.zoom(this.zoomFactor);
        });

        document.getElementById('resetZoom').addEventListener('click', () => {
            this.resetZoom();
        });

        document.getElementById('showGrid').addEventListener('change', () => {
            this.plotFunction();
        });

        document.getElementById('showAxis').addEventListener('change', () => {
            this.plotFunction();
        });

        // Atualizar quando coeficientes mudarem
        document.querySelector('.coefficients').addEventListener('input', () => {
            this.plotFunction();
        });
    }

    zoom(factor) {
        const xRange = this.xMax - this.xMin;
        const yRange = this.yMax - this.yMin;
        const xCenter = (this.xMin + this.xMax) / 2;
        const yCenter = (this.yMin + this.yMax) / 2;

        this.xMin = xCenter - (xRange * factor) / 2;
        this.xMax = xCenter + (xRange * factor) / 2;
        this.yMin = yCenter - (yRange * factor) / 2;
        this.yMax = yCenter + (yRange * factor) / 2;

        this.updateRangeDisplay();
        this.plotFunction();
    }

    resetZoom() {
        this.xMin = -5;
        this.xMax = 5;
        this.yMin = -10;
        this.yMax = 10;
        
        this.updateRangeDisplay();
        this.plotFunction();
    }

    updateRangeDisplay() {
        document.getElementById('xRange').textContent = `${this.xMin.toFixed(1)} a ${this.xMax.toFixed(1)}`;
        document.getElementById('yRange').textContent = `${this.yMin.toFixed(1)} a ${this.yMax.toFixed(1)}`;
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
        const data = [];
        const step = (this.xMax - this.xMin) / 200;

        for (let x = this.xMin; x <= this.xMax; x += step) {
            const y = this.calculateFunction(x, coefficients);
            if (Math.abs(y) <= 1000) { // Limitar valores muito grandes
                data.push({ x, y });
            }
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
                    info.push(`<strong>Intersecção Y:</strong> (0, ${coef.b})`);
                }
                break;

            case 'quadratic':
                const delta = coef.b * coef.b - 4 * coef.a * coef.c;
                info.push(`<strong>Δ (delta):</strong> ${delta.toFixed(2)}`);
                
                if (delta >= 0 && coef.a !== 0) {
                    const x1 = (-coef.b + Math.sqrt(delta)) / (2 * coef.a);
                    const x2 = (-coef.b - Math.sqrt(delta)) / (2 * coef.a);
                    info.push(`<strong>Raízes:</strong> x₁ = ${x1.toFixed(2)}, x₂ = ${x2.toFixed(2)}`);
                } else if (coef.a !== 0) {
                    info.push(`<strong>Raízes:</strong> Não reais`);
                }
                
                if (coef.a !== 0) {
                    const xv = -coef.b / (2 * coef.a);
                    const yv = this.calculateFunction(xv, coef);
                    info.push(`<strong>Vértice:</strong> (${xv.toFixed(2)}, ${yv.toFixed(2)})`);
                    info.push(`<strong>Concavidade:</strong> ${coef.a > 0 ? 'Para cima' : 'Para baixo'}`);
                }
                break;

            case 'cubic':
                info.push(`<strong>Grau:</strong> 3`);
                info.push(`<strong>Comportamento:</strong> ${coef.a > 0 ? 
                    '→ -∞ quando x → -∞, → +∞ quando x → +∞' : 
                    '→ +∞ quando x → -∞, → -∞ quando x → +∞'}`);
                
                // Encontrar raízes aproximadas
                const roots = this.findCubicRoots(coef);
                if (roots.length > 0) {
                    info.push(`<strong>Raízes reais:</strong> ${roots.map(r => r.toFixed(2)).join(', ')}`);
                }
                break;
        }

        return info;
    }

    findCubicRoots(coef) {
        // Método simples para encontrar raízes reais aproximadas
        const roots = [];
        const step = 0.1;
        
        for (let x = -10; x <= 10; x += step) {
            const y1 = this.calculateFunction(x, coef);
            const y2 = this.calculateFunction(x + step, coef);
            
            if (y1 * y2 <= 0) {
                // Encontrou mudança de sinal - raiz aproximada
                const root = x + step/2;
                roots.push(root);
            }
        }
        
        return roots;
    }

    plotFunction() {
        const data = this.generateData();
        const ctx = document.getElementById('functionChart').getContext('2d');
        const showGrid = document.getElementById('showGrid').checked;
        const showAxis = document.getElementById('showAxis').checked;

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
                    tension: 0,
                    pointRadius: 0,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'center',
                        title: {
                            display: true,
                            text: 'Eixo X',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        min: this.xMin,
                        max: this.xMax,
                        grid: {
                            color: showGrid ? 'rgba(0,0,0,0.1)' : 'transparent',
                            drawBorder: showAxis,
                            drawTicks: showAxis
                        },
                        ticks: {
                            display: showAxis,
                            callback: function(value) {
                                return value % 1 === 0 ? value : value.toFixed(1);
                            }
                        }
                    },
                    y: {
                        type: 'linear',
                        position: 'center',
                        title: {
                            display: true,
                            text: 'Eixo Y',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        min: this.yMin,
                        max: this.yMax,
                        grid: {
                            color: showGrid ? 'rgba(0,0,0,0.1)' : 'transparent',
                            drawBorder: showAxis,
                            drawTicks: showAxis
                        },
                        ticks: {
                            display: showAxis,
                            callback: function(value) {
                                return value % 1 === 0 ? value : value.toFixed(1);
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            color: '#495057'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `(${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                },
                elements: {
                    line: {
                        tension: 0 // Linhas retas entre pontos
                    }
                }
            }
        });

        this.updateFunctionInfo();
        this.updateRangeDisplay();
    }

    updateFunctionInfo() {
        const info = this.calculateFunctionInfo();
        const infoContent = document.getElementById('infoContent');
        
        infoContent.innerHTML = info.map(item => 
            `<div class="info-item">${item}</div>`
        ).join('');
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new FunctionPlotter();
});
