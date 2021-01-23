(() => {
    const BTN_REINICIAR = "btnReiniciar"
    const ID_CONTADOR = "contador"
    const VALOR_CONTADOR = 100
    const PERIODO_INTERVALO = 10

    class ContadorComponent {

        constructor() {
            this.inicializar();
        }

        prepararContadorProxy() {
            const handler = {
                set: (currentContext, propertyKey, newValue) => {
                    console.log({ currentContext, propertyKey, newValue })

                    if (!currentContext.valor) {
                        currentContext.efetuarParada()
                    }

                    currentContext[propertyKey] = newValue
                    return true
                }
            }

            const contador = new Proxy({
                valor: VALOR_CONTADOR,
                efetuarParada: () => { }
            }, handler)

            return contador
        }

        atualizarTexto = ({ elementoContador, contador }) => () => {
            const identificadorTexto = '$$contador'
            const textoPadrao = `Começando em <strong>${identificadorTexto}</strong> segundos ...`

            elementoContador.innerHTML = textoPadrao.replace(identificadorTexto, contador.valor--)
        }

        agendarParadaIntervalo({ elementoContador, idIntervalo }) {
            return () => {
                clearInterval(idIntervalo)

                elementoContador.innerHTML = ""
                this.desabilitarBotao(false);
            }
        }

        prepararBotao(elementoBotao, iniciarFn) {
            elementoBotao.addEventListener('click', iniciarFn.bind(this))

            return (valor = true) => {
                const atributo = 'disabled'

                if (valor) {
                    elementoBotao.setAttribute(atributo, valor)
                    return;
                }

                elementoBotao.removeAttribute(atributo)
            }
        }

        inicializar() {
            console.log('inicou parça')
            const elementoContador = document.getElementById(ID_CONTADOR)

            const contador = this.prepararContadorProxy();

            const argumentos = {
                elementoContador,
                contador
            }

            const fn = this.atualizarTexto(argumentos)
            const idIntervalo = setInterval(fn, PERIODO_INTERVALO)

            {
                const elementoBotao = document.getElementById(BTN_REINICIAR)
                const desabilitarBotao = this.prepararBotao(elementoBotao, this.inicializar)
                desabilitarBotao()

                const argumentos = { elementoContador, idIntervalo }
                const pararContadorFn = this.agendarParadaIntervalo.apply({ desabilitarBotao }, [argumentos])
                contador.efetuarParada = pararContadorFn
            }
        }
    }

    window.ContadorComponent = ContadorComponent
})()