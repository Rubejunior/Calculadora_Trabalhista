document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript carregado");

    document.getElementById("calculadoraRescisao").onsubmit = function(event) {
        event.preventDefault();

        let motivoRescisao = document.getElementById("motivoRescisao").value;
        let salarioBruto = parseFloat(document.getElementById("salarioBruto").value);
        let diasTrabalhados = parseInt(document.getElementById("diasTrabalhados").value);
        let dataInicio = new Date(document.getElementById("dataInicio").value);
        let dataTermino = new Date(document.getElementById("dataTermino").value);
        let avisoPrevio = document.getElementById("avidoPrevio").value;
        let numeroFeriasVencidas = parseInt(document.getElementById("feriasVencidas").value);
        let mesesTrabalhadosNoAno = parseInt(document.getElementById("mesesTrabalhados").value);

        console.log("Formulário enviado");

        let resultadoRescisao = calcularRescisao(motivoRescisao, salarioBruto, diasTrabalhados, 
                                                 mesesTrabalhadosNoAno, avisoPrevio, numeroFeriasVencidas,
                                                 dataInicio, dataTermino);
        
        document.getElementById("resultado").innerHTML = `
            <p>Saldo de Salário: R$ ${resultadoRescisao.saldoSalario}</p>
            <p>Férias Vencidas: R$ ${resultadoRescisao.valorFeriasVencidas}</p>
            <p>Férias Proporcionais: R$ ${resultadoRescisao.valorFeriasProporcionais}</p>
            <p>13º Salário Proporcional: R$ ${resultadoRescisao.decimoTerceiro}</p>
            <p>Valor do Aviso Prévio: R$ ${resultadoRescisao.valorAvisoPrevio}</p>
            <p>Multa do FGTS: R$ ${resultadoRescisao.multaFGTS}</p>
            <p>FGTS a Sacar: R$ ${resultadoRescisao.saldoFGTS}</p>
            <p><strong>Valor Total da Rescisão: R$ ${resultadoRescisao.valorRescisao}</strong></p>
        `;

        document.getElementById("resultado").classList.add("visivel");
    };

    function calcularRescisao(motivoRescisao, salarioBruto, diasTrabalhados, mesesTrabalhadosNoAno, 
                              avisoPrevio, numeroFeriasVencidas, dataInicio, dataTermino) {
        let mesesTrabalhadosTotal = diferencaEmMeses(dataInicio, dataTermino);
        let saldoSalario = (salarioBruto / 30) * diasTrabalhados;
        let decimoTerceiro = motivoRescisao === "comJustaCausa" ? 0 : (salarioBruto / 12) * mesesTrabalhadosNoAno;
        let valorFeriasVencidas = (salarioBruto + (salarioBruto / 3)) * numeroFeriasVencidas;
        let valorFeriasProporcionais = motivoRescisao === "comJustaCausa" ? 0 : ((salarioBruto / 12) * mesesTrabalhadosNoAno) + ((salarioBruto / 12) * mesesTrabalhadosNoAno) / 3;
        let valorAvisoPrevio = calcularAvisoPrevio(motivoRescisao, salarioBruto, avisoPrevio);
        let saldoFGTS = salarioBruto * 0.08 * mesesTrabalhadosTotal;
        let multaFGTS = calcularMultaFGTS(saldoFGTS, motivoRescisao);

        let valorRescisao = saldoSalario + valorAvisoPrevio + valorFeriasVencidas + valorFeriasProporcionais +
                            decimoTerceiro + multaFGTS;

        return {
            saldoSalario: saldoSalario.toFixed(2),
            decimoTerceiro: decimoTerceiro.toFixed(2),
            valorFeriasVencidas: valorFeriasVencidas.toFixed(2),
            valorFeriasProporcionais: valorFeriasProporcionais.toFixed(2),
            valorAvisoPrevio: valorAvisoPrevio.toFixed(2),
            multaFGTS: multaFGTS.toFixed(2),
            saldoFGTS: saldoFGTS.toFixed(2),
            valorRescisao: valorRescisao.toFixed(2)
        };
    }

    function calcularAvisoPrevio(motivoRescisao, salarioBruto, avisoPrevio) {
        if (motivoRescisao === "acordoMutuo") {
            return avisoPrevio === "naoTrabalhado" ? salarioBruto / 2 : salarioBruto;
        }
        return avisoPrevio === "trabalhado" || avisoPrevio === "indenizado" ? salarioBruto : 0;
    }

    function calcularMultaFGTS(saldoFGTS, motivoRescisao) {
        if (motivoRescisao === "semJustaCausa" || motivoRescisao === "rescisaoIndireta") {
            return saldoFGTS * 0.4;
        } else if (motivoRescisao === "acordoMutuo") {
            return saldoFGTS * 0.2;
        }
        return 0;
    }

    function diferencaEmMeses(dataInicio, dataTermino) {
        let anos = dataTermino.getFullYear() - dataInicio.getFullYear();
        let meses = dataTermino.getMonth() - dataInicio.getMonth() + (anos * 12);
        return meses;
    }
});
