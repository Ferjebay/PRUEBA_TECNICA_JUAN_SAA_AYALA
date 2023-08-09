<script setup lang="ts">
    import jugadorApi from "@/apis/jugadorApi";
    import useUtils from "@/composables/useUtils";
    import { ref, toRef } from 'vue';

    interface Props {valor?: number, color?: string, EvenOrOdd?: string }
    interface Apuesta { jugador: string, monto: number, color: string[], EvenOrOdd: string[], numApuesta: number}
    interface ResultadoApuesta { color: boolean, parImpar: boolean, valorAndColor: boolean, monto: number }

    const { showNotification } = useUtils();

    const emit = defineEmits<{ 
        (e: 'refresListPlayers' ): void, 
        (e: 'juegoNuevo' ): void 
    }>();

    let props = defineProps<{resultado: Props, apuesta: Apuesta }>()
    let resultado   = toRef(props, 'resultado')
    let apuesta     = toRef(props, 'apuesta')

    const resultadoApuesta = ref<ResultadoApuesta>({ 
        color: false, 
        parImpar: false, 
        valorAndColor: false,
        monto: apuesta.value.monto,
    });

    //Si acierta en el color gana la mitad del monsto apostado
    if ( apuesta.value.color?.includes( resultado.value.color as string )){
        resultadoApuesta.value.monto += apuesta.value.monto / 2
        resultadoApuesta.value.color = true;
    }
    //Si acierta si es par o impar gana la cantidad del monto apostado
    if ( apuesta.value.EvenOrOdd.includes((resultado.value.EvenOrOdd as string).toLowerCase())){
        resultadoApuesta.value.monto += apuesta.value.monto
        resultadoApuesta.value.parImpar = true;
    }
    //Si acierta el color y numero dado ganara el triple del monto dado
    if ( apuesta.value.color?.includes( resultado.value.color as string) &&
       apuesta.value.numApuesta === resultado.value.valor ){
        resultadoApuesta.value.monto += apuesta.value.monto * 3;
        resultadoApuesta.value.valorAndColor = true;
    }
    //Si el usuario no acierta en su apuesta perdera el monto dado
    if ( !resultadoApuesta.value.color && !resultadoApuesta.value.parImpar && !resultadoApuesta.value.valorAndColor) {
        resultadoApuesta.value.monto = 0;
    }

    const submit = async () => {
        await jugadorApi.post("/Game", { 
            montoApostado: apuesta.value.monto,
            nombre: apuesta.value.jugador,
            monto: resultadoApuesta.value.monto
        });

        showNotification(`Se guardo el monto del jugador ${ apuesta.value.jugador }`, "success");
        emit('juegoNuevo');
    }

</script>

<template>
    <div class="col-2 cardResultado">
        <div class="card mr-3" style="height: 120px; width: 133%;border: none;">
            <div class="card-header headerCard pt-0">
                {{ apuesta.jugador }}
            </div>
            <div class="card-body apuesta-info">
                <table style="width: 103%;">
                    <tr class="row-label">
                        <td class="fw-medium text-center" colspan="2">RESULTADO DEL JUEGO</td>
                    </tr>
                    <tr class="row-label">
                        <td class="fw-medium">Monto Apostado:</td>
                        <td class="text-center fs-5">${{ apuesta.monto }}</td>
                    </tr>
                    <tr class="row-label">
                        <td class="fw-medium">Color:</td>
                        <td :class="resultadoApuesta.color ? 'acierto' : 'perdida'">
                            {{ resultadoApuesta.color ? 'Acerto' : 'Perdio' }}
                            <i v-if="resultadoApuesta.color"
                                class="fa-solid fa-circle-check"></i>
                            <i v-else class="fa-regular fa-circle-xmark"></i>
                        </td>
                    </tr>
                    <tr class="row-label">
                        <td class="fw-medium">Par o Impar:</td>
                        <td :class="resultadoApuesta.parImpar ? 'acierto' : 'perdida'">
                            {{ resultadoApuesta.parImpar ? 'Acerto' : 'Perdio' }}
                            <i v-if="resultadoApuesta.color"
                                class="fa-solid fa-circle-check"></i>
                            <i v-else class="fa-regular fa-circle-xmark"></i>
                        </td>
                    </tr>
                    <tr class="row-label">
                        <td class="fw-medium">Color y Valor:</td>
                        <td :class="resultadoApuesta.valorAndColor ? 'acierto' : 'perdida'">
                            {{ resultadoApuesta.valorAndColor ? 'Acerto' : 'Perdio' }}
                            <i v-if="resultadoApuesta.valorAndColor"
                                class="fa-solid fa-circle-check"></i>
                            <i v-else class="fa-regular fa-circle-xmark"></i>
                        </td>
                    </tr>
                </table>
                <h5>Monto Total:</h5>
                <h5 class="fw-normal">${{ resultadoApuesta.monto }}</h5>

                <div @click="submit" 
                    class="button btn btn-primary btn-sm mt-2">
                    Guardar <i class="fa-regular fa-floppy-disk"></i>
                </div>
                <br>
                <div @click="$emit('juegoNuevo')" class="button btn btn-success btn-sm mt-1 mt-3">
                    Juego Nuevo 
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
.cardResultado{
    height: 120px;
    margin-left: 20px;
    position: relative;
    bottom: 18px;
}
.row-label{
    text-align: left;
}
.acierto{
    color: #21500e;
    font-weight: 600;
}
.perdida{
    color: #7a1c11;
    font-weight: 600;
}
.apuesta-info{
    text-align: center;
    background-color: rgb(93, 103, 112);
    height: auto;
    /* border-radius: 15px; */
}
.red{
    background-color: #c41616;
}
.black{
    background-color: #183327;
}
.headerCard{
    background-color: rgb(24, 24, 24);
    color: rgb(29, 89, 141);
    text-align: center;
    font-size: 23px;
}
</style>