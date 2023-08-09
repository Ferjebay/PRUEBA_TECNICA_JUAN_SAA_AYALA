<script setup lang="ts">
    import { ref, watch } from "vue";
    import tablero from "./matriz.json";
    import useUtils from "@/composables/useUtils";
    import LoadingModal from "../components/LoadingModal.vue";
    import ResultadoRuleta from "../components/ResultadoRuleta.vue";
    import ResultadoApuesta from "../components/ResultadoApuesta.vue";
    import AgregarJugador from "../components/AgregarJugador.vue";
    import jugadorApi from "@/apis/jugadorApi";

    interface Result{
        valor?: number, 
        color?: string, 
        EvenOrOdd?: string
    }
    interface Jugador{ id: number, nombre: string, monto: number }
    interface FormJugador{ jugador: string, monto: number, numApuesta: number, color: string[], EvenOrOdd: string[] }

    const formJuego = ref<FormJugador>({
        jugador: '',
        monto: 0,
        numApuesta: 0,
        color: [],
        EvenOrOdd: []
    })

    const loading           = ref( false );
    const resultado         = ref<Result>({ valor: 0, color: '', EvenOrOdd: ''});
    const showResult        = ref( false );
    const cargarMonto       = ref( false );
    const listJugadores     = ref<Jugador[]>([]);
    const { showNotification } = useUtils();

    const getJugadores = async() => {
        try {
            const { data } = await jugadorApi.get('/Game');
            listJugadores.value = data
        } catch (error) {
            console.log("ocurrio un error al consultar los jugadores", error);
        }
    }

    const getResult = async () => {
        if ( formJuego.value.jugador == '' ) 
            return showNotification("Debes elegir un jugador", "warning");        
        if ( formJuego.value.monto <= 0 || formJuego.value.monto == 0  ) 
            return showNotification("Debes Ingresar algun monto", "warning");        
        if ( formJuego.value.numApuesta <= 0 ||  formJuego.value.numApuesta > 36 ) 
            return showNotification("Ingresa un valor entre el rango del 1 al 36", "warning");

        loading.value = true;
        showResult.value = false;

        setTimeout( async() => { 
            loading.value = false 

            const { data: valueRandom } = await jugadorApi.get("/Game/numberRandom")
    
            for (let index = 0; index < tablero.length; index++) {    
                const respuesta = tablero[index].find( celda => celda.valor === valueRandom)
                if(respuesta !== undefined){
                    resultado.value = respuesta
                    resultado.value.EvenOrOdd = respuesta.valor % 2 == 0 ? 'PAR' : 'IMPAR'
                    showResult.value = true;
                    break;
                }            
            }
        }, 1000);
    }

    const addPlayer = ( jugador: string ) => {
        const lastId = listJugadores.value[ listJugadores.value.length - 1 ].id;
        listJugadores.value.push({
            id: lastId + 1,
            nombre: jugador,
            monto: 0
        })
    }

    const juegoNuevo = () => {
        showResult.value = false;
        formJuego.value.jugador = ''
        formJuego.value.monto = 0;
        formJuego.value.numApuesta = 0;
        formJuego.value.color = [];
        formJuego.value.EvenOrOdd = [];
        cargarMonto.value = false;
        getJugadores();
    }

    watch(cargarMonto, ( newValue, _ ) => {
        if ( newValue ) {
            const jugador = listJugadores.value.find(j => j.nombre === formJuego.value.jugador);
            formJuego.value.monto = jugador!.monto
        }else{
            formJuego.value.monto = 0;
        }
    })

    getJugadores();
</script>
<template>
    <div class="row">
        <ResultadoRuleta v-if="showResult" :resultado="resultado" />

        <div class="col-7 bg-secondary p-4" :class="!showResult ? 'offset-2' : ''">
            <table class="table table-bordered mb-0" style="width: 100%;">
                <tbody>
                    <tr v-for="row in tablero.length">
                        <td v-for="value in tablero[row - 1]" class="celda"
                            :class="value.color == 'red' ? 'red' : 'black' ">
                            {{ value.valor }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <ResultadoApuesta v-if="showResult" 
            @refresListPlayers="getJugadores" @juegoNuevo="juegoNuevo"
            :resultado="resultado" :apuesta="formJuego" />        
    </div>

    <div class="row pt-3">
        <div class="col-3 offset-4 ml-5 text-center" style="position: relative;left: 33px;">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label" style="margin-right: 70px;">
                    Jugador
                </label>
                <div style="display: flex;">
                    <select v-model="formJuego.jugador" :disabled="showResult"
                        class="form-select" aria-label="Default select example"
                         style="width: 70%;">
                        <option v-for="j in listJugadores" :value="j.nombre">
                            {{ j.nombre }}
                        </option>
                    </select>
                    <button class="btn btn-success ml-4" style="margin-left: 12px;" 
                        data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <i class="fa-solid fa-square-plus"></i>
                    </button>
                </div>
            </div>
            <div style="display: flex;">
                <div class="mb-3" style="margin-right: 11px;">
                    <label for="exampleFormControlInput1" class="form-label">Monto</label>
                    <input v-model="formJuego.monto" :disabled="showResult"
                        type="number" step="0.00" min="0" class="form-control" placeholder="Monto a Apostar">
                </div>
                <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label">Num. de Apuesta</label>
                    <input v-model="formJuego.numApuesta" :disabled="showResult"
                        type="number" step="0.00" class="form-control" placeholder="Monto a Apostar">
                </div>
            </div>
            <div class="mb-3">
                <div class="form-check form-check-inline">
                    <input v-model="formJuego.color" class="form-check-input" :disabled="showResult"
                        type="checkbox" id="inlineCheckbox1" value="red">
                    <label class="form-check-label" for="inlineCheckbox1">ROJO</label>
                </div>
                <div class="form-check form-check-inline ml-5">
                    <input v-model="formJuego.color" class="form-check-input" :disabled="showResult"
                        type="checkbox" id="inlineCheckbox2" value="black">
                    <label class="form-check-label" for="inlineCheckbox2">NEGRO</label>
                </div>
            </div>
            <div class="mb-3">
                <div class="form-check form-check-inline">
                    <input v-model="formJuego.EvenOrOdd" class="form-check-input" :disabled="showResult"
                        type="checkbox" id="inlineCheckbox3" value="par">
                    <label class="form-check-label" for="inlineCheckbox3">PAR</label>
                </div>
                <div class="form-check form-check-inline ml-5">
                    <input v-model="formJuego.EvenOrOdd" class="form-check-input" :disabled="showResult"
                        type="checkbox" id="inlineCheckbox4" value="impar">
                    <label class="form-check-label" for="inlineCheckbox4">IMPAR</label>
                </div>
            </div>
        </div>

        <div v-if="formJuego.jugador !== ''" class="col-3">
            <div style="margin-top: 35px;">
                <label for="cargarMonto">Cargar Monto</label>
                <input v-model="cargarMonto" style="margin-left: 9px;margin-top: 5px;" :disabled="showResult"
                    class="form-check-input" id="cargarMonto" type="checkbox">
            </div>
        </div>

        <div class="col-12 text-center" v-if="!showResult">
            <button @click="getResult" class="btn btn-success">
                JUGAR
            </button>
        </div>
    </div>

    <LoadingModal v-if="loading" />
    <AgregarJugador @addPlayer="addPlayer" />
</template>

<style scoped>
.celda{
    text-align: center;
    color: bisque;
    font-weight: 700;
    padding: 20px 1px;
}
.red{
    background-color: #c41616;
    width: 8.33%;
}
.black{
    background-color: #183327;
    width: 8.33%;
}
</style>