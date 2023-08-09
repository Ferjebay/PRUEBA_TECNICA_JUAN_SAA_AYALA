<script setup lang="ts">
    import { ref, watch } from 'vue';
    import useUtils from "@/composables/useUtils";

    const jugador = ref('');
    const { showNotification } = useUtils();

    const emit = defineEmits<{ (e: 'addPlayer', jugador: string): void }>();

    const agregarJugador = () => {
        document.getElementById("closeModal")!.click();
        showNotification("Se agrego el nuevo jugador", "success")
        emit('addPlayer', jugador.value.toUpperCase());
    }
    
    watch( jugador, (newValue, _) => {
        jugador.value = newValue.toUpperCase();
    })

</script>

<template>
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content bg-dark">
        <div class="modal-header text-center">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Agregar Jugador</h1>
            <button type="button" id="closeModal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-6 offset-3">
                    <input type="text" v-model="jugador"
                    class="form-control" style="background-color: #b3afab;">
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button @click="agregarJugador" type="button" class="btn btn-primary">Agregar</button>
        </div>
        </div>
    </div>
    </div>
</template>

<style scoped>

</style>