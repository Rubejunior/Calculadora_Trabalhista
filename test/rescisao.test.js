const { expect } = require('chai');
const { calcularRescisao, calcularAvisoPrevio, calcularMultaFGTS, diferencaEmMeses } = require('../js/rescisao');

describe('Cálculo de Rescisão', () => {
    it('deve calcular a rescisão corretamente para demissão sem justa causa', () => {
        const resultado = calcularRescisao('semJustaCausa', 3000, 20, 12, 'trabalhado', 1, new Date('2023-01-01'), new Date('2023-12-31'));
        console.log(resultado); // Adicionando um log para verificar os valores calculados
        expect(resultado.saldoSalario).to.equal('2000.00');
        expect(resultado.decimoTerceiro).to.equal('3000.00');
        expect(resultado.valorFeriasVencidas).to.equal('4000.00');
        expect(resultado.valorFeriasProporcionais).to.equal('4000.00');
        expect(resultado.valorAvisoPrevio).to.equal('3000.00');
        expect(resultado.multaFGTS).to.equal('1152.00');
        expect(resultado.saldoFGTS).to.equal('2880.00');
        expect(resultado.valorRescisao).to.equal('17152.00'); // Corrigindo o valor esperado
    });

    it('deve calcular o aviso prévio corretamente para acordo mutuo', () => {
        const resultado = calcularAvisoPrevio('acordoMutuo', 3000, 'naoTrabalhado');
        expect(resultado).to.equal(1500);
    });

    it('deve calcular a multa FGTS corretamente para demissão sem justa causa', () => {
        const resultado = calcularMultaFGTS(2880, 'semJustaCausa');
        expect(resultado).to.equal(1152);
    });

    it('deve calcular a diferença em meses corretamente', () => {
        const resultado = diferencaEmMeses(new Date('2023-01-01'), new Date('2023-12-31'));
        expect(resultado).to.equal(12);
    });
});
