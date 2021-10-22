$(document).ready(function () {

    const Operadoras = Vue.createApp({
        data() {
            return {
                parseHeader: [],
                parseCsv: [],
                inputOperadora : '',
                csvEvent: {}
            }
        },
        methods: {
            csvJson(csv){
                op = this
                var linhas = csv.split("\n")
                var tabela = []
                var headers = linhas[2].split(";")

                op.parseHeader = headers

                linhas.map(function(linha, indexLinha){
                    if (indexLinha < 3) return // Pular a header

                    if ((linha.indexOf(op.inputOperadora.toUpperCase()) == -1) && (linha.indexOf(op.inputOperadora) == -1)) {
                        return
                    } // Filtro da busca

                    var obj = {}
                    var celulas = linha.split(";")
                    
                    headers.map(function(coluna, indexColuna){
                        obj[coluna] = celulas[indexColuna]
                    })
                    
                    tabela.push(obj)
                })

                $("table").addClass("resultado-busca");
                $(".msg").html("")
                
                return tabela
            },
            carregarCsv(e) {
                var op = this;
                op.csvEvent = e;
                if (window.FileReader) {

                    var reader = new FileReader();
                    reader.readAsText(e.target.files[0]);

                    if (e.target.files[0].name != "Relatorio_cadop.csv") {
                        alert('Por favor, selecione o arquivo "Relatorio_cadop.csv"\n\nCaminho: "./csv/"')
                        return
                    }

                    reader.onload = function(event) {
                        var csv = event.target.result;
                        op.parseCsv = op.csvJson(csv)
                    };
                    
                    reader.onerror = function(evt) {
                        if(evt.target.error.name == "NotReadableError") {
                            alert("Não foi possível ler o arquivo")
                        }
                    };

                } 
                else {
                    alert('Este navegador não suporta FileReader')
                }
            },
            buscarOperadoras(e) {
                var op = this;
                if (op.parseHeader == "") {
                    $(".msg").html("Abra o CSV antes de realizar a busca")
                    e.preventDefault();
                    return
                }
                if (op.inputOperadora == "") {
                    $(".msg").html("Insira algo na caixa de texto")
                    e.preventDefault();
                    return
                }
                e.preventDefault();
                op.carregarCsv(op.csvEvent)
                $(".msg").html("")
            }
        }
    });
    
    Operadoras.mount("#app")
});